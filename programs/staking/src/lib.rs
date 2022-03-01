use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use mpl_token_metadata::state::{get_master_edition, Metadata, PREFIX};

anchor_lang::declare_id!("cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ");

mod account;
mod context;
mod utils;

use account::*;
use context::*;
use utils::*;

#[program]
pub mod sol_race_staking {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        bumps: PoolBumps,
        total_distribution: u64,
    ) -> ProgramResult {
        let pool_account = &mut ctx.accounts.pool_account;

        pool_account.pool_authority = ctx.accounts.pool_authority.key();
        pool_account.garage_creator = ctx.accounts.garage_creator.key();
        pool_account.staking_authority = ctx.accounts.staking_authority.key();
        pool_account.solr_mint = ctx.accounts.solr_mint.key();
        pool_account.pool_solr = ctx.accounts.pool_solr.key();
        pool_account.bumps = bumps;

        pool_account.total_distribution = total_distribution;

        Ok(())
    }

    pub fn verify_nft(ctx: Context<Stake>) -> ProgramResult {
        let garage_token_account = &ctx.accounts.garage_token_account;
        let user = &ctx.accounts.user;
        let garage_mint_account = &ctx.accounts.garage_mint;

        // Check the owner of the token account
        require!(
            garage_token_account.owner == user.key(),
            ErrorCode::InvalidOwner
        );

        // Check the mint on the token account
        require!(
            garage_token_account.mint == garage_mint_account.key(),
            ErrorCode::InvalidMint
        );

        // Check the amount on the token account
        require!(garage_token_account.amount == 1, ErrorCode::InvalidAmount);

        // ? verify master edition

        let garage_metadata_account = &ctx.accounts.garage_metadata_account;
        let garage_mint_account_pubkey = ctx.accounts.garage_mint.key();
        let metadata_seeds = &[
            "metadata".as_bytes(),
            ctx.accounts.token_metadata_program.key.as_ref(),
            garage_mint_account_pubkey.as_ref(),
        ];

        let (metadata_derived_key, _bump_seed) =
            Pubkey::find_program_address(metadata_seeds, ctx.accounts.token_metadata_program.key);

        // Check that the derived key is the current metadata account key
        assert_eq!(metadata_derived_key, garage_metadata_account.key());

        if ctx.accounts.garage_metadata_account.data_is_empty() {
            return Err(ErrorCode::EmptyMetadata.into());
        }

        let metadata_full_account =
            &mut Metadata::from_account_info(&ctx.accounts.garage_metadata_account)?;

        let full_meta_clone = metadata_full_account.clone();

        assert_eq!(
            full_meta_clone.data.creators.as_ref().unwrap()[0].address,
            ctx.accounts.pool_account.garage_creator.key()
        );

        if !full_meta_clone.data.creators.unwrap()[0].verified {
            return Err(ErrorCode::NotVerified.into());
        }

        Ok(())
    }

    pub fn stake(ctx: Context<Stake>) -> ProgramResult {
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        let pool_account = &mut ctx.accounts.pool_account;
        let staking_account = &mut ctx.accounts.staking_account;

        // Compute global reward & staker reward
        compute_reward(staking_account, pool_account, current_time);
        compute_staker_reward(staking_account, pool_account);

        // Increase staked amount
        pool_account.total_staked += 1;

        Ok(())
    }
    pub fn withdraw(ctx: Context<Withdraw>) -> ProgramResult {
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        let pool_account = &mut ctx.accounts.pool_account;
        let staking_account = &mut ctx.accounts.staking_account;

        // Compute global reward & staker reward
        compute_reward(&config, &mut state, env.block.time.seconds());
        compute_staker_reward(&state, &mut staker_info)?;

        // Increase staked amount
        pool_account.total_staked -= 1;

        Ok(())
    }
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
