use anchor_lang::prelude::*;
use anchor_spl::token::Transfer;

anchor_lang::declare_id!("J15WvsBaKL81rDA5kdjEpmdUGC7Y7dR9iMUbwevDkbdq");

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

        let cpi_accounts = Transfer {
            from: ctx.accounts.pool_authority.to_account_info(),
            to: ctx.accounts.pool_solr.to_account_info(),
            authority: ctx.accounts.signer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_spl::token::transfer(cpi_ctx, total_distribution as u64)?;

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
        kart_account.kart_mint = ctx.accounts.kart_mint.key();
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

    pub fn withdraw(ctx: Context<Withdraw>) -> Result<()> {
        msg!("Withdraw");
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        let pool_account = &mut ctx.accounts.pool_account;
        let staking_account = &mut ctx.accounts.staking_account;

        compute_reward(pool_account, current_time);
        compute_staker_reward(staking_account, pool_account);
        let amount = staking_account.pending_reward;
        staking_account.pending_reward = 0;

        let pool_name = pool_account.pool_name.as_ref();
        let seeds = &[
            pool_name.trim_ascii_whitespace(),
            b"pool_account",
            &[pool_account.bumps.pool_account],
        ];
        let signer = &[&seeds[..]];
        // Compute global reward & staker reward
        let cpi_accounts = Transfer {
            from: ctx.accounts.pool_solr.to_account_info(),
            to: ctx.accounts.user_solr.to_account_info(),
            authority: pool_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        anchor_spl::token::transfer(cpi_ctx, amount as u64)?;
        Ok(())
    }

    pub fn upgrade_kart(ctx: Context<UpgradeKart>) -> Result<()> {
        let kart_account = &mut ctx.accounts.kart_account;
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_solr.to_account_info(),
            to: ctx.accounts.pool_solr.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        // 2 per upgrade
        // TODO: dynamic fee
        anchor_spl::token::transfer(cpi_ctx, 2000000)?;
        // TODO: distribute to staker only some 2% and burn or collect the rest
        ctx.accounts.pool_account.total_distribution = ctx
            .accounts
            .pool_account
            .total_distribution
            .checked_add(2000000)
            .unwrap();

        // TODO: random
        kart_account.max_speed += 1;
        kart_account.acceleration += 25;
        kart_account.drift_power_consumption_rate += 0.02;
        kart_account.drift_power_generation_rate += 0.02;
        kart_account.handling += 10;

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
