'use client'

import { Plus, BarChart3, Edit, Pause, Play, Trash2, RefreshCw } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const alpha = (op: number) => `rgba(255,255,255,${op})`;

type Campaign = {
    id: string;
    business_name: string;
    destination_url: string;
    status: boolean;
    cost_per_click: number;
    impression: number;
    clicks: number;
    Cost: number;
    cpc: string;
    spent: number;
    percentUsed: number;
};

const Campaigns = () => {
    const activeTab = 'Campaigns';
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [accent, setAccent] = useState('#10B981');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await fetch("/api/crud/Advertiser/Campaings");
                const data = await res.json();

                setAccent(data.accent ?? '#10B981');

                const enriched = (Array.isArray(data) ? data : (data.campaigns ?? [])).map((c: any) => {
                    const budget = Number(c.Cost ?? 0);
                    const spent = (c.clicks ?? 0) * Number(c.cost_per_click ?? 0);
                    const percentUsed = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
                    return {
                        ...c,
                        spent: parseFloat(spent.toFixed(6)),
                        percentUsed,
                        cpc: c.cost_per_click ? Number(c.cost_per_click).toFixed(6) : '0.000000',
                    };
                });

                setCampaigns(enriched);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-300">
            <Sidebar activeTab={activeTab} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl">

                    {/* Header */}
                    <div className="flex items-center font-mono justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-bold mb-1 text-white tracking-tight">Campaigns</h1>
                            <p className="text-gray-600 text-sm">Manage your advertising campaigns</p>
                        </div>

                        <button
                            onClick={() => router.push("/Advertiser-campaign")}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161616] text-gray-200 text-sm font-semibold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                            style={{ border: `1px solid ${alpha(0.18)}` }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = accent;
                                e.currentTarget.style.boxShadow = `0 0 18px ${accent}33`;
                                e.currentTarget.style.color = accent;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = alpha(0.18);
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.color = '';
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            New Campaign
                        </button>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center py-24">
                            <div
                                className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                                style={{ borderColor: `${accent} transparent transparent transparent` }}
                            />
                        </div>
                    )}
                    {!loading && campaigns.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-600 text-sm font-mono">
                            <p className="mb-1">No campaigns found.</p>
                            <p className="text-xs text-gray-700">Create your first campaign to get started.</p>
                        </div>
                    )}

                    {/* Campaign Cards */}
                    <div className="grid gap-4">
                        {campaigns.map((campaign) => {
                            const isActive = campaign.status === true;

                            return (
                                <div
                                    key={campaign.id}
                                    className="bg-[#111111] rounded-xl overflow-hidden hover:-translate-y-0.5 transition-all duration-200"
                                    style={{ border: `1px solid ${alpha(0.08)}` }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.borderColor = accent;
                                        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 32px ${accent}1a`;
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.borderColor = alpha(0.08);
                                        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                                    }}
                                >
                                    <div className="p-6">

                                        <div className="flex items-start justify-between mb-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-1.5">
                                                    <h3 className="text-lg font-semibold text-white tracking-tight font-mono">
                                                        {campaign.business_name}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded font-mono tracking-wide border ${isActive
                                                            ? 'bg-gray-800 text-gray-300 border-gray-700'
                                                            : 'bg-[#1a1a1a] text-gray-500 border-gray-800'
                                                        }`}>
                                                        {isActive && (
                                                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mr-1.5 align-middle animate-pulse" />
                                                        )}
                                                        {isActive ? 'ACTIVE' : 'PAUSED'}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-600 font-mono">
                                                    {campaign.destination_url}
                                                </p>
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/dashboard/advertiser/campaigns/${campaign.id}`)}
                                                    className="p-2 rounded-lg bg-[#161616] border border-gray-800/60 text-gray-500 hover:text-gray-200 hover:border-gray-600 transition-all duration-150"
                                                    title="View Stats"
                                                >
                                                    <BarChart3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 rounded-lg bg-[#161616] border border-gray-800/60 text-gray-500 hover:text-gray-200 hover:border-gray-600 transition-all duration-150"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        const newStatus = !isActive;
                                                        await fetch("/api/crud/Advertiser/Campaings", {
                                                            method: "PATCH",
                                                            headers: { "content-type": "application/json" },
                                                            body: JSON.stringify({ id: campaign.id, status: newStatus })
                                                        });
                                                        setCampaigns(prev =>
                                                            prev.map(c => c.id === campaign.id ? { ...c, status: newStatus } : c)
                                                        );
                                                    }}
                                                    className="p-2 rounded-lg bg-[#161616] border border-gray-800/60 text-gray-500 hover:text-gray-200 hover:border-gray-600 transition-all duration-150"
                                                    title={isActive ? 'Pause' : 'Resume'}
                                                >
                                                    {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    className="p-2 rounded-lg bg-[#161616] border border-gray-800/60 text-gray-500 hover:text-red-400 hover:border-red-900/60 transition-all duration-150"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                                            {[
                                                { label: 'Budget', value: `${Number(campaign.Cost ?? 0).toFixed(4)} SOL`, accentColor: false },
                                                { label: 'Spent', value: `${campaign.spent} SOL`, accentColor: true },
                                                { label: 'Clicks', value: (campaign.clicks ?? 0).toLocaleString(), accentColor: false },
                                                { label: 'CPC', value: `${campaign.cpc} SOL`, accentColor: false },
                                                { label: 'Impressions', value: (campaign.impression ?? 0).toLocaleString(), accentColor: false },
                                            ].map((metric) => (
                                                <div key={metric.label} className="bg-[#0d0d0d] border border-gray-800/50 p-4 rounded-lg">
                                                    <p className="text-xs text-gray-600 uppercase tracking-widest mb-1.5 font-mono">{metric.label}</p>
                                                    <p
                                                        className="text-base font-semibold font-mono tabular-nums"
                                                        style={{ color: metric.accentColor ? accent : undefined }}
                                                    >
                                                        {metric.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700"
                                                    style={{
                                                        width: `${campaign.percentUsed}%`,
                                                        background: campaign.percentUsed > 85
                                                            ? '#ef4444'
                                                            : accent,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-600 font-mono w-16 text-right tabular-nums">
                                                {campaign.percentUsed}% used
                                            </span>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Campaigns;