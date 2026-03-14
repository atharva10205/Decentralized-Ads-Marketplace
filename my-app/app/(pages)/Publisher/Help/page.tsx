'use client'

import { useState } from 'react';
import {
    ChevronDown, ChevronRight, Search, BookOpen, Zap, Globe, Wallet,
    BarChart2, Shield, MessageSquare, ExternalLink, ArrowRight, Hash
} from 'lucide-react';
import Sidebar from '../sidebar/sidebar';

// ============================================================
// 🎨 ACCENT COLOR — change this to theme the entire dashboard
// ============================================================
const ACCENT = '#ffffff';
const accentAlpha = (opacity: number) => {
    const r = parseInt(ACCENT.slice(1, 3), 16);
    const g = parseInt(ACCENT.slice(3, 5), 16);
    const b = parseInt(ACCENT.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${opacity})`;
};
// ============================================================

interface FaqItem {
    q: string;
    a: string;
}

interface Section {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    faqs: FaqItem[];
}

const SECTIONS: Section[] = [
    {
        id: 'getting-started',
        icon: Zap,
        title: 'Getting Started',
        description: 'Everything you need to go from zero to earning.',
        faqs: [
            {
                q: 'How do I register my website?',
                a: 'Go to the Websites tab, click "Add Website", and paste your domain. We\'ll generate a verification snippet — add it to your site\'s <head> and click Verify. Active status usually appears within 60 seconds.',
            },
            {
                q: 'What do I need to start earning?',
                a: 'A connected Solana wallet, at least one verified website, and traffic. That\'s it. Once your site is active, clicks start generating earnings immediately.',
            },
            {
                q: 'Which wallets are supported?',
                a: 'Any Solana-compatible wallet works — Phantom, Backpack, Solflare, and Ledger are the most common. Connect via the wallet button in the top-right corner.',
            },
        ],
    },
    {
        id: 'websites',
        icon: Globe,
        title: 'Websites & Verification',
        description: 'Managing your properties and keeping them active.',
        faqs: [
            {
                q: 'Why is my website stuck on PENDING?',
                a: 'Verification checks that our snippet is present and publicly accessible. Make sure the tag is inside <head> (not <body>), the page isn\'t behind a login, and there\'s no caching layer serving a stale version. Re-check from the Websites tab after clearing your CDN cache.',
            },
            {
                q: 'Can I add multiple websites?',
                a: 'Yes — there\'s no hard limit. Each website gets its own verification tag and tracks impressions, clicks, and earnings independently.',
            },
            {
                q: 'What happens if my site goes offline?',
                a: 'Earnings pause automatically. Once the site is reachable again and the snippet is detected, the status returns to ACTIVE and earnings resume without any action needed on your part.',
            },
        ],
    },
    {
        id: 'earnings',
        icon: Wallet,
        title: 'Earnings & Payouts',
        description: 'How SOL accumulates and how to claim it.',
        faqs: [
            {
                q: 'How is my earnings amount calculated?',
                a: 'Earnings are based on valid clicks — impressions alone don\'t count. Each qualifying click adds a micro-amount of SOL to your unclaimed balance. CTR quality affects the rate: high-CTR traffic earns more per impression than low-quality sources.',
            },
            {
                q: 'When can I claim my earnings?',
                a: 'You can claim at any time from the Earnings tab. There\'s no minimum threshold. Claimed SOL is sent directly to your connected wallet, typically settling within one Solana block (~400 ms).',
            },
            {
                q: 'What is the difference between Claimed and Pending?',
                a: '"Pending" is your unclaimed balance sitting in the protocol. "Claimed" is the total you\'ve already withdrawn to your wallet. The Analytics page shows both per-website and in aggregate.',
            },
            {
                q: 'Are there any fees?',
                a: 'A small protocol fee is deducted at claim time to cover Solana transaction costs. The exact fee is shown in the claim confirmation before you sign.',
            },
        ],
    },
    {
        id: 'analytics',
        icon: BarChart2,
        title: 'Analytics',
        description: 'Understanding your performance data.',
        faqs: [
            {
                q: 'What does CTR mean and why does it matter?',
                a: 'Click-Through Rate (CTR) is clicks divided by impressions, expressed as a percentage. Higher CTR indicates engaged, genuine traffic and directly affects your earnings rate. The bar in Earnings by Website is sized by CTR so you can spot your best-performing properties at a glance.',
            },
            {
                q: 'How far back does the clicks chart go?',
                a: 'The main chart shows the last 7 days. Longer-range data is available via the API — see the API section below.',
            },
            {
                q: 'Why do some days show zero clicks?',
                a: 'Zero days are real — they mean no qualifying clicks were recorded. Bot traffic, ad blockers, and low-traffic periods all contribute. We filter aggressively for quality, so zero is always better than inflated numbers.',
            },
        ],
    },
    {
        id: 'security',
        icon: Shield,
        title: 'Security & Privacy',
        description: 'How we protect your account and your visitors.',
        faqs: [
            {
                q: 'Do you store visitor data?',
                a: 'We record anonymised click events — no PII, no cookies, no fingerprinting. The snippet is a lightweight, privacy-first tracker that complies with GDPR and CCPA out of the box.',
            },
            {
                q: 'Can someone fake clicks to inflate my earnings?',
                a: 'We run multi-layer fraud detection on every event. Clicks flagged as bot traffic, click farms, or self-clicks are discarded before they reach your balance. Repeated abuse from a single property results in suspension.',
            },
            {
                q: 'Is my wallet key ever stored on your servers?',
                a: 'Never. All signing happens client-side in your wallet extension. We only ever see your public address.',
            },
        ],
    },
];

const QUICK_LINKS = [
    { label: 'Add your first website', icon: Globe, section: 'websites' },
    { label: 'Claim earnings', icon: Wallet, section: 'earnings' },
    { label: 'Read analytics guide', icon: BarChart2, section: 'analytics' },
    { label: 'Security overview', icon: Shield, section: 'security' },
];

const FaqRow = ({ item }: { item: FaqItem }) => {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="border-b border-gray-800/60 last:border-0"
            style={{ borderColor: open ? accentAlpha(0.12) : undefined }}
        >
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between py-4 text-left group"
            >
                <span className={`text-sm font-medium transition-colors duration-150 ${open ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                    {item.q}
                </span>
                <ChevronDown
                    className="w-4 h-4 text-gray-600 flex-shrink-0 ml-4 transition-transform duration-200"
                    style={{
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: open ? ACCENT : undefined,
                    }}
                />
            </button>
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open ? '300px' : '0px' }}
            >
                <p className="text-sm text-gray-500 leading-relaxed pb-4 pr-8">{item.a}</p>
            </div>
        </div>
    );
};

