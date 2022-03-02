use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};

anchor_lang::declare_id!("EZfQMJmBpjDxVYj8x9MK4tQ1rtnJrudsxYahqQVkS2QQ");

#[program]
pub mod candy_core {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct VerifyNFT<'info> {
    pub signer: Signer<'info>,

    pub nft_mint: Account<'info, Mint>,

    pub nft_token_account: Account<'info, TokenAccount>,

    pub nft_metadata_account: AccountInfo<'info>,
}
