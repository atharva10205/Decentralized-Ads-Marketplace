'use client'

import { useRouter } from 'next/navigation';
import { Target, MousePointerClick, DollarSign, Plus } from 'lucide-react';
import Sidebar from '../Componants/Sidebar';
import { useSession } from "next-auth/react";
import { useQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

type DashboardData = {
    activeCampaigns: number;
    totalClicks: number;
    totalSpend: number;
    accent: string;
};

type Campaign = {
    name: string;
    clicks: number;
    cpc: string;
    status: 'Active' | 'Paused';
    performance: number;
    spend: number;
};

const DEFAULT_ACCENT = '#4ADE80';

const fetchDashboardData = async (): Promise<DashboardData> => {
    const res = await fetch("/api/crud/Advertiser/Dashboard");
    if (!res.ok) throw new Error('Failed to fetch dashboard data');
    return res.json();
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────

const BarChart = ({
    campaigns,
    metric,
    label,
    color,
    formatValue,
}: {
    campaigns: Campaign[];
    metric: 'clicks' | 'spend' | 'performance';
    label: string;
    color: string;
    formatValue?: (v: number) => string;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        chartRef.current?.destroy();

        const data = campaigns.map(c => c[metric]);
        const labels = campaigns.map(c => c.name.split(' ').slice(0, 2).join(' '));

        chartRef.current = new Chart(canvasRef.current, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label,
                    data,
                    backgroundColor: color,
                    borderRadius: 3,
                    barPercentage: 0.6,
                    categoryPercentage: 0.5,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#111',
                        borderColor: '#222',
                        borderWidth: 1,
                        titleColor: '#aaa',
                        bodyColor: '#ddd',
                        callbacks: {
                            label: (ctx: any) => formatValue ? ` ${formatValue(ctx.raw)}` : ` ${ctx.raw}`,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: { color: '#444', font: { size: 10, family: 'monospace' }, maxRotation: 30, autoSkip: false },
                        grid: { color: '#161616' },
                        border: { color: '#1e1e1e' },
                    },
                    y: {
                        ticks: {
                            color: '#444',
                            font: { size: 10 },
                            callback: (v: any) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v,
                        },
                        grid: { color: '#161616' },
                        border: { color: '#1e1e1e' },
                    },
                },
            },
        });

        return () => chartRef.current?.destroy();
    }, [campaigns, metric, color]);

    const total = campaigns.reduce((a, c) => a + Number(c[metric]), 0);

    return (
        <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex-shrink-0 w-full">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#1a1a1a]">
                <div>
                    <h2 className="text-sm font-semibold font-mono text-white">{label}</h2>
                    <p className="text-xs text-gray-600 font-mono mt-0.5">Per-campaign</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums" style={{ color }}>
                        {formatValue ? formatValue(total) : total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total}
                    </p>
                    <p className="text-xs text-gray-600">total</p>
                </div>
            </div>
            <div className="p-4" style={{ height: '180px', position: 'relative' }}>
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

// ─── Line Chart ───────────────────────────────────────────────────────────────

const LineChart = ({ color }: { color: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<any>(null);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const spendData = [0.0021, 0.0034, 0.0028, 0.0052, 0.0047, 0.0039, 0.0061];

    useEffect(() => {
        if (!canvasRef.current) return;
        chartRef.current?.destroy();

        chartRef.current = new Chart(canvasRef.current, {
            type: 'line',
            data: {
                labels: days,
                datasets: [{
                    label: 'Spend (SOL)',
                    data: spendData,
                    borderColor: color,
                    backgroundColor: `${color}18`,
                    borderWidth: 1.5,
                    pointRadius: 3,
                    pointBackgroundColor: color,
                    pointBorderWidth: 0,
                    tension: 0.4,
                    fill: true,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#111',
                        borderColor: '#222',
                        borderWidth: 1,
                        titleColor: '#aaa',
                        bodyColor: '#ddd',
                        callbacks: {
                            label: (ctx: any) => ` ${Number(ctx.raw).toFixed(4)} SOL`,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: { color: '#444', font: { size: 10, family: 'monospace' } },
                        grid: { color: '#161616' },
                        border: { color: '#1e1e1e' },
                    },
                    y: {
                        ticks: {
                            color: '#444',
                            font: { size: 10 },
                            callback: (v: any) => Number(v).toFixed(3),
                        },
                        grid: { color: '#161616' },
                        border: { color: '#1e1e1e' },
                    },
                },
            },
        });

        return () => chartRef.current?.destroy();
    }, [color]);

    const totalSpend = spendData.reduce((a, b) => a + b, 0);

    return (
        <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] w-full">
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#1a1a1a]">
                <div>
                    <h2 className="text-sm font-semibold font-mono text-white">Daily Spend</h2>
                    <p className="text-xs text-gray-600 font-mono mt-0.5">Last 7 days</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums" style={{ color }}>{totalSpend.toFixed(4)}</p>
                    <p className="text-xs text-gray-600">SOL</p>
                </div>
            </div>
            <div className="p-4" style={{ height: '180px', position: 'relative' }}>
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
};

// ─── Status Donut ─────────────────────────────────────────────────────────────

const StatusDonut = ({ campaigns, accent }: { campaigns: Campaign[]; accent: string }) => {
    const active = campaigns.filter(c => c.status === 'Active').length;
    const paused = campaigns.filter(c => c.status === 'Paused').length;
    const total = campaigns.length;
    const r = 48, cx = 60, cy = 60;
    const circumference = 2 * Math.PI * r;
    const activeDash = total > 0 ? Math.max(0, (active / total) * circumference - 3) : 0;
    const pausedDash = total > 0 ? Math.max(0, (paused / total) * circumference - 3) : 0;

    return (
        <div className="relative flex items-center justify-center">
            <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a1a" strokeWidth="12" />
                {active > 0 && (
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke={accent} strokeWidth="12"
                        strokeDasharray={`${activeDash} ${circumference - activeDash}`}
                        strokeDashoffset={0} strokeLinecap="butt" />
                )}
                {paused > 0 && (
                    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3f3f46" strokeWidth="12"
                        strokeDasharray={`${pausedDash} ${circumference - pausedDash}`}
                        strokeDashoffset={-(active / total) * circumference}
                        strokeLinecap="butt" />
                )}
                <circle cx="60" cy="60" r="36" fill="#0a0a0a" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">Active</span>
                <span className="text-lg font-bold text-white leading-tight">{active}</span>
                <span className="text-[10px] text-gray-500">of {total}</span>
            </div>
        </div>
    );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, sub, icon: Icon, accent }: {
    label: string; value: string; sub?: string; icon: React.ElementType; accent?: string;
}) => (
    <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] p-5 flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-[#161616] border border-[#222] flex-shrink-0">
            <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-600 font-mono uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-xl font-bold tabular-nums font-mono leading-tight"
                style={{ color: accent ?? 'white' }}>
                {value}
            </p>
            {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
        </div>
    </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
    const activeTab = 'Dashboard';
    const router = useRouter();
    const { status } = useSession();

    const { data, isLoading, error } = useQuery<DashboardData>({
        queryKey: ['advertiser-dashboard'],
        queryFn: fetchDashboardData,
        enabled: status === 'authenticated',
    });

    const accent = data?.accent ?? DEFAULT_ACCENT;

    // Replace with real API data when campaign endpoint is ready
    const campaigns: Campaign[] = [
        { name: 'Book Store Ads',        clicks: 420, cpc: '0.00000012', status: 'Active', performance: 92, spend: 0.0504 },
        { name: 'NFT Collection Launch', clicks: 580, cpc: '0.00000018', status: 'Active', performance: 87, spend: 0.1044 },
        { name: 'DeFi Protocol Promo',   clicks: 240, cpc: '0.00000009', status: 'Paused', performance: 78, spend: 0.0216 },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen bg-[#0a0a0a] text-gray-200">
                <Sidebar activeTab={activeTab} />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="animate-pulse space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            {[0,1,2].map(i => <div key={i} className="h-24 bg-[#111] rounded-2xl border border-[#1a1a1a]" />)}
                        </div>
                        <div className="h-64 bg-[#111] rounded-2xl border border-[#1a1a1a]" />
                        <div className="flex gap-3">
                            <div className="h-56 flex-1 bg-[#111] rounded-2xl border border-[#1a1a1a]" />
                            <div className="h-56 flex-1 bg-[#111] rounded-2xl border border-[#1a1a1a]" />
                        </div>
                        <div className="h-56 bg-[#111] rounded-2xl border border-[#1a1a1a]" />
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-[#0a0a0a] text-gray-200">
                <Sidebar activeTab={activeTab} />
                <main className="flex-1 p-6 overflow-auto">
                    <p className="text-red-500 text-sm font-mono">Error loading data. Please try again.</p>
                </main>
            </div>
        );
    }

    const activeCampaigns    = data?.activeCampaigns ?? 0;
    const totalClicks        = data?.totalClicks     ?? 0;
    const totalSpend         = data?.totalSpend      ?? 0;
    const totalCampaignSpend = campaigns.reduce((a, c) => a + c.spend, 0);

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-200 font-sans">
            <Sidebar activeTab={activeTab} />
            <main className="flex-1 font-mono overflow-auto">
                <div className="p-6 space-y-3">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-sm font-semibold text-white">Dashboard</h1>
                            <p className="text-xs text-gray-600 mt-0.5">Campaign overview</p>
                        </div>
                        <button
                            onClick={() => router.push('/Advertiser-campaign')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                            style={{ background: accent, color: '#000000' }}
                        >
                            <Plus className="w-3.5 h-3.5" />
                            New Campaign
                        </button>
                    </div>

                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <StatCard label="Active Campaigns" value={String(activeCampaigns)} icon={Target} />
                        <StatCard
                            label="Total Clicks"
                            value={totalClicks >= 1000 ? `${(totalClicks / 1000).toFixed(1)}K` : String(totalClicks)}
                            icon={MousePointerClick}
                        />
                        <StatCard
                            label="Total Spend"
                            value={totalSpend.toFixed(4)}
                            sub="SOL"
                            icon={DollarSign}
                            accent={accent}
                        />
                    </div>

                    {/* Campaign breakdown card */}
                    <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#1a1a1a]">
                            <div>
                                <h2 className="text-sm font-semibold font-mono text-white">Campaigns</h2>
                                <p className="text-xs text-gray-600 font-mono mt-0.5">Spend breakdown</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-600">{campaigns.length} campaigns</p>
                                <p className="text-sm font-semibold tabular-nums" style={{ color: accent }}>
                                    {totalCampaignSpend.toFixed(4)}{' '}
                                    <span className="text-xs text-gray-500 font-normal">SOL</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 p-5" style={{ maxHeight: '18rem' }}>
                            <div className="flex-1 min-w-0 space-y-5 overflow-y-auto pr-2"
                                style={{ scrollbarWidth: 'thin', scrollbarColor: '#2a2a2a transparent' }}>
                                {campaigns.map((c, idx) => {
                                    const sharePct = totalCampaignSpend > 0 ? (c.spend / totalCampaignSpend) * 100 : 0;
                                    return (
                                        <div key={c.name}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className="text-xs text-gray-600 w-4 flex-shrink-0 tabular-nums">{idx + 1}</span>
                                                    <span
                                                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                                        style={{ background: c.status === 'Active' ? accent : '#52525b' }}
                                                    />
                                                    <span className="text-sm text-gray-200 truncate max-w-[150px] font-medium">{c.name}</span>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                                                    <span className="text-xs text-gray-500 tabular-nums">{sharePct.toFixed(0)}%</span>
                                                    <span className="text-sm font-semibold tabular-nums" style={{ color: accent }}>
                                                        {c.spend.toFixed(4)}
                                                        <span className="text-[10px] text-gray-600 font-normal ml-0.5">SOL</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1 h-2 bg-[#161616] rounded-sm overflow-hidden">
                                                    <div
                                                        className="absolute inset-y-0 left-0 rounded-sm transition-all duration-700"
                                                        style={{
                                                            width: `${c.performance}%`,
                                                            background: c.status === 'Active'
                                                                ? `linear-gradient(90deg, rgba(0,0,0,0.3), ${accent})`
                                                                : '#3f3f46',
                                                            opacity: 0.85,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500 tabular-nums flex-shrink-0 w-20 text-right whitespace-nowrap">
                                                    {c.performance}% perf
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-xs text-gray-500">{c.clicks.toLocaleString()} clicks</span>
                                                <span className="text-xs text-gray-500">CPC {c.cpc}</span>
                                                <span className="text-xs" style={{ color: c.status === 'Active' ? accent : '#52525b' }}>
                                                    {c.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="w-px self-stretch bg-[#1c1c1c] flex-shrink-0" />

                            <div className="flex-shrink-0 flex flex-col items-center gap-3 w-36">
                                <StatusDonut campaigns={campaigns} accent={accent} />
                                <div className="w-full space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1 h-3 rounded-sm" style={{ background: accent }} />
                                            <span className="text-xs text-gray-500">Active</span>
                                        </div>
                                        <span className="text-xs font-semibold tabular-nums" style={{ color: accent }}>
                                            {campaigns.filter(c => c.status === 'Active').length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1 h-3 rounded-sm bg-zinc-600" />
                                            <span className="text-xs text-gray-500">Paused</span>
                                        </div>
                                        <span className="text-xs font-semibold text-gray-500 tabular-nums">
                                            {campaigns.filter(c => c.status === 'Paused').length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bar charts */}
                    <div className="flex gap-3 overflow-x-auto pb-1"
                        style={{ scrollbarWidth: 'thin', scrollbarColor: '#2a2a2a transparent' }}>
                        <div className="min-w-[340px] flex-1">
                            <BarChart
                                campaigns={campaigns}
                                metric="clicks"
                                label="Clicks"
                                color="#EDEDED"
                                formatValue={v => v >= 1000 ? `${(v / 1000).toFixed(1)}K clicks` : `${v} clicks`}
                            />
                        </div>
                        <div className="min-w-[340px] flex-1">
                            <BarChart
                                campaigns={campaigns}
                                metric="spend"
                                label="Spend"
                                color={accent}
                                formatValue={v => `${Number(v).toFixed(4)} SOL`}
                            />
                        </div>
                    </div>

                    {/* Line chart */}
                    <LineChart color={accent} />

                    {/* Campaigns table */}
                    <div className="bg-[#0d0d0d] border border-[#1c1c1c] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                        <div className="px-5 py-4 border-b border-[#1a1a1a] flex items-center justify-between">
                            <div>
                                <h2 className="text-sm font-semibold text-white">All Campaigns</h2>
                                <p className="text-xs text-gray-600 mt-0.5">Detailed stats</p>
                            </div>
                            <button onClick={() => router.push('/campaigns')}
                                className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                                View all →
                            </button>
                        </div>
                        <div className="overflow-y-auto"
                            style={{ maxHeight: '16rem', scrollbarWidth: 'thin', scrollbarColor: '#2a2a2a transparent' }}>
                            <table className="w-full">
                                <thead className="sticky top-0 bg-[#0d0d0d] z-10">
                                    <tr className="text-xs text-gray-600 border-b border-[#1a1a1a] uppercase tracking-widest">
                                        <th className="text-left px-5 py-2.5 font-medium">#</th>
                                        <th className="text-left px-5 py-2.5 font-medium">Campaign</th>
                                        <th className="text-right px-5 py-2.5 font-medium">Clicks</th>
                                        <th className="text-right px-5 py-2.5 font-medium">CPC</th>
                                        <th className="text-right px-5 py-2.5 font-medium">Performance</th>
                                        <th className="text-right px-5 py-2.5 font-medium">Spend</th>
                                        <th className="text-right px-5 py-2.5 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {campaigns.map((c, idx) => (
                                        <tr key={c.name}
                                            onClick={() => router.push(`/campaigns/${c.name.toLowerCase().replace(/\s+/g, '-')}`)}
                                            className="border-t border-[#141414] hover:bg-[#111] transition-colors cursor-pointer">
                                            <td className="px-5 py-3.5 text-xs text-gray-700 tabular-nums">{idx + 1}</td>
                                            <td className="px-5 py-3.5 text-sm font-medium text-gray-200">{c.name}</td>
                                            <td className="px-5 py-3.5 text-right text-sm text-gray-400 tabular-nums">
                                                {c.clicks >= 1000 ? `${(c.clicks / 1000).toFixed(1)}K` : c.clicks}
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-sm text-gray-400 tabular-nums font-mono">{c.cpc}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-20 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full"
                                                            style={{
                                                                width: `${c.performance}%`,
                                                                background: accent,
                                                                opacity: 0.65,
                                                            }} />
                                                    </div>
                                                    <span className="text-xs text-gray-500 tabular-nums w-8 text-right">{c.performance}%</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-sm font-semibold tabular-nums"
                                                style={{ color: accent }}>
                                                {c.spend.toFixed(4)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold"
                                                    style={{ color: c.status === 'Active' ? accent : '#71717a' }}>
                                                    <span className="w-1.5 h-1.5 rounded-full"
                                                        style={{ background: c.status === 'Active' ? accent : '#52525b' }} />
                                                    {c.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default Dashboard;