use anchor_lang::prelude::*;
use std::ops::Deref;

use crate::account::{PoolAccount, StakingAccount};

pub fn compute_reward(pool_account: &mut PoolAccount, current_time: i64) {
  if pool_account.total_staked == 0 {
    pool_account.last_distributed = current_time;
    return;
  }

  let mut distributed_amount: u128 = 0;
  if pool_account.start_time <= current_time
    && pool_account.end_time >= pool_account.last_distributed
  {
    let time = pool_account.end_time - pool_account.start_time;

    let distributed_amount_per_sec = (pool_account.total_distribution as u128)
      .checked_div(time as u128)
      .unwrap();

    let passed_time = std::cmp::min(pool_account.end_time, current_time)
      - std::cmp::max(pool_account.start_time, pool_account.last_distributed);

    distributed_amount = distributed_amount_per_sec
      .checked_mul(passed_time as u128)
      .unwrap();
  }

  pool_account.last_distributed = current_time;
  pool_account.global_reward_index += (distributed_amount as u128)
    .checked_div(pool_account.total_staked as u128)
    .unwrap() as u64;
}

pub fn compute_staker_reward(staking_account: &mut StakingAccount, pool_account: &PoolAccount) {
  let bond_amount: u128 = match staking_account.is_bond {
    true => 1,
    false => 0,
  };

  let a = (pool_account.global_reward_index as u128)
    .checked_mul(bond_amount)
    .unwrap();
  let b = (staking_account.reward_index as u128)
    .checked_mul(bond_amount)
    .unwrap();

  let pending_reward = a.checked_sub(b).unwrap();

  staking_account.reward_index = pool_account.global_reward_index;

  staking_account.pending_reward += pending_reward as u64;
}

pub fn increase_bond_amount(staking_account: &mut StakingAccount, pool_account: &mut PoolAccount) {
  pool_account.total_staked += 1;
  staking_account.is_bond = true;
}

pub fn decrease_bond_amount(staking_account: &mut StakingAccount, pool_account: &mut PoolAccount) {
  pool_account.total_staked += 1;
  staking_account.is_bond = false;
}

pub trait TrimAsciiWhitespace {
  /// Trim ascii whitespace (based on `is_ascii_whitespace()`) from the
  /// start and end of a slice.
  fn trim_ascii_whitespace(&self) -> &[u8];
}

impl<T: Deref<Target = [u8]>> TrimAsciiWhitespace for T {
  fn trim_ascii_whitespace(&self) -> &[u8] {
    let from = match self.iter().position(|x| !x.is_ascii_whitespace()) {
      Some(i) => i,
      None => return &self[0..0],
    };
    let to = self.iter().rposition(|x| !x.is_ascii_whitespace()).unwrap();
    &self[from..=to]
  }
}
