use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};
use mpl_token_metadata::state::{Metadata, PREFIX, get_master_edition};

anchor_lang::declare_id!("cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ");

#[program]
pub mod sol_race_staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, _bump: u8) -> ProgramResult {
        let pool_account = &mut ctx.accounts.pool_account;

        pool_account.pool_authority = ctx.accounts.pool_authority.key();
        pool_account.garage_creator = ctx.accounts.garage_creator.key();
        pool_account.kart_creator = ctx.accounts.kart_creator.key();
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>) -> ProgramResult {

        let garage_token_account = &ctx.accounts.garage_token_account;
        let user = &ctx.accounts.user;
        let garage_mint_account = &ctx.accounts.garage_mint;


        // Check the owner of the token account
        require!(garage_token_account.owner == user.key(), ErrorCode::InvalidOwner);

        // Check the mint on the token account
        require!(garage_token_account.mint == garage_mint_account.key(), ErrorCode::InvalidMint);

        // Check the amount on the token account
        require!(garage_token_account.amount == 1, ErrorCode::InvalidAmount);


        // ? verify master edition 

        
        let garage_metadata_account = &ctx.accounts.garage_metadata_account;
        let garage_mint_account_pubkey = ctx.accounts.garage_mint.key();
        let metadata_seeds = &[
            "metadata".as_bytes(),
            ctx.accounts.token_metadata_program.key.as_ref(),
            garage_mint_account_pubkey.as_ref()
        ];


        let (metadata_derived_key, _bump_seed) = Pubkey::find_program_address(
            metadata_seeds, 
            ctx.accounts.token_metadata_program.key
        );

        // Check that the derived key is the current metadata account key
        assert_eq!(metadata_derived_key, garage_metadata_account.key());

        if ctx.accounts.garage_metadata_account.data_is_empty() {
            return Err(ErrorCode::EmptyMetadata.into())
        }


        let metadata_full_account = &mut Metadata::from_account_info(&ctx.accounts.garage_metadata_account)?;

        let full_meta_clone = metadata_full_account.clone();

        assert_eq!(
            full_meta_clone.data.creators.as_ref().unwrap()[0].address, 
            ctx.accounts.pool_account.garage_creator.key()
        );

        if !full_meta_clone.data.creators.unwrap()[0].verified {
            return Err(ErrorCode::NotVerified.into())
        }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(bump : u8)]
pub struct Initialize<'info> {
    signer: Signer<'info>,

    #[account(init, 
        seeds = ["sol_race_pool".as_ref()],
        bump,
        payer = signer)]
    pool_account: Account<'info, PoolAccount>,

    pool_authority: AccountInfo<'info>,

    garage_creator: AccountInfo<'info>,

    kart_creator: AccountInfo<'info>,

    system_program : Program<'info, System>
}

#[derive(Accounts)]
pub struct Stake<'info> {
    pub user: Signer<'info>,

    
    #[account(init, 
        // seeds = [],
        // bump,
        payer = user)]
    pub staking_account: Account<'info, StakingAccount>,

    
    pub garage_mint: Account<'info, Mint>,

    pub pool_account: Account<'info, PoolAccount>,


    pub garage_token_account: Account<'info, TokenAccount>,

    pub garage_metadata_account: AccountInfo<'info>,

    #[account(address = mpl_token_metadata::id())]
    pub token_metadata_program : AccountInfo<'info>,

    system_program : Program<'info, System>
}

#[account]
#[derive(Default)]
pub struct PoolAccount {
    pub pool_authority: Pubkey,

    pub garage_creator: Pubkey,

    pub kart_creator: Pubkey,

    // pub last_distributed: i64,

    // pub global_reward_index: u64,

    // pub total_distribution: u64,
}

#[account]
#[derive(Default)]
pub struct StakingAccount {
    pub reward_index: u64,
    pub pending_reward: u64,
    pub staker: Pubkey,
    pub garage_mint: Pubkey,
    pub garage_token_account: Pubkey,
    pub garage_metadata_account: Pubkey,

    pub success_rate: i8,
}

#[error]
pub enum ErrorCode {
    #[msg("Invalid owner")]
    InvalidOwner, 
    #[msg("Invalid mint")]
    InvalidMint, 
    #[msg("Invalid token amount")]
    InvalidAmount, 
    #[msg("Empty Metadata")]
    EmptyMetadata, 
    #[msg("Creator not verified")]
    NotVerified, 
}