use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use mpl_token_metadata::state::{get_master_edition, Metadata, EDITION, PREFIX};

use std::str::FromStr;

anchor_lang::declare_id!("A1oZYpTH1fzuJQcEpFNUUuNA2Poe43TgZrQRWexcmaw");

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
        total_distribution: u64,
        start_time: i64,
        end_time: i64,
    ) -> ProgramResult {
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

    pub fn verify_nft(ctx: Context<VerifyNFT>) -> ProgramResult {
        let nft_token_account = &ctx.accounts.nft_token_account;
        let user = &ctx.accounts.user;
        let nft_mint_account = &ctx.accounts.nft_mint;

        // Check the owner or the token account
        assert_eq!(nft_token_account.owner, user.key());

        // Check the mint on the token account
        assert_eq!(nft_token_account.mint, nft_mint_account.key());

        // Check the amount on the token account
        assert_eq!(nft_token_account.amount, 1);

        let master_edition_seed = &[
            PREFIX.as_bytes(),
            ctx.accounts.token_metadata_program.key.as_ref(),
            nft_token_account.mint.as_ref(),
            EDITION.as_bytes(),
        ];

        let (master_edition_key, _bump_seed) = Pubkey::find_program_address(
            master_edition_seed,
            ctx.accounts.token_metadata_program.key,
        );

        assert_eq!(master_edition_key, ctx.accounts.creature_edition.key());

        if ctx.accounts.creature_edition.data_is_empty() {
            return Err(ErrorCode::NotInitialize.into());
        }

        let nft_metadata_account = &ctx.accounts.nft_metadata_account;

        let nft_mint_account_pubkey = ctx.accounts.nft_mint.key();

        // Seeds for PDS
        let metadata_seed = &[
            "metadata".as_bytes(),
            ctx.accounts.token_metadata_program.key.as_ref(),
            nft_mint_account_pubkey.as_ref(),
        ];

        let (metadata_derived_key, _bump_seed) =
            Pubkey::find_program_address(metadata_seed, ctx.accounts.token_metadata_program.key);

        // Check that the derived key is the current metadata account
        assert_eq!(metadata_derived_key, nft_metadata_account.key());

        if ctx.accounts.nft_metadata_account.data_is_empty() {
            return Err(ErrorCode::NotInitialize.into());
        }

        let metadata_full_account =
            &mut Metadata::from_account_info(&ctx.accounts.nft_metadata_account)?;

        let full_metadata_clone = metadata_full_account.clone();

        assert_eq!(
            full_metadata_clone.data.creators.as_ref().unwrap()[0].address,
            ctx.accounts.pool_account.garage_creator
        );

        if !full_metadata_clone.data.creators.unwrap()[0].verified {
            return Err(ErrorCode::NotVerified.into());
        }

        Ok(())
    }

    pub fn init_stake(ctx: Context<InitStake>, bump: u8) -> ProgramResult {
        let staking_account = &mut ctx.accounts.staking_account;
        staking_account.is_bond = false;
        staking_account.bump = bump;

        Ok(())
    }

    pub fn bond(ctx: Context<Bond>) -> ProgramResult {
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

    pub fn un_bond(ctx: Context<Unbond>) -> ProgramResult {
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

#[error]
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
    #[msg("B")]
    B,
    #[msg("C")]
    C,
    #[msg("D")]
    D,
    #[msg("E")]
    E,
}
