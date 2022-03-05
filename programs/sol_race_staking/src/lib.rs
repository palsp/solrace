use anchor_lang::prelude::*;

anchor_lang::declare_id!("FkqkswBdMknF3NFxjBFTyVXuCRqBxQMoyLizhPfYebYX");

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
        pool_name: String,
        bumps: PoolBumps,
        total_distribution: u128,
        start_time: i64,
        end_time: i64,
    ) -> Result<()> {
        msg!("INITIALIZE");
        if start_time >= end_time {
            return Err(ErrorCode::InvalidTime.into());
        }
        let pool_account = &mut ctx.accounts.pool_account;

        let name_bytes = pool_name.as_bytes();
        let mut name_data = [b' '; 10];
        name_data[..name_bytes.len()].copy_from_slice(name_bytes);

        pool_account.pool_name = name_data;

        pool_account.pool_authority = ctx.accounts.pool_authority.key();
        pool_account.garage_creator = ctx.accounts.garage_creator.key();
        pool_account.staking_authority = ctx.accounts.staking_authority.key();
        pool_account.solr_mint = ctx.accounts.solr_mint.key();
        pool_account.pool_solr = ctx.accounts.pool_solr.key();
        pool_account.bumps = bumps;

        pool_account.total_distribution = total_distribution;
        pool_account.start_time = start_time;
        pool_account.end_time = end_time;

        Ok(())
    }

    #[access_control(verify_nft(
        &ctx.accounts.pool_account,
        &ctx.accounts.garage_token_account,
        &ctx.accounts.garage_metadata_account,
        &ctx.accounts.garage_mint,
        &ctx.accounts.creature_edition,
        &ctx.accounts.token_metadata_program,
    ))]
    pub fn verify(ctx: Context<VerifyNFT>) -> Result<()> {
        msg!("VERIFY");
        Ok(())
    }

    #[access_control(verify_nft(
        &ctx.accounts.pool_account,
        &ctx.accounts.garage_token_account,
        &ctx.accounts.garage_metadata_account,
        &ctx.accounts.garage_mint,
        &ctx.accounts.creature_edition,
        &ctx.accounts.token_metadata_program,
    ))]
    pub fn init_stake(ctx: Context<InitStake>, bump: u8) -> Result<()> {
        let staking_account = &mut ctx.accounts.staking_account;
        staking_account.is_bond = false;
        staking_account.bump = bump;
        staking_account.garage_mint = ctx.accounts.garage_mint.key();
        staking_account.garage_token_account = ctx.accounts.garage_token_account.key();
        staking_account.garage_metadata_account = ctx.accounts.garage_metadata_account.key();

        Ok(())
    }

    #[access_control(verify_nft(
        &ctx.accounts.pool_account,
        &ctx.accounts.garage_token_account,
        &ctx.accounts.garage_metadata_account,
        &ctx.accounts.garage_mint,
        &ctx.accounts.creature_edition,
        &ctx.accounts.token_metadata_program,
    ))]
    pub fn bond(ctx: Context<Bond>) -> Result<()> {
        msg!("BOND");

        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        let pool_account = &mut ctx.accounts.pool_account;
        let staking_account = &mut ctx.accounts.staking_account;
        // Compute global reward & staker reward
        compute_reward(pool_account, current_time);
        compute_staker_reward(staking_account, pool_account);
        // Increase staked amount
        increase_bond_amount(staking_account, pool_account);

        Ok(())
    }

    #[access_control(verify_nft(
        &ctx.accounts.pool_account,
        &ctx.accounts.garage_token_account,
        &ctx.accounts.garage_metadata_account,
        &ctx.accounts.garage_mint,
        &ctx.accounts.creature_edition,
        &ctx.accounts.token_metadata_program,
    ))]
    pub fn un_bond(ctx: Context<Unbond>) -> Result<()> {
        msg!("UNBOND");
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        let pool_account = &mut ctx.accounts.pool_account;
        let staking_account = &mut ctx.accounts.staking_account;
        // Compute global reward & staker reward
        compute_reward(pool_account, current_time);
        compute_staker_reward(staking_account, pool_account);
        // Decrease staked amount
        decrease_bond_amount(staking_account, pool_account);

        Ok(())
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Not Initialize")]
    NotInitialize,
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
    #[msg("Invalid time")]
    InvalidTime,
    #[msg("Already stake")]
    AlreadyStake,
    #[msg("Not stake")]
    NotStake,
    #[msg("Not master edition")]
    NotMasterEdition,
    #[msg("Invalid Creator")]
    InvalidCreator,
    #[msg("Invalid Metadata")]
    InvalidMetadata,
}
