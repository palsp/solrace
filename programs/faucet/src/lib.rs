use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, MintTo, Token, TokenAccount};
use std::ops::Deref;

anchor_lang::declare_id!("GCNWK7b12pN6i11yNRKnwZ8TYFFLTbTXMZuSJ98qqFEY");

#[program]
pub mod faucet {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        token_name: String,
        bumps: Bumps,
        _decimals: u8,
    ) -> Result<()> {
        msg!("INITIALIZE");
        let faucet_account = &mut ctx.accounts.faucet_account;

        let name_bytes = token_name.as_bytes();
        let mut name_data = [b' '; 10];
        name_data[..name_bytes.len()].copy_from_slice(name_bytes);

        faucet_account.token_name = name_data;
        faucet_account.bumps = bumps;
        Ok(())
    }

    pub fn mint(ctx: Context<FaucetMint>) -> Result<()> {
        msg!("MINT");
        let faucet_account = &ctx.accounts.faucet_account;
        let token_name = faucet_account.token_name.as_ref();
        let seeds = &[
            token_name.trim_ascii_whitespace(),
            &[faucet_account.bumps.faucet_account],
        ];

        let signer = &[&seeds[..]];
        let cpi_accounts = MintTo {
            mint: ctx.accounts.token_mint.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.faucet_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        let decimals = ctx.accounts.token_mint.decimals;
        anchor_spl::token::mint_to(cpi_ctx, 1000000 * (10 as i32).pow(decimals as u32) as u64)?;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(token_name: String, bump: Bumps, decimals: u8)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub faucet_authority: Signer<'info>,

    #[account(init,
        seeds = [token_name.as_bytes()],
        bump,
        payer = faucet_authority)]
    pub faucet_account: Account<'info, FaucetAccount>,

    #[account(init,
        mint::decimals = decimals,
        mint::authority = faucet_account,
        seeds = [token_name.as_bytes(), b"token_mint".as_ref()],
        bump,
        payer = faucet_authority)]
    pub token_mint: Box<Account<'info, Mint>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct FaucetMint<'info> {
    #[account(mut)]
    pub user_authority: Signer<'info>,

    #[account(mut,
        seeds = [faucet_account.token_name.as_ref().trim_ascii_whitespace()],
        bump = faucet_account.bumps.faucet_account,
    )]
    pub faucet_account: Account<'info, FaucetAccount>,

    #[account(mut,
        seeds = [faucet_account.token_name.as_ref().trim_ascii_whitespace(), b"token_mint".as_ref()],
        bump,
    )]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(mut,
        constraint = user_token_account.owner == user_authority.key(),
        constraint = user_token_account.mint == token_mint.key())]
    pub user_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(Default)]
pub struct FaucetAccount {
    pub token_name: [u8; 10],
    pub bumps: Bumps,
}

#[derive(AnchorSerialize, AnchorDeserialize, Default, Clone)]
pub struct Bumps {
    pub faucet_account: u8,
    pub token_mint: u8,
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
