"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Target, TrendingUp, MousePointerClick } from 'lucide-react';

export default function GetStarted() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] text-gray-200 relative overflow-hidden">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-[#DC1FFF]/10 to-[#00FFA3]/10 rounded-full blur-3xl" />
            
            <header className="relative z-10">
                <div className="flex items-center justify-between px-8 py-6">
                    <div className="flex items-center gap-8">
                        <h1
                            onClick={() => router.push("/Get-started")}
                            className="text-2xl font-bold tracking-wide cursor-pointer bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                        >
                            AdFlow
                        </h1>

                        <div>
                            <h1 className="text-gray-500 hover:text-[#00FFA3] cursor-pointer transition-colors duration-300">
                                Goal
                            </h1>
                        </div>

                        <div>
                            <h1 className="text-gray-500 hover:text-[#00FFA3] cursor-pointer transition-colors duration-300">
                                How it work
                            </h1>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => signIn("google")}
                            className="px-6 py-2 text-sm text-gray-300 cursor-pointer  hover:text-[#00FFA3] transition-colors duration-300 font-medium"
                        >
                            Sign in
                        </button>

                        <button
                            onClick={() => signIn("google")}
                            className="group relative px-6 cursor-pointer  py-2 text-sm rounded-full font-semibold
                                bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]
                                text-black overflow-hidden
                                hover:shadow-xl hover:shadow-[#00FFA3]/20
                                active:scale-95
                                transition-all duration-300"
                        >
                            <span className="relative z-10">Start now</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#DC1FFF] to-[#00FFA3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </button>
                    </div>
                </div>

                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
            </header>

            <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 mt-32">
                <div className="mb-8 flex gap-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 backdrop-blur-sm border border-gray-800/50 animate-pulse">
                        <Target className="w-6 h-6 text-[#00FFA3]" />
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#DC1FFF]/10 to-[#00FFA3]/10 backdrop-blur-sm border border-gray-800/50 animate-pulse" style={{ animationDelay: '0.2s' }}>
                        <MousePointerClick className="w-6 h-6 text-[#DC1FFF]" />
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 backdrop-blur-sm border border-gray-800/50 animate-pulse" style={{ animationDelay: '0.4s' }}>
                        <TrendingUp className="w-6 h-6 text-[#00FFA3]" />
                    </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold leading-tight max-w-4xl">
                    <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                        Ads that work.
                    </span>
                    <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent">
                        Only pay for real attention.
                    </span>
                </h2>

                <p className="mt-8 text-gray-400 max-w-xl text-base md:text-lg leading-relaxed">
                    Launch, track, and optimize ads with full transparency.
                    <br />
                    Built for modern products.
                </p>

                <div className="mt-12 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => signIn("google")}
                        className="group relative px-8 py-4 cursor-pointer rounded-xl font-semibold text-lg
                            bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]
                            text-black overflow-hidden
                            hover:shadow-2xl hover:shadow-[#00FFA3]/30
                            active:scale-95
                            transition-all duration-300"
                    >
                        <span className="relative z-10">Start Now</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-[#DC1FFF] to-[#00FFA3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                    
                    <button
                        onClick={() => router.push("/learn-more")}
                        className="px-8 py-4 rounded-xl cursor-pointer  font-semibold text-lg
                            bg-gradient-to-br from-[#121212] to-[#0f0f0f]
                            border border-gray-800/50
                            text-gray-300
                            hover:border-[#00FFA3]/50 hover:text-white
                            hover:shadow-xl hover:shadow-[#00FFA3]/10
                            active:scale-95
                            transition-all duration-300"
                    >
                        Learn More
                    </button>
                </div>

                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
                    {[
                        { label: 'Transparent', desc: 'See exactly where your budget goes' },
                        { label: 'Performance-driven', desc: 'Pay only for genuine engagement' },
                        { label: 'Simple', desc: 'Launch campaigns in minutes' }
                    ].map((feature, idx) => (
                        <div
                            key={feature.label}
                            className="group relative bg-gradient-to-br from-[#121212] to-[#0f0f0f] 
                                border border-gray-800/50 p-6 rounded-2xl
                                hover:border-gray-700 hover:shadow-xl hover:shadow-[#00FFA3]/5
                                hover:-translate-y-1
                                transition-all duration-300"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <h3 className="text-lg font-semibold mb-2 text-[#00FFA3]">
                                {feature.label}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="absolute bottom-6 w-full text-center text-sm text-gray-600 relative z-10">
                <span className="bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 bg-clip-text text-transparent">
                    Simple. Transparent. Performance-driven.
                </span>
            </footer>
        </div>
    );
}