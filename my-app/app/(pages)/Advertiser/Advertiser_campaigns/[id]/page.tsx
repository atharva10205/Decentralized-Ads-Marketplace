'use client'

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Trash2, Pencil, Save, X, MousePointer, Eye, TrendingUp, Wallet, ArrowDownToLine, AlertTriangle } from 'lucide-react';
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { adIdToBytes, getPDA, getProgram } from '@/lib/solana';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';


type AdData = {
    id: string;
    business_name: string | null;
    title: string | null;
    Description: string | null;
    Tags: string[];
    keywords: string[];
    imageUrl: string | null;
    cost_per_click: string | null;
    Clicks: number | null;
    Cost: string | null;
    RemainingAmount: number | null;
    status: boolean;
};

type Analytics = {
    totalClicks: number;
    totalImpressions: number;
    ctr: string;
    budgetUsed: string;
};

const niches = [
    { id: 'ecommerce', emoji: '🛒', label: 'E-commerce' },
    { id: 'tech', emoji: '💻', label: 'Tech & Software' },
    { id: 'health', emoji: '💊', label: 'Health & Wellness' },
    { id: 'finance', emoji: '💰', label: 'Finance' },
    { id: 'education', emoji: '📚', label: 'Education' },
    { id: 'travel', emoji: '✈️', label: 'Travel' },
    { id: 'food', emoji: '🍕', label: 'Food & Recipe' },
    { id: 'fashion', emoji: '👗', label: 'Fashion' },
    { id: 'gaming', emoji: '🎮', label: 'Gaming' },
    { id: 'realestate', emoji: '🏠', label: 'Real Estate' },
    { id: 'business', emoji: '📈', label: 'Business & Marketing' },
    { id: 'entertainment', emoji: '🎬', label: 'Entertainment' },
    { id: 'lifestyle', emoji: '🌿', label: 'Lifestyle' },
    { id: 'sports', emoji: '⚽', label: 'Sports' },
    { id: 'automotive', emoji: '🚗', label: 'Automotive' },
];

const CampaignPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [ad, setAd] = useState<AdData | null>(null);
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [accent, setAccent] = useState('#ffffff');
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAddress, setWithdrawAddress] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);


    const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!);
    const { connection: walletConnection } = useConnection();
    const wallet = useWallet();

    const alpha = (op: number) => {
        const r = parseInt(accent.slice(1, 3), 16);
        const g = parseInt(accent.slice(3, 5), 16);
        const b = parseInt(accent.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${op})`;
    };

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [keywords, setKeywords] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [Wallet_Address, setWallet_Address] = useState('')
    const [vaultBalance, setVaultBalance] = useState<number | null>(null);
    const [unclaimedClicks, setUnclaimedClicks] = useState(0);



    useEffect(() => {
        const fetch_data = async () => {
            try {
                const res = await fetch(`/api/crud/Advertiser/Advertiser-campaign/${id}`);
                const data = await res.json();
                if (!data.ad) { setLoading(false); return; }
                setAd(data.ad);
                setAnalytics(data.analytics);
                setAccent(data.accent ?? '#ffffff');
                setTitle(data.ad.title ?? '');
                setDescription(data.ad.Description ?? '');
                setBusinessName(data.ad.business_name ?? '');
                setSelectedTags(data.ad.Tags ?? []);
                setKeywords((data.ad.keywords ?? []).join(', '));
                setImageUrl(data.ad.imageUrl ?? '');
                setWallet_Address(data.ad.wallet_address ?? '');
                setUnclaimedClicks(data.analytics.unclaimedClicks ?? 0);
            } catch (err) {
                console.error("Fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetch_data();
    }, [id]);

    useEffect(() => {
        console.log("Wallet_Address", Wallet_Address)


    }, [Wallet_Address])


    useEffect(() => {
        if (!ad) return;
        console.log("ad", ad.id)
    }, [ad])

    useEffect(() => {
        const fetchVaultBalance = async () => {
            if (!Wallet_Address || !ad?.id) return;

            try {
                const PROGRAM_ID = new PublicKey("5AhkXaS77PEWP8pDdQx3SMDbEizqJFns6an8J42dXUuw");

                const adId = adIdToBytes(ad.id)

                const [vaultPDA] = PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("vault"),
                        new PublicKey(Wallet_Address).toBuffer(),
                        Buffer.from(adId),
                    ],
                    PROGRAM_ID
                );

                const lamports = await connection.getBalance(vaultPDA);
                const cpc = Number(ad.cost_per_click ?? 0);
                const reservedForClicks = unclaimedClicks * cpc;
                const sol = (lamports / 1e9) - reservedForClicks;
                setVaultBalance(Math.max(sol, 0));
            } catch (err) {
                console.error("Failed to fetch vault balance:", err);
            }
        };

        fetchVaultBalance();
    }, [Wallet_Address, ad?.id, unclaimedClicks]);

    const removeTag = (tag: string) => setSelectedTags(prev => prev.filter(t => t !== tag));

    const handleSave = async () => {
        setSaving(true);
        await fetch(`/api/crud/Advertiser/Advertiser-campaign/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                Description: description,
                business_name: businessName,
                Tags: selectedTags,
                keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
                imageUrl,
            }),
        });
        setSaving(false);
        setEditing(false);
        const res = await fetch(`/api/crud/Advertiser/Advertiser-campaign/${id}`);
        const data = await res.json();
        setAd(data.ad);
        setSelectedTags(data.ad.Tags ?? []);
    };

    if (loading) return (
        <div className="flex h-screen bg-[#0a0a0a] items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-700 border-t-gray-300 rounded-full animate-spin" />
        </div>
    );

    const statCards = analytics ? [
        { label: 'Total Clicks', value: analytics.totalClicks.toLocaleString(), icon: MousePointer },
        { label: 'Impressions', value: analytics.totalImpressions.toLocaleString(), icon: Eye },
        { label: 'CTR', value: `${analytics.ctr}%`, icon: TrendingUp },
        { label: 'Budget Used', value: `${analytics.budgetUsed}%`, icon: Wallet },
    ] : [];

    const textFields = [
        { label: 'Business Name', value: businessName, set: setBusinessName },
        { label: 'Title', value: title, set: setTitle },
        { label: 'Description', value: description, set: setDescription },
        { label: 'Image URL', value: imageUrl, set: setImageUrl },
    ];


    const Withdraw = async () => {

        if (!ad || !wallet.publicKey) {
            alert("Please connect your wallet first");
            return;
        }
        const program = getProgram(wallet, walletConnection);
        const adID = adIdToBytes(ad.id);
        const { adPDA, vaultPDA: refundVaultPDA } = getPDA(new PublicKey(Wallet_Address), adID);

        const tx = await program.methods.refund().accounts({
            vault: refundVaultPDA,
            ad: adPDA,
            advertiserKey: new PublicKey(Wallet_Address),
            recipient: new PublicKey(withdrawAddress),
            signer: wallet.publicKey,
            system_program: SystemProgram.programId,
        }).rpc();

        if(tx){ 
 console.log("tx",tx)
        }
       

    }
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-300 p-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white font-mono tracking-tight">
                            {ad?.business_name ?? 'Campaign'}
                        </h1>
                        <p className="text-xs text-gray-600 font-mono mt-1 truncate max-w-sm">{id}</p>
                    </div>
                    <div className="flex gap-2">
                        {editing ? (
                            <>
                                <button
                                    onClick={() => setEditing(false)}
                                    className="px-4 py-2 rounded-lg bg-[#161616] border border-gray-800/60 text-gray-400 text-sm font-mono hover:text-gray-200 hover:border-gray-600 transition-all duration-150 flex items-center gap-2"
                                >
                                    <X className="w-3.5 h-3.5" /> Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all duration-150 flex items-center gap-2 disabled:opacity-50"
                                    style={{ background: accent, color: '#000000', border: 'none' }}
                                >
                                    <Save className="w-3.5 h-3.5" />
                                    {saving ? 'Saving…' : 'Save'}
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => setEditing(true)}
                                    className="px-4 py-2 rounded-lg bg-[#161616] border cursor-pointer  border-gray-800/60 text-gray-400 text-sm font-mono hover:text-gray-200 hover:border-gray-600 transition-all duration-150 flex items-center gap-2"
                                >
                                    <Pencil className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                    onClick={() => setShowWithdrawModal(true)}
                                    className="px-4 py-2 rounded-lg text-sm font-mono flex cursor-pointer items-center gap-2 transition-all duration-150"
                                    style={{ background: alpha(0.08), border: `1px solid ${alpha(0.25)}`, color: accent }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = alpha(0.15);
                                        e.currentTarget.style.borderColor = accent;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = alpha(0.08);
                                        e.currentTarget.style.borderColor = alpha(0.25);
                                    }}
                                >
                                    <ArrowDownToLine className="w-3.5 h-3.5" /> Withdraw
                                </button>
                                <button
                                    className="px-4 py-2 rounded-lg text-sm font-mono cursor-pointer  flex items-center gap-2 hover:bg-red-950/70 transition-all duration-150"
                                    style={{ background: 'rgba(127,29,29,0.4)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {statCards.map(card => (
                        <div
                            key={card.label}
                            className="bg-[#111111] p-4 rounded-xl transition-all duration-200"
                            style={{ border: `1px solid ${alpha(0.08)}` }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = accent;
                                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${alpha(0.08)}`;
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.borderColor = alpha(0.08);
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-gray-600 uppercase tracking-widest font-mono">{card.label}</p>
                                <card.icon className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                            <p className="text-xl font-bold font-mono" style={{ color: accent }}>{card.value}</p>
                        </div>
                    ))}
                </div>

                {/* Campaign Details */}
                <div className="bg-[#111111] border border-gray-800/70 rounded-xl p-6 space-y-5">
                    <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest font-mono">Campaign Details</h2>

                    {/* Text fields */}
                    {textFields.map(field => (
                        <div key={field.label}>
                            <p className="text-xs text-gray-600 uppercase tracking-widest font-mono mb-1.5">{field.label}</p>
                            {editing ? (
                                <input
                                    value={field.value}
                                    onChange={e => field.set(e.target.value)}
                                    className="w-full bg-[#0d0d0d] border border-gray-800/60 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono focus:outline-none transition-colors duration-150"
                                    onFocus={e => e.currentTarget.style.borderColor = accent}
                                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                                />
                            ) : (
                                <p className="text-sm text-gray-300 font-mono">
                                    {field.value || <span className="text-gray-700">—</span>}
                                </p>
                            )}
                        </div>
                    ))}

                    {/* Keywords */}
                    <div>
                        <p className="text-xs text-gray-600 uppercase tracking-widest font-mono mb-1.5">Keywords (comma separated)</p>
                        {editing ? (
                            <input
                                value={keywords}
                                onChange={e => setKeywords(e.target.value)}
                                className="w-full bg-[#0d0d0d] border border-gray-800/60 rounded-lg px-3 py-2 text-sm text-gray-200 font-mono focus:outline-none transition-colors duration-150"
                                onFocus={e => e.currentTarget.style.borderColor = accent}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                        ) : (
                            <p className="text-sm text-gray-300 font-mono">
                                {keywords || <span className="text-gray-700">—</span>}
                            </p>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <p className="text-xs text-gray-600 uppercase tracking-widest font-mono">Tags</p>
                            {editing && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-600 font-mono">{selectedTags.length} / 15</span>
                                    {selectedTags.length > 0 && (
                                        <button
                                            onClick={() => setSelectedTags([])}
                                            className="text-xs text-gray-500 hover:text-gray-300 transition-colors font-mono"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {editing ? (
                            <>
                                {/* Selected pills */}
                                {selectedTags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedTags.map((tag, i) => (
                                            <div key={i} className="flex items-center gap-1.5 bg-[#0d0d0d] border border-gray-800/50 rounded-lg px-3 py-1.5 text-xs text-gray-300">
                                                <span>{tag}</span>
                                                <button onClick={() => removeTag(tag)} className="text-gray-600 hover:text-gray-300 transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Niche grid */}
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                                    {niches.map((niche) => {
                                        const tagText = `${niche.emoji} ${niche.label}`;
                                        const isSelected = selectedTags.includes(tagText);
                                        const isDisabled = !isSelected && selectedTags.length >= 15;

                                        return (
                                            <button
                                                key={niche.id}
                                                type="button"
                                                onClick={() => {
                                                    if (isSelected) removeTag(tagText);
                                                    else if (selectedTags.length < 15) setSelectedTags(prev => [...prev, tagText]);
                                                }}
                                                disabled={isDisabled}
                                                className="relative flex flex-col items-center justify-center gap-2 p-4 rounded-lg border transition-all duration-150 aspect-square"
                                                style={{
                                                    background: isSelected ? '#1c1c1c' : '#0d0d0d',
                                                    border: `1px solid ${isSelected ? accent : 'rgba(255,255,255,0.06)'}`,
                                                    boxShadow: isSelected ? `0 0 14px ${alpha(0.08)}` : 'none',
                                                    opacity: isDisabled ? 0.4 : 1,
                                                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                }}
                                                onMouseEnter={e => { if (!isSelected && !isDisabled) (e.currentTarget as HTMLElement).style.borderColor = alpha(0.25); }}
                                                onMouseLeave={e => { if (!isSelected && !isDisabled) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; }}
                                            >
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white flex items-center justify-center">
                                                        <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                                <span className="text-2xl">{niche.emoji}</span>
                                                <span className={`text-[10px] font-medium text-center leading-tight ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                                                    {niche.label}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {selectedTags.length > 0
                                    ? selectedTags.map((tag, i) => (
                                        <span key={i} className="bg-[#1c1c1c] border border-gray-700/60 text-gray-300 px-2.5 py-1 rounded-lg text-xs font-mono">
                                            {tag}
                                        </span>
                                    ))
                                    : <span className="text-gray-700 text-sm font-mono">—</span>
                                }
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800/50">
                        {[
                            { label: 'Cost Per Click', value: `${ad?.cost_per_click ?? '—'} SOL` },
                            { label: 'Total Budget', value: `${ad?.Cost ?? '—'} SOL` },
                            { label: 'Max Clicks', value: String(ad?.Clicks ?? '—') },
                        ].map(f => (
                            <div key={f.label}>
                                <p className="text-xs text-gray-600 uppercase tracking-widest font-mono mb-1">{f.label}</p>
                                <p className="text-sm text-gray-300 font-mono">{f.value}</p>
                            </div>
                        ))}
                        <div>
                            <p className="text-xs text-gray-600 uppercase tracking-widest font-mono mb-1">Available Balance</p>
                            <p className="text-sm text-gray-300 font-mono">
                                {vaultBalance !== null
                                    ? `${vaultBalance.toFixed(6)} SOL`
                                    : <span className="text-gray-700">—</span>
                                }
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 uppercase tracking-widest font-mono mb-1">Status</p>
                            <span className={`text-xs px-2 py-0.5 rounded font-mono border ${ad?.status
                                ? 'bg-gray-800 text-gray-300 border-gray-700'
                                : 'bg-[#1a1a1a] text-gray-500 border-gray-800'
                                }`}>
                                {ad?.status ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
            {/* Withdraw Confirmation Modal */}
            {showWithdrawModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setShowWithdrawModal(false); }}
                >
                    <div
                        className="w-full max-w-md rounded-2xl p-6 space-y-5"
                        style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: alpha(0.08), border: `1px solid ${alpha(0.2)}` }}>
                                    <ArrowDownToLine className="w-4 h-4" style={{ color: accent }} />
                                </div>
                                <div>
                                    <h3 className="text-white font-mono font-semibold text-sm">Withdraw Funds</h3>
                                    <p className="text-gray-600 font-mono text-xs mt-0.5">Campaign vault withdrawal</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                className="text-gray-600 hover:text-gray-300 transition-colors p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Available Balance */}
                        <div
                            className="rounded-xl p-4"
                            style={{ background: alpha(0.04), border: `1px solid ${alpha(0.12)}` }}
                        >
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">Available Balance</p>
                            <p className="text-2xl font-bold font-mono" style={{ color: accent }}>
                                {vaultBalance !== null ? `${vaultBalance.toFixed(6)} SOL` : '—'}
                            </p>
                        </div>

                        {/* Warning Note */}
                        <div
                            className="flex gap-3 rounded-xl p-4"
                            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
                        >
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-red-400 font-mono leading-relaxed">
                                Your campaign will be <span className="font-semibold text-red-300">paused</span> immediately after withdrawal. You can reactivate it by topping up the vault again.
                            </p>
                        </div>

                        {/* Wallet Address Input */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest font-mono mb-2 block">
                                Recipient Wallet Address
                            </label>
                            <input
                                value={withdrawAddress}
                                onChange={e => setWithdrawAddress(e.target.value)}
                                placeholder="Enter Reciving wallet address"
                                className="w-full bg-[#0d0d0d] border border-gray-800/60 rounded-lg px-3 py-2.5 text-sm text-gray-200 font-mono focus:outline-none transition-colors duration-150 placeholder-gray-700"
                                onFocus={e => e.currentTarget.style.borderColor = accent}
                                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={() => { setShowWithdrawModal(false); setWithdrawAddress(''); }}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#161616] border border-gray-800/60 text-gray-400 text-sm font-mono hover:text-gray-200 hover:border-gray-600 transition-all duration-150"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={withdrawing || !withdrawAddress.trim()}
                                onClick={async () => {
                                    setWithdrawing(true);
                                    try {
                                        await Withdraw();
                                        await fetch(`/api/crud/Advertiser/Advertiser-campaign/${id}`, {
                                            method: 'PUT',
                                        });
                                        setAd(prev => prev ? { ...prev, status: false, RemainingAmount: 0 } : prev);
                                        setVaultBalance(0);
                                        setShowWithdrawModal(false);
                                        setWithdrawAddress('');
                                    } catch (err) {
                                        console.error("Withdraw failed:", err);
                                    } finally {
                                        setWithdrawing(false);
                                    }
                                }}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-mono font-semibold flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ background: alpha(0.12), border: `1px solid ${alpha(0.35)}`, color: accent }}
                            >
                                <ArrowDownToLine className="w-3.5 h-3.5" />
                                {withdrawing ? 'Processing…' : 'Confirm Withdraw'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignPage;