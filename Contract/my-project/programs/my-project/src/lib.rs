use anchor_lang::prelude::*;

declare_id!("5AhkXaS77PEWP8pDdQx3SMDbEizqJFns6an8J42dXUuw");

#[program]
pub mod my_project {
    use super::*;

       pub fn initialize_ad(
        ctx: Context<InitializeAd>,
        ad_id: [u8; 32],
        rate_per_view: u64,      // lamports per view
        interval_seconds: i64,   // min seconds between payouts
    ) -> Result<()> {
        let ad = &mut ctx.accounts.ad;
        ad.ad_id = ad_id;
        ad.client = *ctx.accounts.client.key;
        ad.authority = *ctx.accounts.authority.key; // oracle/updater permitted to call payout
        ad.rate_per_view = rate_per_view;
        ad.paid_views = 0;
        ad.interval_seconds = interval_seconds;
        ad.last_payout_ts = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.client.key(),
            &ctx.accounts.vault.to_account_info().key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.client.to_account_info(),
                ctx.accounts.vault.to_account_info(),
            ],
        )?;
        Ok(())
    }

    pub fn payout(ctx: Context<Payout>, current_views_from_db: u64) -> Result<()> {
        let ad = &mut ctx.accounts.ad;

        require_keys_eq!(ad.authority, *ctx.accounts.authority.key, AdError::Unauthorized);

        let clock = Clock::get()?;
        let now = clock.unix_timestamp;
        require!(now >= ad.last_payout_ts + ad.interval_seconds, AdError::PayoutTooSoon);

        if current_views_from_db <= ad.paid_views {
            ad.last_payout_ts = now;
            return Ok(());
        }
        let delta: u64 = current_views_from_db - ad.paid_views;

        let amount128 = (delta as u128)
            .checked_mul(ad.rate_per_view as u128)
            .ok_or(AdError::Overflow)?;
        let amount = u64::try_from(amount128).map_err(|_| AdError::Overflow)?;

        let vault_lamports = ctx.accounts.vault.to_account_info().lamports();
        require!(vault_lamports >= amount, AdError::InsufficientVault);

        // derive bump from stored bump in vault account
        let bump = ctx.accounts.vault.bump;
        let seeds = &[
            b"vault".as_ref(),
            ad.client.as_ref(),
            ad.ad_id.as_ref(),
            &[bump],
        ];
        // kept to use if/when you call invoke_signed; underscore silences unused warning for now
        let _signer_seeds = &[&seeds[..]];

        // direct lamports transfer by mutating accounts (vault is owned by program)
        **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.recipient.to_account_info().try_borrow_mut_lamports()? += amount;

        ad.paid_views = current_views_from_db;
        ad.last_payout_ts = now;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(ad_id: [u8; 32], rate_per_view: u64, interval_seconds: i64)]
pub struct InitializeAd<'info> {
    #[account(init, payer = client, space = 8 + Ad::MAX_SIZE, seeds = [b"ad", client.key().as_ref(), ad_id.as_ref()], bump)]
    pub ad: Account<'info, Ad>,

    /// vault stores just a bump byte (owned by this program)
    #[account(init, payer = client, space = 8 + 1, seeds = [b"vault", client.key().as_ref(), ad_id.as_ref()], bump)]
    pub vault: Account<'info, VaultAccount>,

    #[account(mut)]
    pub client: Signer<'info>,

    /// CHECK: oracle/updater who is allowed to call payout. This is unchecked because the program
    /// only compares the pubkey (ad.authority) to the signer, and does not read/write any account data.
    pub authority: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, seeds = [b"ad", client.key().as_ref(), ad.ad_id.as_ref()], bump)]
    pub ad: Account<'info, Ad>,

    #[account(mut, seeds = [b"vault", client.key().as_ref(), ad.ad_id.as_ref()], bump)]
    pub vault: Account<'info, VaultAccount>,

    #[account(mut)]
    pub client: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Payout<'info> {
    #[account(mut, seeds = [b"ad", ad.client.as_ref(), ad.ad_id.as_ref()], bump)]
    pub ad: Account<'info, Ad>,

    #[account(mut, seeds = [b"vault", ad.client.as_ref(), ad.ad_id.as_ref()], bump)]
    pub vault: Account<'info, VaultAccount>,

    /// CHECK: recipient of payout. This is unchecked because the program only transfers lamports to this account;
    /// no program-owned data is read or written and no authority is assumed for this account.
    #[account(mut)]
    pub recipient: UncheckedAccount<'info>,

    /// caller authority (must equal ad.authority)
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct VaultAccount {
    pub bump: u8,
}

#[account]
pub struct Ad {
    pub ad_id: [u8; 32],         // renamed to avoid collision with declare_id!()
    pub client: Pubkey,
    pub authority: Pubkey,
    pub rate_per_view: u64,   // lamports per view
    pub paid_views: u64,
    pub interval_seconds: i64,
    pub last_payout_ts: i64,
}

impl Ad {
    pub const MAX_SIZE: usize = 32 + 32 + 32 + 8 + 8 + 8 + 8;
}

#[error_code]
pub enum AdError {
    #[msg("Unauthorized.")]
    Unauthorized,
    #[msg("Payout happened too soon.")]
    PayoutTooSoon,
    #[msg("Insufficient vault balance.")]
    InsufficientVault,
    #[msg("Overflow in multiplication.")]
    Overflow,
}
