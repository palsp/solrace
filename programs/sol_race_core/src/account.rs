use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone)]
pub struct PoolBumps {
  pub pool_account: u8,
  pub pool_solr: u8,
}

#[account]
#[derive(Default)]
pub struct PoolAccount {
  pub pool_name: [u8; 10],
  pub pool_authority: Pubkey,
  pub garage_creator: Pubkey,
  pub kart_creator: Pubkey,
  pub staking_authority: Pubkey,
  pub solr_mint: Pubkey,
  pub pool_solr: Pubkey,
  pub bumps: PoolBumps,
  pub total_distribution: u128,
  pub total_staked: u128,
  pub start_time: i64,
  pub end_time: i64,
  pub last_distributed: i64,
  pub global_reward_index: f64,
}

#[account]
#[derive(Default)]
pub struct StakingAccount {
  pub staker: Pubkey,
  pub garage_mint: Pubkey,
  pub garage_token_account: Pubkey,
  pub garage_metadata_account: Pubkey,
  pub garage_master_edition: Pubkey,
  pub is_bond: bool,
  pub bump: u8,
  pub reward_index: f64,
  pub pending_reward: u128,
}

#[account]
#[derive(Default)]
pub struct KartAccount {
  pub owner: Pubkey,
  pub bump: u8,
  pub kart_mint: Pubkey,
  pub kart_token_account: Pubkey,
  pub kart_metadata_account: Pubkey,
  pub kart_master_edition: Pubkey,
  pub max_speed: u64,
  pub acceleration: u64,
  pub drift_power_generation_rate: f64,
  pub drift_power_consumption_rate: f64,
  pub handling: u64,
}
