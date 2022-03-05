use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Mint, Token};

use crate::account::{PoolBumps, PoolAccount, StakingAccount};
use crate::utils::{ TrimAsciiWhitespace };
use crate::ErrorCode;


/// TODO: remove pool name
#[derive(Accounts)]
#[instruction(pool_name: String, bumps: PoolBumps )]
pub struct Initialize<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(init, 
        seeds = [pool_name.as_bytes(),b"pool_account"],
        bump,
        payer = signer)]
    pub pool_account: Account<'info, PoolAccount>,
    #[account(mut)]
    /// CHECK
    pub staking_authority: AccountInfo<'info>,
    #[account(mut,
        constraint = pool_authority.owner == *staking_authority.to_account_info().key,
        constraint = pool_authority.mint == *solr_mint.to_account_info().key
      )]
    pub pool_authority: Box<Account<'info, TokenAccount>>,
    /// CHECK
    pub garage_creator: AccountInfo<'info>,
    #[account(constraint = solr_mint.key() == pool_authority.mint)]
    pub solr_mint : Account<'info, Mint>,
    #[account(init,
        token::mint = solr_mint,
        token::authority = pool_authority,
        seeds = [pool_name.as_bytes(), b"pool_solr"],
        bump,
        payer = staking_authority)]
    pub pool_solr : Account<'info, TokenAccount>,
    pub system_program : Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}


#[derive(Accounts)]
pub struct VerifyNFT<'info> {
    // The owner of the NFT
    pub user: Signer<'info>,

    // The mint account of the NFT
    pub garage_mint: Account<'info, Mint>,

    // The token account ie. account that user uses to hold the NFT
    #[account(
        constraint = garage_token_account.owner == user.key(),
        constraint = garage_token_account.mint == garage_mint.key(),
        constraint = garage_token_account.amount == 1
      )]
    pub garage_token_account: Account<'info, TokenAccount>,

    /// CHECK The metadata account of the NFT
    pub garage_metadata_account: AccountInfo<'info>,

    #[account(address = mpl_token_metadata::id())]
    pub token_metadata_program: AccountInfo<'info>,
    
    pub creature_edition: AccountInfo<'info>,

    #[account(
      seeds = [
        pool_account.pool_name.as_ref().trim_ascii_whitespace(),
        "pool_account".as_ref()
      ],
      bump = pool_account.bumps.pool_account,
    )]
    pub pool_account: Account<'info, PoolAccount>
}



#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct InitStake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut,
      seeds = [
        pool_account.pool_name.as_ref().trim_ascii_whitespace(),
        "pool_account".as_ref()
      ],
      bump = pool_account.bumps.pool_account,
    )]
    pub pool_account: Account<'info, PoolAccount>,
    #[account(init, 
      seeds = [
        b"staking_account",
        pool_account.pool_name.as_ref().trim_ascii_whitespace(),
        user.key().as_ref(),
        garage_token_account.key().as_ref(),
      ],
      bump,
      payer = user
    )]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(constraint = solr_mint.key() == pool_account.solr_mint)]
    pub solr_mint : Account<'info, Mint>,
    ///  Verify NFT
    pub garage_mint: Account<'info, Mint>,
    // The token account ie. account that user uses to hold the NFT
    #[account(
      constraint = garage_token_account.owner == user.key() @ ErrorCode::InvalidOwner,
      constraint = garage_token_account.mint == garage_mint.key() @ ErrorCode::InvalidMint,
      constraint = garage_token_account.amount == 1 @ ErrorCode::InvalidAmount
    )]
    pub garage_token_account: Account<'info, TokenAccount>,
    // The metadata account of the NFT
    pub garage_metadata_account: AccountInfo<'info>,
    // pub garage_metadata_account : UncheckedAccount<'info>,
    // nft master edition
    pub creature_edition: AccountInfo<'info>,
    // pub creature_edition : UncheckedAccount<'info>,
    #[account(address = mpl_token_metadata::id())]
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program : Program<'info, System>
}


#[derive(Accounts)]
pub struct Bond<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut,
      seeds = [
        pool_account.pool_name.as_ref().trim_ascii_whitespace(),
        "pool_account".as_ref()
      ],
      bump = pool_account.bumps.pool_account,
    )]
    pub pool_account: Account<'info, PoolAccount>,
    #[account(mut, 
      seeds = [
        b"staking_account",
        pool_account.pool_name.as_ref().trim_ascii_whitespace(),
        user.key().as_ref(),
        garage_token_account.key().as_ref(),
      ],
      bump = staking_account.bump,
      constraint = staking_account.is_bond == false @ ErrorCode::AlreadyStake
    )]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(constraint = solr_mint.key() == pool_account.solr_mint)]
    pub solr_mint : Account<'info, Mint>,
    ///  Verify NFT
    pub garage_mint: Account<'info, Mint>,
    // The token account ie. account that user uses to hold the NFT
    #[account(
      constraint = garage_token_account.owner == user.key(),
      constraint = garage_token_account.mint == garage_mint.key(),
      constraint = garage_token_account.amount == 1
    )]
    pub garage_token_account: Account<'info, TokenAccount>,
    // The metadata account of the NFT
    pub garage_metadata_account: AccountInfo<'info>,
    // nft master edition
    pub creature_edition: AccountInfo<'info>,
    #[account(address = mpl_token_metadata::id())]
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program : Program<'info, System>
}

#[derive(Accounts)]
pub struct Unbond<'info> {
    pub user: Signer<'info>,
    #[account(mut,
      seeds = [
        pool_account.pool_name.as_ref().trim_ascii_whitespace(),  
        "pool_account".as_ref()
      ],
      bump = pool_account.bumps.pool_account,
    )]
    pub pool_account: Account<'info, PoolAccount>,
    #[account(mut,
      seeds = [
        b"staking_account",
        pool_account.pool_name.as_ref().trim_ascii_whitespace(),
        user.key().as_ref(),
        garage_token_account.key().as_ref(),
      ],
      bump = staking_account.bump,
      constraint = staking_account.is_bond == true @ ErrorCode::NotStake 
    )]
    pub staking_account: Account<'info, StakingAccount>,
    #[account(constraint = solr_mint.key() == pool_account.solr_mint)]
    pub solr_mint : Account<'info, Mint>,
    ///  Verify NFT
    pub garage_mint: Account<'info, Mint>,
    // The token account ie. account that user uses to hold the NFT
    #[account(
      constraint = garage_token_account.owner == user.key(),
      constraint = garage_token_account.mint == garage_mint.key(),
      constraint = garage_token_account.amount == 1
    )]
    pub garage_token_account: Account<'info, TokenAccount>,
    // The metadata account of the NFT
    pub garage_metadata_account: AccountInfo<'info>,
    // nft master edition
    pub creature_edition: AccountInfo<'info>,
    #[account(address = mpl_token_metadata::id())]
    pub token_metadata_program: AccountInfo<'info>,
    pub system_program : Program<'info, System>
}


