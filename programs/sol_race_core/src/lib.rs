use anchor_lang::prelude::*;

anchor_lang::declare_id!("4tcD8pgdaSn4yzWQybKuKzSXpW3uoDugFY6owNUhhexd");

mod account;
mod context;

mod utils;

use account::*;
use context::*;
use utils::*;

#[program]
pub mod sol_race_core {
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
        pool_account.kart_creator = ctx.accounts.kart_creator.key();
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
        &ctx.accounts.pool_account.garage_creator,
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
        &ctx.accounts.pool_account.garage_creator,
        &ctx.accounts.garage_token_account,
        &ctx.accounts.garage_metadata_account,
        &ctx.accounts.garage_mint,
        &ctx.accounts.creature_edition,
        &ctx.accounts.token_metadata_program,
    ))]
    pub fn init_stake(ctx: Context<InitStake>, bump: u8) -> Result<()> {
        msg!("INIT STAKE");
        let staking_account = &mut ctx.accounts.staking_account;
        staking_account.is_bond = false;
        staking_account.bump = bump;
        staking_account.garage_mint = ctx.accounts.garage_mint.key();
        staking_account.garage_token_account = ctx.accounts.garage_token_account.key();
        staking_account.garage_metadata_account = ctx.accounts.garage_metadata_account.key();
        staking_account.garage_master_edition = ctx.accounts.creature_edition.key();

        Ok(())
    }

    #[access_control(verify_nft(
        &ctx.accounts.pool_account.kart_creator,
        &ctx.accounts.kart_token_account,
        &ctx.accounts.kart_metadata_account,
        &ctx.accounts.kart_mint,
        &ctx.accounts.creature_edition,
        &ctx.accounts.token_metadata_program,
    ))]
    pub fn init_kart(ctx: Context<InitKart>, bump: u8) -> Result<()> {
        let kart_account = &mut ctx.accounts.kart_account;
        kart_account.bump = bump;
        kart_account.owner = ctx.accounts.user.key();
        kart_account.kart_mint = ctx.accounts.kart_mint.key();
        kart_account.kart_token_account = ctx.accounts.kart_token_account.key();
        kart_account.kart_metadata_account = ctx.accounts.kart_metadata_account.key();
        kart_account.kart_master_edition = ctx.accounts.creature_edition.key();

        Ok(())
    }

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

    pub fn upgrade_kart(ctx: Context<UpgradeKart>) -> Result<()> {
        // we can let user stake even if the distribution period is end,
        // they will only receive fee from upgrading
        let kart_account = &mut ctx.accounts.kart_account;
        // TODO: random
        kart_account.max_speed += 1;
        kart_account.acceleration += 1;
        kart_account.drift_power_consumption_rate += 1;
        kart_account.drift_power_generation_rate += 1;
        kart_account.handling += 1;

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
