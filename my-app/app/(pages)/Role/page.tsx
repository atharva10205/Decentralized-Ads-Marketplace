"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Target, TrendingUp } from 'lucide-react';

export default function RoleSelection() {
    const router = useRouter();
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const roles = [
        {
            id: "advertiser",
            title: "Advertiser",
            description: "Create ads, set budgets, and track performance with real-time analytics",
            icon: Target,
            gradient: "from-[#00FFA3] to-[#DC1FFF]",
            route: "/home"
        },
        {
            id: "publisher",
            title: "Publisher",
            description: "Show ads on your website and earn revenue from genuine engagement",
            icon: TrendingUp,
            gradient: "from-[#DC1FFF] to-[#00FFA3]",
            route: "/home"
        }
    ];

    const handleRoleSelect = async (role: string) => {
        setLoading(true);
        const res = await fetch("/api/crud/role_update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ role }),
        })

        if (!res.ok) {
            setLoading(false)
            return
        }

        router.push(
            role === "advertiser"
                ? "/Advertiser/Dashboard"
                : "/Publisher/Dashboard"
        );
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4 bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl p-8">
                        <div className="w-12 h-12 border-4 border-gray-800 border-t-[#00FFA3] rounded-full animate-spin" />
                        <p className="text-gray-200 text-base font-medium">Setting up your account…</p>
                    </div>
                </div>
            )}
            
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200 px-4 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-[#DC1FFF]/10 to-[#00FFA3]/10 rounded-full blur-3xl" />
                </div>

                <div className="relative w-full max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 mb-6 shadow-xl">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 flex items-center justify-center">
                                <span className="text-3xl">👤</span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Choose Your
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent">
                                Role
                            </span>
                        </h1>
                        <p className="text-gray-500 text-lg max-w-md mx-auto">
                            Select how you want to use our advertising platform
                        </p>
                    </div>

                    {/* Role Cards */}
                    <div className="space-y-6">
                        {roles.map((role, idx) => {
                            const Icon = role.icon;
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => handleRoleSelect(role.id)}
                                    onMouseEnter={() => setHoveredCard(role.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    className="group cursor-pointer w-full cursor-pointer relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.99] focus:outline-none"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-300`} />

                                    <div className={`relative rounded-2xl border ${
                                        hoveredCard === role.id
                                            ? 'border-gray-700 bg-gradient-to-br from-[#121212] to-[#0f0f0f] shadow-2xl shadow-[#00FFA3]/10'
                                            : 'border-gray-800/50 bg-gradient-to-br from-[#121212] to-[#0f0f0f]'
                                    } p-8 transition-all duration-300`}>
                                        
                                        <div className="flex items-start gap-6">
                                            <div className={`flex-shrink-0 p-4 rounded-xl bg-gradient-to-br ${
                                                hoveredCard === role.id 
                                                    ? 'from-[#00FFA3]/20 to-[#DC1FFF]/20' 
                                                    : 'from-[#00FFA3]/10 to-[#DC1FFF]/10'
                                            } transform transition-all duration-300 ${
                                                hoveredCard === role.id ? 'scale-110 rotate-3' : ''
                                            }`}>
                                                <Icon className={`w-8 h-8 ${
                                                    role.id === 'advertiser' ? 'text-[#00FFA3]' : 'text-[#DC1FFF]'
                                                }`} />
                                            </div>

                                            <div className="flex-1 text-left">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                                        {role.title}
                                                    </h3>
                                                    <svg
                                                        className={`w-6 h-6 text-[#00FFA3] transition-all duration-300 ${
                                                            hoveredCard === role.id ? 'translate-x-2 opacity-100' : 'opacity-0'
                                                        }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-400 text-base leading-relaxed">
                                                    {role.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${role.gradient} rounded-b-2xl transform origin-left transition-transform duration-300 ${
                                            hoveredCard === role.id ? 'scale-x-100' : 'scale-x-0'
                                        }`} />
                                        
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00FFA3]/5 to-[#DC1FFF]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <p className="text-center text-gray-600 text-sm mt-10">
                        <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#121212] to-[#0f0f0f] border border-gray-800/50">
                            You can switch roles later in your account settings
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}