use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone)]
pub struct PoolBumps {
  pub pool_account: u8,
  pub pool_solr: u8,
}

#[account]
#[derive(Default)]
pub struct PoolAccount {
  pub pool_authority: Pubkey,

  pub garage_creator: Pubkey,

  pub staking_authority: Pubkey,

  pub solr_mint: Pubkey,

  pub pool_solr: Pubkey,

  pub bumps: PoolBumps,

  pub last_distributed: i64,

  pub distribution_per_time: i64,

  pub total_distribution: u64,

  pub total_staked: i64,

  pub global_reward_index: u64,

  pub start: i64,

  pub end: i64,
}

#[account]
#[derive(Default)]
pub struct StakingAccount {
  pub latest_claimed: i64,

  pub pending_reward: u64,

  pub staker: Pubkey,

  pub garage_mint: Pubkey,

  pub garage_token_account: Pubkey,

  pub garage_metadata_account: Pubkey,

  pub success_rate: i8,

  pub reward_index: u64,
}
