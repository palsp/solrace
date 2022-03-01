use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Mint, Token};

use crate::account::{PoolBumps, PoolAccount, StakingAccount};

#[derive(Accounts)]
#[instruction(bumps: PoolBumps )]
pub struct Initialize<'info> {
    pub signer: Signer<'info>,

    #[account(init, 
        seeds = ["pool_account".as_ref()],
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

    pub garage_creator: AccountInfo<'info>,
    
    #[account(constraint = solr_mint.key() == pool_authority.mint)]
    pub solr_mint : Account<'info, Mint>,
    
    #[account(init,
        token::mint = solr_mint,
        token::authority = pool_authority,
        seeds = [b"pool_solr"],
        bump = bumps.pool_solr,
        payer = staking_authority)]
    pub pool_solr : Account<'info, TokenAccount>,

    pub system_program : Program<'info, System>,

    pub token_program: Program<'info, Token>,

    pub rent: Sysvar<'info, Rent>,
}


#[derive(Accounts)]
pub struct Stake<'info> {
    pub user: Signer<'info>,

    #[account(
      seeds = ["pool_account".as_ref()],
      bump = pool_account.bumps.pool_account,
    )]
    pub pool_account: Account<'info, PoolAccount>,


    #[account(init, 
        // seeds = [],
        // bump,
        payer = user)]
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


#[derive(Accounts)]
pub struct Withdraw<'info> {
    pub user: Signer<'info>,

    #[account(mut,
      seeds = ["pool_account".as_ref()],
      bump = pool_account.bumps.pool_account,
    )]
    pub pool_account: Account<'info, PoolAccount>,


    // #[account(constraint = staking_account.owner == user.key())]
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
