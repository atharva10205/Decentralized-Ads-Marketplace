'use client'

import { HelpCircle, Globe, Phone, Download, ChevronDown, ChevronUp, User, ChevronRight, Check, X, Link2, Upload, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Three({ next, back, adID }) {
    const [Customclick, setCustomclick] = useState<number>(0);
    const [selected, setSelected] = useState("");
    const [budget, setbudget] = useState(false)
    const [maximim_cost_per_bid, set_maximim_cost_per_bid] = useState<number>(0);
    const [Weekly_Cost, setWeekly_Cost] = useState<WeeklyCostItem[]>([])
    const [publicKey, setPublicKey] = useState<string | null>("");
    const [click, setclick] = useState<number>(0);
    const [errors, setErrors] = useState<Error>({})

    useEffect(() => {
        setErrors({})
    }, [selected, Customclick])

    type WeeklyCostItem = {
        clicks: number;
        cpc: number;
        weekly: number;
    };

    type Error = {
        maximim_cost_per_bid?: String;
        selected?: String;
        click?: String;
    }

    // Helper function to format SOL amounts with up to 8 decimal places
    const formatSOL = (amount: number): string => {
        // Round to 8 decimal places and remove trailing zeros
        return parseFloat(amount.toFixed(8)).toString();
    };

    const pay = async () => {
        const newError: Error = {}

        if (selected === "") {
            newError.selected = "This field is mandatory"
            setErrors(newError)
            return
        }

        if (Customclick == 0 && click === 0 && selected === "custom") {
            newError.click = "This is mandatory"
            setErrors(newError)
            return
        }

        let clickValue = 0;

        if (selected === "low") {
            clickValue = 200;
        } else if (selected === "medium") {
            clickValue = 400;
        } else if (selected === "high") {
            clickValue = 600;
        } else if (selected === "custom") {
            clickValue = Customclick;
        }

        setclick(clickValue);

        const res = await fetch("/api/crud/Advertiser-campaign-step-3", {
            method: "POST",
            headers: {
                "content-type": "application/JSON"
            },
            body: JSON.stringify({ publicKey, maximim_cost_per_bid, click: clickValue, adID })
        });
    }

    const check_btn = () => {
        const newError: Error = {}

        if (maximim_cost_per_bid === 0) {
            newError.maximim_cost_per_bid = "This field is mandatory",
                setErrors(newError)
            return;
        }
        setErrors({})
        setbudget(true)

        const cpc = Number(maximim_cost_per_bid);
        if (!cpc || cpc <= 0) return;

        const CLICKS = [200, 400, 600];

        setWeekly_Cost(
            CLICKS.map(clicks => ({
                clicks,
                cpc: parseFloat(cpc.toFixed(8)), // Round CPC to 8 decimals
                weekly: parseFloat((clicks * cpc).toFixed(8)), // Round weekly cost to 8 decimals
            }))
        );
    };

    const connectPhantom = async () => {
        try {
            if (!window?.solana?.isPhantom) {
                alert("Phantom wallet not found");
                return;
            }

            const res = await window.solana.connect();
            const key = res.publicKey.toString();

            setPublicKey(key);
        } catch (err) {
            console.error("Wallet connection failed", err);
        }
    };

    const disconnectPhantom = async () => {
        if (!window.solana) return;

        await window.solana.disconnect();
        console.log("Disconnected:", publicKey);

        setPublicKey(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] font-sans">
            {/* Top Header */}
            <header className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border-b border-gray-800/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                                <div className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent font-bold text-2xl tracking-tight">
                                    Google Ads
                                </div>
                                <div className="mx-4 text-gray-700 text-lg">|</div>
                                <div className="text-gray-200 font-medium text-lg">Create your first campaign</div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-2 text-gray-400 hover:text-[#00FFA3] transition-colors p-2 rounded-lg hover:bg-[#161616]/50">
                                <HelpCircle className="w-5 h-5" />
                                <span className="text-sm font-medium hidden sm:inline">Help</span>
                            </button>
                            <div className="w-9 h-9 bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 rounded-full flex items-center justify-center border border-gray-800/50">
                                <User className="w-5 h-5 text-[#00FFA3]" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Progress Steps */}
                    <aside className="lg:w-64 flex-shrink-0">
                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl shadow-xl p-6 sticky top-8">
                            <h3 className="font-semibold text-gray-200 mb-6 text-lg">Add business information</h3>

                            <div className="space-y-8">
                                {/* About your business section */}
                                <div className="relative">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full flex items-center justify-center text-black text-sm font-semibold shadow-lg shadow-[#00FFA3]/20 mr-3">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-gray-400">About your business</span>
                                    </div>
                                </div>

                                {/* Create your campaign section */}
                                <div className="relative">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full flex items-center justify-center text-black text-sm font-semibold shadow-lg shadow-[#00FFA3]/20 mr-3">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-gray-400">Create campaign</span>
                                    </div>
                                </div>

                                {/* Enter payment details section */}
                                <div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full flex items-center justify-center text-black text-sm font-semibold shadow-lg shadow-[#00FFA3]/20 mr-3">
                                            3
                                        </div>
                                        <span className="font-semibold text-gray-200">Enter payment details</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-8">
                                <div className="mb-8">
                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <span>Step 3 of 3</span>
                                        <ChevronRight className="w-4 h-4 mx-2" />
                                        <span className="font-medium text-[#00FFA3]">Payment</span>
                                    </div>
                                    <div className='mb-10'>
                                        <h1 className="text-2xl font-semibold text-gray-200 mb-1">
                                            Pay with SOL
                                        </h1>

                                        <p className="text-gray-400 text-lg">
                                            Get personalized suggestions based on your business information
                                        </p>
                                    </div>

                                    {!publicKey && (
                                        <div>
                                            <button
                                                onClick={connectPhantom}
                                                className='group relative text-black rounded-xl cursor-pointer h-[50px] w-[200px] bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] hover:shadow-2xl hover:shadow-[#00FFA3]/20 active:scale-95 transition-all duration-300 font-semibold overflow-hidden'>
                                                <span className="relative z-10">Connect Wallet</span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#DC1FFF] to-[#00FFA3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </button>
                                        </div>
                                    )}

                                    {publicKey && (
                                        <div>
                                            <div className="text-gray-200 mb-6 bg-[#0a0a0a] border border-gray-800/50 rounded-lg p-4">
                                                <p>
                                                    <span className="font-bold text-[#00FFA3]">Wallet Address:</span>
                                                    <span className="ml-2 text-gray-400 text-sm font-mono break-all">{publicKey}</span>
                                                </p>
                                            </div>

                                            <button
                                                onClick={disconnectPhantom}
                                                className='text-gray-300 rounded-lg mb-10 cursor-pointer h-[50px] w-[200px] bg-gradient-to-br from-[#121212] to-[#0f0f0f] border-2 border-gray-800/50 hover:border-red-500/50 hover:text-red-400 transition-all font-medium'>
                                                Disconnect Wallet
                                            </button>

                                            <div>
                                                <p className="text-gray-200 font-semibold text-lg">Set a bid strategy</p>
                                                <p className="text-gray-400 mb-6">
                                                    Your bid strategy defines how we should bid for your ad in auctions to better use your budget.
                                                </p>

                                                <p className="text-gray-200 mb-2 font-medium">Maximum cost per click</p>

                                                <div className="flex items-start gap-4">
                                                    <div className="flex flex-col">
                                                        <input
                                                            type="number"
                                                            placeholder="   Sol amount"
                                                            min={0.0000001}
                                                            step="any"
                                                            onChange={(e) => {
                                                                const v = Number(e.target.value);
                                                                if (v === 0) return set_maximim_cost_per_bid(0);
                                                                if (Number(v) >= 0) set_maximim_cost_per_bid(v);
                                                            }}
                                                            onBlur={() => {
                                                                if (maximim_cost_per_bid <= 0) {
                                                                    set_maximim_cost_per_bid(0);
                                                                }
                                                            }}
                                                            className={`border-2 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-gray-200 bg-[#0a0a0a] rounded-lg h-[40px] p-4 w-[160px] transition-all ${errors.maximim_cost_per_bid ? "border-red-500/50" : "border-gray-800/50 focus:border-[#00FFA3] focus:shadow-lg focus:shadow-[#00FFA3]/10"} outline-none`}
                                                        />

                                                        {errors.maximim_cost_per_bid && (
                                                            <p className="mt-1 text-sm text-red-400">
                                                                {errors.maximim_cost_per_bid}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={check_btn}
                                                        className="h-[40px] w-[100px] rounded-lg bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-black font-semibold hover:shadow-lg hover:shadow-[#00FFA3]/20 active:scale-95 transition-all"
                                                    >
                                                        Check
                                                    </button>
                                                </div>
                                            </div>

                                            {budget && (
                                                <div className='mt-14'>
                                                    {errors.selected && (
                                                        <p className="mt-1 mb-2 text-sm text-red-400">
                                                            {errors.selected}
                                                        </p>
                                                    )}
                                                    <div className={`max-w-xl bg-gradient-to-br from-[#121212] to-[#0f0f0f] border-2 rounded-xl p-4 space-y-3
                                                    ${errors.selected ? "border-red-500/50" : "border-gray-800/50"}
                                                    `}>
                                                        <h2 className="text-lg text-gray-200 font-semibold">
                                                            How much do you want to spend per day?
                                                        </h2>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {/* LOW */}
                                                            <div
                                                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all
                                                                    ${selected === "low"
                                                                        ? "border-[#00FFA3]/50 bg-[#00FFA3]/10 shadow-lg shadow-[#00FFA3]/10"
                                                                        : "border-gray-800/50 hover:border-[#00FFA3]/30 bg-[#0a0a0a]"
                                                                    }`}
                                                                onClick={() => setSelected("low")}
                                                            >
                                                                <div className="flex items-start justify-between mb-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <input 
                                                                            type="radio" 
                                                                            checked={selected === "low"} 
                                                                            readOnly 
                                                                            className="accent-[#00FFA3]"
                                                                        />
                                                                        <span className="text-gray-200 font-medium">{formatSOL(Weekly_Cost[0]?.weekly || 0)} SOL</span>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3 border-t border-gray-800/50 pt-3">
                                                                    <div className="grid grid-cols-3 gap-2 text-center">
                                                                        <div>
                                                                            <p className="text-xs mb-1 text-gray-400">Weekly Clicks</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{Weekly_Cost[0]?.clicks || 0}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-400 mb-3">CPC</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{formatSOL(Weekly_Cost[0]?.cpc || 0)} SOL</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs mb-3 text-gray-400">Weekly Cost</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{formatSOL(Weekly_Cost[0]?.weekly || 0)} SOL</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* MEDIUM */}
                                                            <div
                                                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all
                                                                    ${selected === "medium"
                                                                        ? "border-[#00FFA3]/50 bg-[#00FFA3]/10 shadow-lg shadow-[#00FFA3]/10"
                                                                        : "border-gray-800/50 hover:border-[#00FFA3]/30 bg-[#0a0a0a]"
                                                                    }`}
                                                                onClick={() => setSelected("medium")}
                                                            >
                                                                <div className="flex items-start justify-between mb-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <input 
                                                                            type="radio" 
                                                                            checked={selected === "medium"} 
                                                                            readOnly 
                                                                            className="accent-[#00FFA3]"
                                                                        />
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-gray-200 font-medium">{formatSOL(Weekly_Cost[1]?.weekly || 0)} SOL</span>
                                                                            <span className="text-xs bg-[#00FFA3]/20 text-[#00FFA3] px-2 py-0.5 rounded border border-[#00FFA3]/30">
                                                                                Recommended
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3 border-t border-gray-800/50 pt-3">
                                                                    <div className="grid grid-cols-3 gap-2 text-center">
                                                                        <div>
                                                                            <p className="text-xs mb-1 text-gray-400">Weekly Clicks</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{Weekly_Cost[1]?.clicks || 0}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-400 mb-3"> CPC</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{formatSOL(Weekly_Cost[1]?.cpc || 0)} SOL</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs mb-3 text-gray-400">Weekly Cost</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{formatSOL(Weekly_Cost[1]?.weekly || 0)} SOL</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* HIGH */}
                                                            <div
                                                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all
                                                                    ${selected === "high"
                                                                        ? "border-[#00FFA3]/50 bg-[#00FFA3]/10 shadow-lg shadow-[#00FFA3]/10"
                                                                        : "border-gray-800/50 hover:border-[#00FFA3]/30 bg-[#0a0a0a]"
                                                                    }`}
                                                                onClick={() => setSelected("high")}
                                                            >
                                                                <div className="flex items-start justify-between mb-3">
                                                                    <div className="flex items-center gap-3">
                                                                        <input 
                                                                            type="radio" 
                                                                            checked={selected === "high"} 
                                                                            readOnly 
                                                                            className="accent-[#00FFA3]"
                                                                        />
                                                                        <span className="text-gray-200 font-medium">{formatSOL(Weekly_Cost[2]?.weekly || 0)} SOL</span>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-3 border-t border-gray-800/50 pt-3">
                                                                    <div className="grid grid-cols-3 gap-2 text-center">
                                                                        <div>
                                                                            <p className="text-xs mb-1 text-gray-400">Weekly Clicks</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{Weekly_Cost[2]?.clicks || 0}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-400 mb-4"> CPC</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{formatSOL(Weekly_Cost[2]?.cpc || 0)} SOL</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs mb-4 text-gray-400">Weekly Cost</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{formatSOL(Weekly_Cost[2]?.weekly || 0)} SOL</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* CUSTOM */}
                                                            <div
                                                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all
                                                                    ${selected === "custom"
                                                                        ? "border-[#00FFA3]/50 bg-[#00FFA3]/10 shadow-lg shadow-[#00FFA3]/10"
                                                                        : "border-gray-800/50 hover:border-[#00FFA3]/30 bg-[#0a0a0a]"
                                                                    }`}
                                                                onClick={() => setSelected("custom")}
                                                            >
                                                                <div className="flex items-start justify-between mb-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <input 
                                                                            type="radio" 
                                                                            checked={selected === "custom"} 
                                                                            readOnly 
                                                                            className="accent-[#00FFA3]"
                                                                        />
                                                                        <span className="text-gray-200 font-medium">Set custom Click</span>
                                                                    </div>
                                                                </div>

                                                                <div className='flex items-center justify-center mb-3'>
                                                                    <div className="w-full">
                                                                        {selected === "custom" && (
                                                                            <input
                                                                                type="number"
                                                                                onChange={(e) => setCustomclick(Number(e.target.value))}
                                                                                placeholder="Enter clicks"
                                                                                className={`border-2 text-gray-200 bg-[#0a0a0a] rounded-lg px-3 py-2 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none outline-none transition-all
                                                                            ${errors.click ? "border-red-500/50 w-full" : "border-gray-800/50 focus:border-[#00FFA3] w-full"}
                                                                            `}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {errors.click && (
                                                                    <p className="mb-2 text-sm text-red-400 text-center">
                                                                        {errors.click}
                                                                    </p>
                                                                )}

                                                                <div className="border-t border-gray-800/50 pt-3">
                                                                    <div className="grid grid-cols-3 gap-2 text-center">
                                                                        <div>
                                                                            <p className="text-xs mb-1 text-gray-400">Weekly Clicks</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{Customclick}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs text-gray-400 mb-3">CPC</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{formatSOL(Number(maximim_cost_per_bid))} SOL</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-xs mb-3 text-gray-400">Weekly Cost</p>
                                                                            <p className="font-medium text-gray-300 text-sm">{formatSOL(Number(Customclick) * Number(maximim_cost_per_bid))} SOL</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="px-8 py-6 bg-[#0a0a0a] border-t border-gray-800/50">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={back}
                                        className="px-8 py-3 cursor-pointer border-2 border-gray-800/50 text-gray-300 font-medium rounded-lg hover:bg-[#161616]/50 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FFA3] transition-all"
                                    >
                                        Back
                                    </button>

                                    <button
                                        onClick={pay}
                                        className="group relative px-8 py-3 cursor-pointer rounded-xl font-semibold
                                          bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]
                                          text-black overflow-hidden
                                          hover:shadow-2xl hover:shadow-[#00FFA3]/20
                                          active:scale-95
                                          transition-all duration-300"
                                    >
                                        <span className="relative z-10">Pay</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#DC1FFF] to-[#00FFA3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}