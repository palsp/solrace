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
    // 200 solr per multiplier
    pub const UPGRADE_FEE_PER_MULTIPLIER: u64 = 20000000;
    // 1000 solr per unit
    pub const EXCHANGE_MULTIPLIER_FEE_PER_UNIT: u64 = 500000000;

    pub fn initialize(
        ctx: Context<Initialize>,
        pool_name: String,
        bumps: PoolBumps,
        total_distribution: u128,
        start_time: i64,
        end_time: i64,
        multiplier_unit: u128,
        max_multiplier: u128,
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
        pool_account.max_multiplier = max_multiplier;
        pool_account.multiplier_unit = multiplier_unit;

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
        staking_account.multiplier = ctx.accounts.pool_account.multiplier_unit;

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

        // Compute global reward & staker reward
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

    pub fn withdraw_from_treasury(ctx: Context<WithdrawFromTreasury>, amount: u64) -> Result<()> {
        msg!("Withdraw From Treasury");
        require!(
            amount <= ctx.accounts.solr_treasury.amount,
            ErrorCode::BalanceExceed
        );

        let pool_account = &ctx.accounts.pool_account;
        let pool_name = pool_account.pool_name.as_ref();
        let seeds = &[
            pool_name.trim_ascii_whitespace(),
            b"pool_account",
            &[pool_account.bumps.pool_account],
        ];
        let signer = &[&seeds[..]];
        let cpi_accounts = Transfer {
            from: ctx.accounts.solr_treasury.to_account_info(),
            to: ctx.accounts.recipient_solr.to_account_info(),
            authority: pool_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        anchor_spl::token::transfer(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn upgrade_kart(ctx: Context<UpgradeKart>) -> Result<()> {
        let kart_account = &mut ctx.accounts.kart_account;
        // 2 per upgrade
        // TODO: dynamic fee
        let multiplier =
            calculate_multiplier(&ctx.accounts.staking_account, &ctx.accounts.pool_account);
        let fee = (UPGRADE_FEE_PER_MULTIPLIER as f64 * multiplier) as u64;
        require!(
            ctx.accounts.user_solr.amount >= fee,
            ErrorCode::InsufficientFund
        );

        let cpi_accounts = Transfer {
            from: ctx.accounts.user_solr.to_account_info(),
            to: ctx.accounts.pool_solr.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_spl::token::transfer(cpi_ctx, fee)?;

        // TODO: distribute to staker only some 2% and burn or collect the rest
        ctx.accounts.pool_account.total_distribution = ctx
            .accounts
            .pool_account
            .total_distribution
            .checked_add(fee as u128)
            .unwrap();
        kart_account.max_speed += multiplier;
        kart_account.acceleration += 25 as f64 * multiplier;
        kart_account.drift_power_consumption_rate += 0.02 * multiplier;
        kart_account.drift_power_generation_rate += 0.02 * multiplier;
        kart_account.handling += 10 as f64 * multiplier;

        Ok(())
    }

    pub fn exchange_for_multiplier(ctx: Context<ExchangeForMultiplier>, unit: u128) -> Result<()> {
        msg!("EXCHANGE SOLR FOR EXTRA {} MULTIPLIER(S)", unit);
        let clock = Clock::get()?;
        let current_time = clock.unix_timestamp;
        let pool_account = &mut ctx.accounts.pool_account;
        let staking_account = &mut ctx.accounts.staking_account;

        let max_unit = pool_account
            .max_multiplier
            .checked_div(pool_account.multiplier_unit)
            .unwrap();

        let current_multiplier_unit = staking_account
            .multiplier
            .checked_div(pool_account.multiplier_unit)
            .unwrap();

        msg!("current_multiplier_unit {}", current_multiplier_unit);
        let new_unit = current_multiplier_unit.checked_add(unit).unwrap();

        msg!("new_unit {} ", new_unit);
        require!(new_unit <= max_unit, ErrorCode::MaxMultiplierReach);

        let fee = new_unit
            .checked_mul(EXCHANGE_MULTIPLIER_FEE_PER_UNIT as u128)
            .unwrap();

        require!(
            ctx.accounts.user_solr.amount as u128 >= fee,
            ErrorCode::InsufficientFund
        );

        let cpi_accounts = Transfer {
            from: ctx.accounts.user_solr.to_account_info(),
            to: ctx.accounts.solr_treasury.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };

        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_spl::token::transfer(cpi_ctx, fee as u64)?;

        compute_reward(pool_account, current_time);
        compute_staker_reward(staking_account, pool_account);

        pool_account.total_staked += unit * pool_account.multiplier_unit;
        staking_account.multiplier = new_unit * pool_account.multiplier_unit;

        Ok(())
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Not Initialize")]
    NotInitialize,
    #[msg("Invalid owner")]
    InvalidOwner,
    #[msg("Invalid StakingAuthority")]
    InvalidStakingAuthority,
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
    #[msg("Max Multiplier Reach")]
    MaxMultiplierReach,
    #[msg("Insufficient Fund")]
    InsufficientFund,
    #[msg("Balance Exceed")]
    BalanceExceed,
}
