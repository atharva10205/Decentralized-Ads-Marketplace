'use client'

const HelpPage = () => {
    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const filterCards = (q: string) => {
        const query = q.toLowerCase().trim();
        document.querySelectorAll<HTMLElement>('.help-card').forEach(card => {
            const text = ((card.dataset.text ?? '') + ' ' + card.innerText).toLowerCase();
            card.style.display = (query.length > 1 && !text.includes(query)) ? 'none' : '';
        });
        document.querySelectorAll<HTMLElement>('.help-section').forEach(sec => {
            const visible = [...sec.querySelectorAll<HTMLElement>('.help-card')].some(c => c.style.display !== 'none');
            sec.style.opacity = (query.length > 1 && !visible) ? '0.2' : '1';
        });
    };

    const toc = [
        { id: 's1', label: 'Campaign basics', color: '#6366f1' },
        { id: 's2', label: 'Funds & vault', color: '#22c55e' },
        { id: 's3', label: 'Withdrawals', color: '#f59e0b' },
        { id: 's4', label: 'Publishers', color: '#ef4444' },
        { id: 's5', label: 'Analytics', color: '#a855f7' },
        { id: 's6', label: 'Deleting', color: '#3b82f6' },
    ];

    const sections = [
        {
            id: 's1', num: '01', color: '#6366f1', title: 'Campaign basics',
            cards: [
                {
                    text: 'what is a campaign how does it work',
                    q: 'What is a campaign?',
                    a: (
                        <div className="help-card-a">
                            A campaign is an on-chain ad unit tied to your Solana wallet. It holds a budget inside a <code>vault</code> PDA, tracks clicks and impressions in our database, and pays publishers per click automatically.
                            <div className="help-flow">
                                {['Create campaign', 'Deposit SOL', 'Go live', 'Pay per click'].map((n, i, arr) => (
                                    <span key={n} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span className="flow-node">{n}</span>
                                        {i < arr.length - 1 && <span className="flow-arr">→</span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    text: 'active paused status campaign',
                    q: 'When does my campaign go Active vs Paused?',
                    a: (
                        <div className="help-card-a">
                            <div className="pill-row">
                                <span className="pill ok">Active — vault has funds</span>
                                <span className="pill warn">Paused — vault empty or withdrawn</span>
                            </div>
                            <span className="accent-block">Status is set on-chain inside the <code>Ad</code> account's <code>is_active</code> flag. After a withdrawal the contract sets it to <code>false</code> automatically. Depositing funds flips it back to <code>true</code>.</span>
                        </div>
                    ),
                },
                {
                    text: 'edit campaign title description tags keywords',
                    q: 'What can I edit after launch?',
                    a: <div className="help-card-a">You can edit title, description, business name, image URL, tags, and keywords at any time — these are stored in our database only, not on-chain. Cost per click and wallet address are locked forever once the campaign is created.</div>,
                },
            ],
        },
        {
            id: 's2', num: '02', color: '#22c55e', title: 'Funds & vault',
            cards: [
                {
                    text: 'add funds deposit sol vault how',
                    q: 'How does depositing work?',
                    a: (
                        <div className="help-card-a">
                            <div className="step-list">
                                {[
                                    <>You choose a click count → we calculate <strong>clicks × CPC = total SOL</strong></>,
                                    <>A <strong>1% platform fee</strong> is deducted before the rest goes to the vault</>,
                                    <>The <code>deposit</code> instruction sends lamports directly on-chain — no custodian</>,
                                    <>Our DB updates max clicks + total budget to reflect the new deposit</>,
                                ].map((t, i) => (
                                    <div key={i} className="step">
                                        <div className="step-n">{i + 1}</div>
                                        <div className="step-t">{t}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    text: 'remaining budget balance vault how calculated',
                    q: 'How is "Remaining Budget" calculated?',
                    a: (
                        <div className="help-card-a">
                            <code>vault_lamports − (totalClicks × CPC × 1e9) − min_rent</code>
                            <span className="accent-block">We read the raw on-chain vault balance, subtract what's owed to publishers (all recorded clicks), and subtract Solana's minimum rent. This is exactly what the contract will send when you withdraw — so the UI always matches the wallet popup.</span>
                        </div>
                    ),
                },
                {
                    text: 'platform fee 1% cost',
                    q: 'What is the 1% platform fee?',
                    a: <div className="help-card-a">On every deposit, <code>amount × 10 / 1000</code> (= 1%) goes to the platform fee wallet. This is calculated and sent on-chain inside the <code>deposit</code> contract instruction — it's not something we control after the fact.</div>,
                },
            ],
        },
        {
            id: 's3', num: '03', color: '#f59e0b', title: 'Withdrawals',
            cards: [
                {
                    text: 'withdraw funds how refund',
                    q: 'How do I withdraw unused funds?',
                    a: (
                        <div className="help-card-a">
                            <div className="step-list">
                                {[
                                    <>Click <strong>Withdraw funds</strong> and enter a recipient Solana address</>,
                                    <>We calculate <strong>vault − publisher owed − min rent</strong> as the withdrawable amount</>,
                                    <>Your wallet signs the <code>refund</code> transaction — only the advertiser wallet can do this</>,
                                    <>Campaign is <strong>paused immediately</strong> on-chain after withdrawal</>,
                                ].map((t, i) => (
                                    <div key={i} className="step">
                                        <div className="step-n">{i + 1}</div>
                                        <div className="step-t">{t}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
                {
                    text: 'wallet popup amount different why',
                    q: 'Why does the wallet popup match the UI now?',
                    a: <div className="help-card-a">The contract accepts an explicit <code>withdraw_amount</code> — we pass it exactly as <code>rawLamports − totalOwedLamports</code>, computed in integer lamports before any float division. The UI displays the same integer divided by 1e9, so there's no floating-point drift between what you see and what you sign.</div>,
                },
                {
                    text: 'publishers protected owed claimed',
                    q: 'Are publishers protected during a withdrawal?',
                    a: (
                        <div className="help-card-a">
                            Yes. The contract enforces <code>withdraw_amount ≤ vault − min_rent</code>, and we pass <code>withdraw_amount = vault − totalOwedLamports</code>. Publisher earnings are never included in what you withdraw.
                            <div className="pill-row">
                                <span className="pill warn">Advertiser cannot withdraw publisher funds</span>
                                <span className="pill ok">Publishers can still claim after you withdraw</span>
                            </div>
                        </div>
                    ),
                },
            ],
        },
        {
            id: 's4', num: '04', color: '#ef4444', title: 'Publishers',
            cards: [
                {
                    text: 'publisher click earn claim how',
                    q: 'How do publishers earn and claim?',
                    a: (
                        <div className="help-card-a">
                            Clicks are tracked in our DB. Publisher earnings accumulate in an <code>EarningsRecord</code> PDA (<code>claimable_amount</code>). Publishers call <code>claim</code> themselves — the vault signs the transfer to their wallet. We pay no gas for this.
                            <span className="accent-block">Our DB is the data layer, the chain is the money layer. Clicks don't need to be recorded on-chain per-transaction.</span>
                        </div>
                    ),
                },
                {
                    text: 'unclaimed clicks what are they',
                    q: 'What are "unclaimed clicks"?',
                    a: <div className="help-card-a">Clicks recorded in the DB that haven't been settled on-chain yet. The SOL for these is still in the vault. This is why remaining budget uses <code>totalClicks</code> (not just unclaimed) — both claimed and unclaimed earnings are owed.</div>,
                },
            ],
        },
        {
            id: 's5', num: '05', color: '#a855f7', title: 'Analytics',
            cards: [
                {
                    text: 'ctr impressions clicks analytics',
                    q: 'How are analytics calculated?',
                    a: (
                        <div className="help-card-a">
                            <div className="pill-row">
                                {['Clicks — DB count', 'Impressions — sum of impression table', 'CTR — clicks / impressions × 100', 'Budget used — spent / total × 100'].map(p => (
                                    <span key={p} className="pill">{p}</span>
                                ))}
                            </div>
                            <span className="accent-block">All analytics are derived from our Postgres DB, not from on-chain data. This is faster and doesn't cost RPC calls per page load.</span>
                        </div>
                    ),
                },
                {
                    text: 'budget used spent remaining clicks left',
                    q: 'What does "Budget Used %" mean?',
                    a: <div className="help-card-a"><code>spentSOL / totalBudgetSOL × 100</code> — where <code>spentSOL = totalClicks × CPC</code> and <code>totalBudgetSOL</code> is the cumulative SOL deposited across all top-ups. Turns red above 85%.</div>,
                },
            ],
        },
        {
            id: 's6', num: '06', color: '#3b82f6', title: 'Deleting a campaign',
            cards: [
                {
                    text: 'delete campaign how when can i',
                    q: 'When can I delete a campaign?',
                    a: (
                        <div className="help-card-a">
                            Only when <code>AmountNull = true</code> — meaning you've already withdrawn all funds. This prevents accidentally deleting a campaign with money locked inside.
                            <div className="pill-row">
                                <span className="pill warn">Cannot delete with remaining vault balance</span>
                                <span className="pill ok">Withdraw first, then delete</span>
                            </div>
                        </div>
                    ),
                },
                {
                    text: 'delete s3 image removed database',
                    q: 'What gets deleted?',
                    a: <div className="help-card-a">The Postgres <code>Ad</code> record, all associated click/impression rows, and the S3 image (if one was uploaded). The on-chain <code>Ad</code> PDA and <code>vault</code> PDA are <strong>not</strong> closed — Solana accounts require a separate close instruction to reclaim rent.</div>,
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-[#080808] text-gray-400 font-mono">
            <style>{`
                .help-card-a { font-size: 11px; color: #52525b; line-height: 1.75; }
                .help-card-a code { font-size: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; padding: 1px 5px; color: #a1a1aa; font-family: inherit; }
                .help-card-a strong { color: #a1a1aa; font-weight: 500; }
                .accent-block { display: block; padding: 10px 14px; background: rgba(255,255,255,0.02); border-left: 2px solid rgba(255,255,255,0.08); border-radius: 0 6px 6px 0; margin-top: 10px; font-size: 10px; color: #52525b; line-height: 1.7; }
                .pill-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
                .pill { font-size: 10px; padding: 3px 10px; border-radius: 99px; border: 1px solid rgba(255,255,255,0.06); color: #52525b; background: rgba(255,255,255,0.02); }
                .pill.warn { border-color: rgba(239,68,68,0.2); color: rgba(239,68,68,0.6); background: rgba(239,68,68,0.04); }
                .pill.ok { border-color: rgba(34,197,94,0.2); color: rgba(34,197,94,0.6); background: rgba(34,197,94,0.04); }
                .step-list { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
                .step { display: flex; align-items: flex-start; gap: 12px; }
                .step-n { width: 18px; height: 18px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 9px; color: #52525b; flex-shrink: 0; margin-top: 1px; }
                .step-t { font-size: 11px; color: #71717a; line-height: 1.6; }
                .help-flow { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
                .flow-node { font-size: 10px; padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.06); color: #71717a; background: #0a0a0a; }
                .flow-arr { color: #3f3f46; font-size: 12px; }
            `}</style>

            {/* Nav */}
            <div className="sticky top-0 z-30 bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.04]">
                <div className="max-w-4xl mx-auto px-8 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-300 transition-colors duration-150 border-none bg-transparent font-mono cursor-pointer"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                            Back
                        </button>
                        <span className="text-xs text-gray-700">/</span>
                        <span className="text-xs text-gray-700">Help & Documentation</span>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full border border-white/[0.08] text-gray-600 bg-white/[0.02]">v1.0</span>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-8 py-12 pb-20">

                {/* Hero */}
                <div className="mb-12">
                    <p className="text-[10px] text-gray-700 uppercase tracking-[0.2em] mb-3">Documentation</p>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">How it works</h1>
                    <p className="text-xs text-gray-700">Everything you need to know about campaigns, funds, and on-chain mechanics.</p>
                </div>

                {/* Search */}
                <div className="relative mb-10">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    <input
                        onChange={e => filterCards(e.target.value)}
                        placeholder="Search docs…"
                        className="w-full bg-[#0e0e0e] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-xs text-gray-300 placeholder-gray-700 font-mono outline-none focus:border-white/[0.14] transition-colors"
                    />
                </div>

                {/* TOC */}
                <div className="grid grid-cols-3 gap-2 mb-12">
                    {toc.map(t => (
                        <button
                            key={t.id}
                            onClick={() => scrollTo(t.id)}
                            className="flex items-center gap-2.5 bg-[#0e0e0e] border border-white/[0.05] rounded-xl px-4 py-3.5 hover:border-white/[0.1] hover:bg-[#111] transition-all duration-150 cursor-pointer text-left"
                        >
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: t.color }} />
                            <span className="text-[11px] text-gray-500">{t.label}</span>
                        </button>
                    ))}
                </div>

                {/* Sections */}
                {sections.map((sec, si) => (
                    <div key={sec.id}>
                        <div id={sec.id} className="help-section mb-10">
                            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/[0.04]">
                                <span className="text-[10px] tracking-[0.15em]" style={{ color: sec.color }}>{sec.num}</span>
                                <span className="text-[13px] text-zinc-200 font-semibold">{sec.title}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                {sec.cards.map((card, ci) => (
                                    <div
                                        key={ci}
                                        className="help-card bg-[#0e0e0e] border border-white/[0.05] rounded-xl p-5"
                                        data-text={card.text}
                                    >
                                        <div className="flex items-start gap-2.5 mb-3">
                                            <span className="text-[9px] tracking-[0.1em] text-gray-700 border border-white/[0.06] rounded px-1.5 py-0.5 flex-shrink-0 mt-0.5">Q</span>
                                            <span className="text-xs text-zinc-200">{card.q}</span>
                                        </div>
                                        {card.a}
                                    </div>
                                ))}
                            </div>
                        </div>
                        {si < sections.length - 1 && <div className="h-px bg-white/[0.03] mb-10" />}
                    </div>
                ))}

                <div className="text-center text-[10px] text-gray-700 pt-6 border-t border-white/[0.04] tracking-[0.1em]">
                    AD PROTOCOL · HELP · v1.0
                </div>
            </div>
        </div>
    );
};

export default HelpPage;