const Help = () => {
    const activeTab = 'Help';
    const [search, setSearch] = useState('');
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const query = search.toLowerCase().trim();
    const filtered: Section[] = query
        ? SECTIONS.map(s => ({
              ...s,
              faqs: s.faqs.filter(f =>
                  f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query)
              ),
          })).filter(s => s.faqs.length > 0 || s.title.toLowerCase().includes(query))
        : SECTIONS;

    const scrollTo = (id: string) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-300">
            <Sidebar activeTab={activeTab} />

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-5xl mx-auto px-8 py-10">

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Help & Support</h1>
                        <p className="text-gray-600 text-sm">Answers, guides, and everything in between.</p>
                    </div>

                    {/* Search */}
                    <div className="relative mb-10">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search for anything…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#111111] border border-gray-800/70 rounded-xl pl-11 pr-5 py-3.5 text-sm text-gray-200 placeholder-gray-700 outline-none transition-all duration-200 focus:border-gray-600"
                            style={{ caretColor: ACCENT }}
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                            >
                                clear
                            </button>
                        )}
                    </div>

                    {/* Quick links — hidden during search */}
                    {!query && (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                            {QUICK_LINKS.map(link => (
                                <button
                                    key={link.label}
                                    onClick={() => scrollTo(link.section)}
                                    className="bg-[#111111] border border-gray-800/70 rounded-xl p-4 text-left hover:border-gray-600 hover:-translate-y-0.5 transition-all duration-200 group"
                                >
                                    <link.icon className="w-4 h-4 text-gray-600 mb-3 group-hover:text-gray-400 transition-colors" />
                                    <p className="text-xs text-gray-400 leading-snug group-hover:text-gray-200 transition-colors">{link.label}</p>
                                    <ArrowRight className="w-3 h-3 text-gray-700 mt-2 group-hover:translate-x-0.5 transition-transform" style={{ color: accentAlpha(0.4) }} />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Section nav — hidden during search */}
                    {!query && (
                        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
                            {SECTIONS.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => scrollTo(s.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-150 border"
                                    style={
                                        activeSection === s.id
                                            ? { color: ACCENT, borderColor: accentAlpha(0.3), background: accentAlpha(0.06) }
                                            : { color: '#4b5563', borderColor: 'transparent', background: 'transparent' }
                                    }
                                >
                                    <s.icon className="w-3 h-3" />
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No results */}
                    {filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Search className="w-8 h-8 text-gray-800 mb-4" />
                            <p className="text-gray-500 text-sm">No results for <span className="text-gray-300 font-mono">"{search}"</span></p>
                            <p className="text-gray-700 text-xs mt-1">Try a different term or <button onClick={() => setSearch('')} className="underline hover:text-gray-500 transition-colors">browse all topics</button></p>
                        </div>
                    )}

                    {/* Sections */}
                    <div className="space-y-5">
                        {filtered.map(section => (
                            <div
                                key={section.id}
                                id={section.id}
                                className="bg-[#111111] border border-gray-800/70 rounded-xl overflow-hidden"
                            >
                                {/* Section header */}
                                <div className="px-6 pt-6 pb-5 border-b border-gray-800/60">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-[#1a1a1a] border border-gray-800/60 rounded-lg flex-shrink-0">
                                            <section.icon className="w-4 h-4 text-gray-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-widest">{section.title}</h2>
                                            <p className="text-xs text-gray-600 mt-0.5">{section.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQs */}
                                <div className="px-6">
                                    {section.faqs.map((faq, i) => (
                                        <FaqRow key={i} item={faq} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact footer */}
                    <div className="mt-8 bg-[#111111] border border-gray-800/70 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-[#1a1a1a] border border-gray-800/60 rounded-lg">
                                <MessageSquare className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-200">Still stuck?</p>
                                <p className="text-xs text-gray-600 mt-0.5">Our team responds within a few hours on most days.</p>
                            </div>
                        </div>
                        <a
                            href="mailto:support@example.com"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-medium transition-all duration-150 hover:-translate-y-0.5"
                            style={{
                                color: ACCENT,
                                borderColor: accentAlpha(0.25),
                                background: accentAlpha(0.06),
                            }}
                        >
                            Contact support
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    <p className="text-center text-xs text-gray-800 mt-8 pb-4 font-mono">
                        {new Date().getFullYear()} — publisher platform docs
                    </p>

                </div>
            </main>
        </div>
    );
};

export default Help;