use anchor_lang::prelude::*;

use crate::account::{PoolAccount, StakingAccount};

pub fn compute_reward(
  staking_account: &mut StakingAccount,
  pool_account: &mut PoolAccount,
  current_time: i64,
) {
  if pool_account.last_distributed >= current_time {
    return;
  }

  let mut distributed_amount = 0;
  if pool_account.start <= current_time && pool_account.end >= pool_account.last_distributed {
    let passed_time = std::cmp::min(pool_account.end, current_time)
      - std::cmp::max(pool_account.start, pool_account.last_distributed);

    let time = pool_account.end - pool_account.start;

    let distributed_amount_per_sec = pool_account.end / time;

    distributed_amount = distributed_amount_per_sec * passed_time;
  }

  pool_account.last_distributed = current_time;
  pool_account.global_reward_index =
    pool_account.global_reward_index + distributed_amount as u64 / pool_account.total_staked as u64
}

pub fn compute_staker_reward(staking_account: &mut StakingAccount, pool_account: &PoolAccount) {
  let pending_reward = pool_account.global_reward_index - staking_account.reward_index;

  staking_account.reward_index = pool_account.global_reward_index;

  staking_account.pending_reward += pending_reward;
}
