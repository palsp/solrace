use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, TokenAccount};
use mpl_token_metadata::state::{Metadata, EDITION, PREFIX};

anchor_lang::declare_id!("HuP1D9qVpK61WJc5WoCxkYGGbY1s8wGPXaDM2Rq6pBN");

#[program]
pub mod verify_nft {
    use super::*;
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
            ctx.accounts.creator.key()
        );

        if !full_metadata_clone.data.creators.unwrap()[0].verified {
            return Err(ErrorCode::NotVerified.into());
        }

        msg!("YOUR NFT IS VERIFIED");

        Ok(())
    }
}

#[derive(Accounts)]
pub struct VerifyNFT<'info> {
    // The owner of the NFT
    pub user: Signer<'info>,

    // The mint account of the NFT
    pub nft_mint: Account<'info, Mint>,

    // The token account ie. account that user uses to hold the NFT
    pub nft_token_account: Account<'info, TokenAccount>,

    // The metadata account of the NFT
    pub nft_metadata_account: AccountInfo<'info>,

    #[account(address = mpl_token_metadata::id())]
    pub token_metadata_program: AccountInfo<'info>,

    pub creature_edition: AccountInfo<'info>,

    pub creator: AccountInfo<'info>,
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
}
