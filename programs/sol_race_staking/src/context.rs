use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Mint, Token};

use crate::account::{PoolBumps, PoolAccount, StakingAccount};
use crate::utils::{ TrimAsciiWhitespace };
use crate::ErrorCode;


/// TODO: remove pool name
#[derive(Accounts)]
#[instruction(pool_name: String, bumps: PoolBumps )]
pub struct Initialize<'info> {
    pub signer: Signer<'info>,

    #[account(init, 
        seeds = [pool_name.as_bytes(),b"pool_account"],
        bump = bumps.pool_account,
        payer = signer)]
    pub pool_account: Account<'info, PoolAccount>,

    #[account(mut)]
    pub staking_authority: AccountInfo<'info>,

    #[account(mut,
        constraint = pool_authority.owner == *staking_authority.to_account_info().key,
        constraint = pool_authority.mint == *solr_mint.to_account_info().key
      )]
    pub pool_authority: Box<Account<'info, TokenAccount>>,

    // pub garage_creator: AccountInfo<'info>,
    
    #[account(constraint = solr_mint.key() == pool_authority.mint)]
    pub solr_mint : Account<'info, Mint>,
    
    #[account(init,
        token::mint = solr_mint,
        token::authority = pool_authority,
        seeds = [pool_name.as_bytes(), b"pool_solr"],
        bump = bumps.pool_solr,
        payer = staking_authority)]
    pub pool_solr : Account<'info, TokenAccount>,

    pub system_program : Program<'info, System>,

    pub token_program: Program<'info, Token>,

    pub rent: Sysvar<'info, Rent>,
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
       
    // pub garage_mint: Account<'info, Mint>,

    pub garage_token_account: Account<'info, TokenAccount>,

    // pub garage_metadata_account: AccountInfo<'info>,

    // #[account(address = mpl_token_metadata::id())]
    // pub token_metadata_program : AccountInfo<'info>,

    pub system_program : Program<'info, System>
}


#[derive(Accounts)]
pub struct Stake<'info> {
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
      constraint = staking_account.is_staked == false @ ErrorCode::AlreadyStake
    )]
    pub staking_account: Account<'info, StakingAccount>,

    #[account(constraint = solr_mint.key() == pool_account.solr_mint)]
    pub solr_mint : Account<'info, Mint>,
       
    // pub garage_mint: Account<'info, Mint>,

    pub garage_token_account: Account<'info, TokenAccount>,

    // pub garage_metadata_account: AccountInfo<'info>,

    // #[account(address = mpl_token_metadata::id())]
    // pub token_metadata_program : AccountInfo<'info>,

    pub system_program : Program<'info, System>
}

#[derive(Accounts)]
pub struct UnStake<'info> {
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
        pool_account.pool_name.as_ref().trim_ascii_whitespace(),  
        "pool_account".as_ref()
      ],
      bump = pool_account.bumps.pool_account,
      constraint = staking_account.to_account_info().owner.key() == user.key() @ ErrorCode::A,
      constraint = staking_account.is_staked == true @ ErrorCode::NotStake
    )]
    pub staking_account: Account<'info, StakingAccount>,


    #[account(constraint = solr_mint.key() == pool_account.solr_mint)]
    pub solr_mint : Account<'info, TokenAccount>,
       
    pub garage_mint: Account<'info, Mint>,

    pub garage_token_account: Account<'info, TokenAccount>,

    pub garage_metadata_account: AccountInfo<'info>,

    #[account(address = mpl_token_metadata::id())]
    pub token_metadata_program : AccountInfo<'info>,

    pub system_program : Program<'info, System>
}