use anchor_lang::prelude::*;

declare_id!("6ubogtrpfLTNBtiKeXKgKq1Ug7YTfY8v3VCroZ5neUEw");

#[program]
pub mod my_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
