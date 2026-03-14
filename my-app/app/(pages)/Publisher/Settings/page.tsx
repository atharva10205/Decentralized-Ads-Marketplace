'use client'

import { Copy, User, RefreshCw, Target, TrendingUp, Wallet } from 'lucide-react';
import Sidebar from '../sidebar/sidebar';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
const alpha = (op: number) => `rgba(255,255,255,${op})`;

const Settings = () => {
    const activeTab = 'Settings';
    const [isSwitching, setIsSwitching] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [accent, setAccent] = useState('#FFFFFF');
    const ACCENT = accent;
    const hAlpha = (op: number) => {
        const r = parseInt(ACCENT.slice(1, 3), 16);
        const g = parseInt(ACCENT.slice(3, 5), 16);
        const b = parseInt(ACCENT.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${op})`;
    };
    const session = useSession();
    const sessionRole = (session?.data?.user as { role?: string })?.role as 'advertiser' | 'publisher' | undefined;
    const [currentRole, setCurrentRole] = useState<'advertiser' | 'publisher'>(sessionRole ?? 'advertiser');
    const [WalletAddress, setWalletAddress] = useState("");

    useEffect(() => {
        if (sessionRole) setCurrentRole(sessionRole);
    }, [sessionRole]);

    useEffect(() => {
        const get_user_data = async () => {
            const res = await fetch("/api/crud/Publisher/Settings");
            const data = await res.json();
            if (data?.res) {
                setUserName(data.res.name ?? "");
                setUserEmail(data.res.email ?? "");
                setAccent(data.res.accent ?? '#FFFFFF');
            }
            if (data?.WalletAddress) {
                setWalletAddress(data.WalletAddress.wallet_address);
            }
        };
        get_user_data();
    }, []);

    const handleSaveProfile = async () => {
        const res = await fetch("/api/crud/Publisher/Settings", {
            method: "POST",
            body: JSON.stringify({ name: userName, email: userEmail }),
        });
        const data = await res.json();
        console.log("saved", data);
    };

    const handleRoleSwitch = async (newRole: 'advertiser' | 'publisher') => {
        if (newRole === currentRole) return;
        setIsSwitching(true);
        try {
            const res = await fetch("/api/crud/role_update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) {
                setCurrentRole(newRole);
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to switch role:', error);
        } finally {
            setIsSwitching(false);
        }
    };

    const handleSaveWallet = async () => {
        const res = await fetch("/api/crud/Publisher/Settings", {
            method: "PATCH",
            body: JSON.stringify({ wallet_address: WalletAddress }),
        });
        const data = await res.json();
        console.log("wallet saved", data);
    };

    // Shared save button style
    const SaveBtn = ({ onClick, label }: { onClick: () => void; label: string }) => (
        <button
            onClick={onClick}
            className="px-6 py-2.5 rounded-xl font-mono  cursor-pointer bg-[#161616] text-gray-200 text-sm font-semibold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            style={{ border: `1px solid ${alpha(0.18)}` }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = ACCENT;
                e.currentTarget.style.boxShadow = `0 0 18px ${hAlpha(0.2)}`;
                e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = alpha(0.18);
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.color = '';
            }}
        >
            {label}
        </button>
    );

    return (
        <div className="flex h-screen bg-[#0a0a0a] text-gray-300">
            <Sidebar activeTab={activeTab} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl">

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold mb-1 font-mono  text-white tracking-tight">Settings</h1>
                        <p className="text-gray-600 font-mono text-sm">Manage your publisher account</p>
                    </div>

                    <div className="grid gap-5">

                        {/* ── Account Role ── */}
                        <div className="bg-[#111111] border border-gray-800/70 rounded-xl overflow-hidden">

                            {/* Section header */}
                            <div className="px-6 py-5 border-b border-gray-800/60 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#161616] border border-gray-800/60">
                                    <RefreshCw className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-200 font-mono  uppercase tracking-widest">Account Role</h2>
                                    <p className="text-xs text-gray-600 font-mono mt-0.5">Switch between Advertiser and Publisher</p>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleRoleSwitch('advertiser')}
                                        disabled={isSwitching}
                                        className="relative p-6 rounded-xl font-mono  text-left transition-all duration-200 hover:-translate-y-0.5"
                                        style={{
                                            background: '#0d0d0d',
                                            border: `1px solid ${currentRole === 'advertiser' ? ACCENT : alpha(0.15)}`,
                                            boxShadow: currentRole === 'advertiser' ? `0 0 24px ${hAlpha(0.12)}` : 'none',
                                            opacity: isSwitching ? 0.5 : 1,
                                            cursor: isSwitching ? 'not-allowed' : 'pointer',
                                        }}
                                        onMouseEnter={e => {
                                            if (currentRole !== 'advertiser') {
                                                (e.currentTarget as HTMLElement).style.borderColor = alpha(0.2);
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (currentRole !== 'advertiser') {
                                                (e.currentTarget as HTMLElement).style.borderColor = alpha(0.08);
                                            }
                                        }}
                                    >
                                        {currentRole === 'advertiser' && (
                                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                                <svg className="w-3 h-3 font-mono  text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-4">
                                            <div className="p-2.5 rounded-lg  bg-[#161616] border border-gray-800/60">
                                                <Target className="w-5 h-5 font-mono  text-gray-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-white mb-1">Advertiser</h3>
                                                <p className="text-xs text-gray-600">Create ads, set budgets, and track campaign performance</p>
                                            </div>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handleRoleSwitch('publisher')}
                                        disabled={isSwitching}
                                        className="relative p-6 rounded-xl text-left font-mono  transition-all duration-200 hover:-translate-y-0.5"
                                        style={{
                                            background: '#0d0d0d',
                                            border: `1px solid ${currentRole === 'publisher' ? ACCENT : alpha(0.15)}`,
                                            boxShadow: currentRole === 'publisher' ? `0 0 24px ${hAlpha(0.12)}` : 'none',
                                            opacity: isSwitching ? 0.5 : 1,
                                            cursor: isSwitching ? 'not-allowed' : 'pointer',
                                        }}
                                        onMouseEnter={e => {
                                            if (currentRole !== 'publisher') {
                                                (e.currentTarget as HTMLElement).style.borderColor = alpha(0.2);
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (currentRole !== 'publisher') {
                                                (e.currentTarget as HTMLElement).style.borderColor = alpha(0.08);
                                            }
                                        }}
                                    >
                                        {currentRole === 'publisher' && (
                                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                                                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-4">
                                            <div className="p-2.5 rounded-lg bg-[#161616] border border-gray-800/60">
                                                <TrendingUp className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-base font-semibold text-white mb-1">Publisher</h3>
                                                <p className="text-xs text-gray-600">Display ads on your site and earn revenue from clicks</p>
                                            </div>
                                        </div>
                                    </button>
                                </div>

                                {isSwitching && (
                                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
                                        <div className="w-3.5 h-3.5 border border-gray-700 border-t-gray-300 rounded-full animate-spin" />
                                        Switching role…
                                    </div>
                                )}

                                <div className="mt-4 p-4 bg-[#0d0d0d] border border-gray-800/50 rounded-lg">
                                    <p className="text-xs text-gray-600">
                                        <span className="text-gray-400 font-medium">Note:</span> Switching roles will redirect you to the appropriate dashboard. Your data will be preserved.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#111111] border border-gray-800/70 rounded-xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-800/60 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#161616] border border-gray-800/60">
                                    <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-widest">Profile Settings</h2>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs text-gray-600 uppercase tracking-widest mb-2 block">Publisher Name</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full bg-[#0d0d0d] border border-gray-800/60 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-700 font-mono focus:outline-none transition-colors duration-150"
                                        style={{ outline: 'none' }}
                                        onFocus={e => e.currentTarget.style.borderColor = ACCENT}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 uppercase tracking-widest mb-2 block">Email Address</label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        className="w-full bg-[#0d0d0d] border border-gray-800/60 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-700 font-mono  focus:outline-none transition-colors duration-150"
                                        onFocus={e => e.currentTarget.style.borderColor = ACCENT}
                                        onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                                    />
                                </div>
                                <SaveBtn onClick={handleSaveProfile} label="Save Changes" />
                            </div>
                        </div>

                        <div className="bg-[#111111] border border-gray-800/70 rounded-xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-800/60 flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-[#161616] border border-gray-800/60">
                                    <Wallet className="w-4 h-4 text-gray-400" />
                                </div>
                                <h2 className="text-sm font-semibold text-gray-200 uppercase tracking-widest">Payment Settings</h2>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs text-gray-600 uppercase tracking-widest mb-2 block">Payout Wallet Address</label>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={WalletAddress}
                                            onChange={(e) => setWalletAddress(e.target.value)}
                                            className="flex-1 bg-[#0d0d0d] border border-gray-800/60 rounded-lg px-4 py-3 font-mono text-sm text-gray-200 placeholder-gray-700 focus:outline-none transition-colors duration-150"
                                            onFocus={e => e.currentTarget.style.borderColor = ACCENT}
                                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                                        />
                                        <button
                                            className="px-4 rounded-lg bg-[#161616] border border-gray-800/60 text-gray-500 hover:text-gray-200 hover:border-gray-600 transition-all duration-150"
                                            onClick={() => navigator.clipboard.writeText(WalletAddress)}
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <SaveBtn onClick={handleSaveWallet} label="Update Payment Info" />
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default Settings;