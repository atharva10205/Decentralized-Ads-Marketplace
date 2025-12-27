'use client'

import { HelpCircle, User, ChevronRight, Check, Globe, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function WebsiteRegistrationForm() {
    const [websiteName, setWebsiteName] = useState("");
    const [websiteURL, setWebsiteURL] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [keywordInput, setKeywordInput] = useState("");
    const [selectedNiches, setSelectedNiches] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setErrors({});
    }, [websiteName, websiteURL, walletAddress, keywords, selectedNiches]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === ",") {
            e.preventDefault();
            const value = keywordInput.trim().toLowerCase();
            if (!value) return;
            if (!keywords.includes(value)) {
                setKeywords([...keywords, value]);
            }
            setKeywordInput("");
        }
    };

    const removeKeyword = (index) => {
        setKeywords(keywords.filter((_, i) => i !== index));
    };

    const removeNiche = (nicheToRemove) => {
        setSelectedNiches(selectedNiches.filter(niche => niche !== nicheToRemove));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!websiteName.trim()) {
            newErrors.websiteName = "Website name is required";
        }

        if (!websiteURL.trim()) {
            newErrors.websiteURL = "Website URL is required";
        } else if (!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(websiteURL)) {
            newErrors.websiteURL = "Please enter a valid URL";
        }

        if (!walletAddress.trim()) {
            newErrors.walletAddress = "Wallet address is required";
        } else if (walletAddress.length < 26 || walletAddress.length > 44) {
            newErrors.walletAddress = "Please enter a valid wallet address";
        }

        if (selectedNiches.length === 0) {
            newErrors.selectedNiches = "Please select at least one niche";
        }

        if (keywords.length === 0 && !keywordInput.trim()) {
            newErrors.keywords = "Please add at least one keyword";
        }

        return newErrors;
    };

    const handleSubmit = async () => {
        setLoading(true);
        const newErrors = validateForm();
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log({
                websiteName,
                websiteURL,
                walletAddress,
                selectedNiches,
                keywords: keywordInput.trim() ? [...keywords, keywordInput.trim()] : keywords
            });
            alert("Website registered successfully!");
        }
        setLoading(false);
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-gray-800 border-t-[#00FFA3] rounded-full animate-spin" />
                        <p className="text-gray-200 text-sm">Registering your website…</p>
                    </div>
                </div>
            )}
            
            <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] font-sans">
                <header className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border-b border-gray-800/50">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                    <div className="bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] bg-clip-text text-transparent font-bold text-2xl tracking-tight">
                                        Publisher Network
                                    </div>
                                    <div className="mx-4 text-gray-700 text-lg">|</div>
                                    <div className="text-gray-200 font-medium text-lg">Register Your Website</div>
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

                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-8">
                                    <div className="mb-8">
                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                          
                                            <span className="font-medium text-[#00FFA3]">Website Details</span>
                                        </div>
                                        <h1 className="text-2xl font-semibold text-gray-200 mb-3">
                                            Register your website to start earning
                                        </h1>
                                        <p className="text-gray-400">
                                            Fill in your website details and we'll review your application within 24 hours
                                        </p>
                                    </div>

                                    {/* Website Name */}
                                    <div className="mb-8">
                                        <label className="block text-lg font-semibold text-gray-200 mb-4">
                                            Website Name
                                        </label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                value={websiteName}
                                                onChange={(e) => setWebsiteName(e.target.value)}
                                                placeholder="e.g., TechBlog Daily"
                                                className={`w-full pl-12 pr-4 py-3.5 rounded-lg outline-none transition-all border-2 bg-[#0a0a0a] text-gray-200 placeholder-gray-600
                                                    ${errors.websiteName
                                                        ? "border-red-500/50"
                                                        : "border-gray-800/50 focus:border-[#00FFA3] focus:shadow-lg focus:shadow-[#00FFA3]/10"
                                                    }`}
                                            />
                                            {errors.websiteName && (
                                                <p className="mt-2 text-sm text-red-400">{errors.websiteName}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Website URL */}
                                    <div className="mb-8">
                                        <label className="block text-lg font-semibold text-gray-200 mb-4">
                                            Website URL / Domain
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                                                https://
                                            </span>
                                            <input
                                                type="text"
                                                value={websiteURL}
                                                onChange={(e) => setWebsiteURL(e.target.value)}
                                                placeholder="example.com"
                                                className={`w-full pl-20 pr-4 py-3.5 rounded-lg outline-none transition-all border-2 bg-[#0a0a0a] text-gray-200 placeholder-gray-600
                                                    ${errors.websiteURL
                                                        ? "border-red-500/50"
                                                        : "border-gray-800/50 focus:border-[#00FFA3] focus:shadow-lg focus:shadow-[#00FFA3]/10"
                                                    }`}
                                            />
                                            {errors.websiteURL && (
                                                <p className="mt-2 text-sm text-red-400">{errors.websiteURL}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Wallet Address */}
                                    <div className="mb-10">
                                        <label className="block text-lg font-semibold text-gray-200 mb-2">
                                            Wallet Address
                                        </label>
                                        <p className="text-gray-400 mb-4 text-sm">
                                            Your public wallet address to receive payments (supports most crypto wallets)
                                        </p>
                                        <div className="relative">
                                            <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                            <input
                                                type="text"
                                                value={walletAddress}
                                                onChange={(e) => setWalletAddress(e.target.value)}
                                                placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
                                                className={`w-full pl-12 pr-4 py-3.5 rounded-lg outline-none transition-all border-2 bg-[#0a0a0a] text-gray-200 placeholder-gray-600 font-mono text-sm
                                                    ${errors.walletAddress
                                                        ? "border-red-500/50"
                                                        : "border-gray-800/50 focus:border-[#00FFA3] focus:shadow-lg focus:shadow-[#00FFA3]/10"
                                                    }`}
                                            />
                                            {errors.walletAddress && (
                                                <p className="mt-2 text-sm text-red-400">{errors.walletAddress}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Select Niches */}
                                    <div className="mb-12">
                                        <div className="mb-8">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className={`text-2xl font-bold ${errors.selectedNiches ? "text-red-400" : "text-gray-200"}`}>
                                                    Select Website Niches
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-400">
                                                        {selectedNiches.length} of 15 selected
                                                    </span>
                                                    {selectedNiches.length > 0 && (
                                                        <button
                                                            onClick={() => setSelectedNiches([])}
                                                            className="text-sm text-gray-400 hover:text-[#00FFA3] font-medium transition-colors px-3 py-1 hover:bg-[#161616]/50 cursor-pointer rounded-lg"
                                                        >
                                                            Clear all
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <p className={`${errors.selectedNiches ? "text-red-400" : "text-gray-400"}`}>
                                                Choose the niches that best represent your website content. Select up to 15 options.
                                            </p>
                                            {errors.selectedNiches && (
                                                <p className="mt-4 text-sm text-red-400">{errors.selectedNiches}</p>
                                            )}
                                        </div>

                                        {selectedNiches.length > 0 && (
                                            <div className="mb-8">
                                                <div className="flex items-center mb-3">
                                                    <span className="text-sm font-medium text-gray-300 mr-2">Selected:</span>
                                                    <span className="text-sm text-gray-500">
                                                        {selectedNiches.length} niche{selectedNiches.length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedNiches.map((niche, index) => (
                                                        <div
                                                            key={index}
                                                            className="inline-flex items-center bg-gradient-to-br from-[#121212] to-[#0f0f0f] rounded-lg pl-3 pr-2 py-2 text-sm font-medium text-gray-200 border border-gray-800/50 shadow-lg hover:shadow-[#00FFA3]/10 transition-all duration-200 group"
                                                        >
                                                            <span className="mr-1.5 text-lg">{niche.split(' ')[0]}</span>
                                                            <span className="mr-2">{niche.split(' ').slice(1).join(' ')}</span>
                                                            <button
                                                                onClick={() => removeNiche(niche)}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center text-gray-500 hover:text-[#00FFA3] rounded hover:bg-[#161616]"
                                                                aria-label={`Remove ${niche}`}
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
                                            {[
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
                                                { id: 'automotive', emoji: '🚗', label: 'Automotive' }
                                            ].map((niche) => {
                                                const nicheText = `${niche.emoji} ${niche.label}`;
                                                const isSelected = selectedNiches.includes(nicheText);
                                                const isDisabled = !isSelected && selectedNiches.length >= 15;

                                                return (
                                                    <button
                                                        key={niche.id}
                                                        type="button"
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                removeNiche(nicheText);
                                                            } else if (selectedNiches.length < 15) {
                                                                setSelectedNiches([...selectedNiches, nicheText]);
                                                            }
                                                        }}
                                                        disabled={isDisabled}
                                                        className={`
                                                            relative flex flex-col items-center justify-center p-5 rounded-xl border-2
                                                            transition-all duration-300 ease-out
                                                            ${isSelected
                                                                ? 'bg-gradient-to-br from-[#00FFA3]/10 to-[#DC1FFF]/10 border-[#00FFA3]/30 shadow-lg shadow-[#00FFA3]/10 ring-2 ring-[#00FFA3]/20 ring-inset scale-[0.98]'
                                                                : 'bg-gradient-to-br from-[#121212] to-[#0f0f0f] border-gray-800/50 hover:border-[#00FFA3]/30 hover:shadow-lg hover:shadow-[#00FFA3]/5'
                                                            }
                                                            ${isDisabled
                                                                ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none'
                                                                : 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                                                            }
                                                            aspect-square group
                                                        `}
                                                        aria-pressed={isSelected}
                                                        aria-label={`${isSelected ? 'Deselect' : 'Select'} ${niche.label} niche`}
                                                    >
                                                        <div className={`
                                                            absolute top-3 right-3 w-5 h-5 rounded-full border flex items-center justify-center
                                                            transition-all duration-200
                                                            ${isSelected
                                                                ? 'bg-[#00FFA3] border-[#00FFA3]'
                                                                : 'bg-[#0a0a0a] border-gray-700 group-hover:border-[#00FFA3]/30'
                                                            }`}>
                                                            {isSelected && (
                                                                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>

                                                        <div className={`
                                                            text-4xl mb-4 transition-transform duration-300
                                                            ${isSelected ? 'scale-110' : 'group-hover:scale-110'}
                                                        `}>
                                                            {niche.emoji}
                                                        </div>

                                                        <div className={`
                                                            text-sm font-semibold text-center leading-tight px-1
                                                            ${isSelected ? 'text-[#00FFA3]' : 'text-gray-300'}
                                                        `}>
                                                            {niche.label}
                                                        </div>

                                                        {!isDisabled && !isSelected && (
                                                            <div className="absolute inset-0 rounded-xl bg-[#00FFA3] opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                                                        )}

                                                        {isDisabled && (
                                                            <div className="absolute inset-0 bg-black/90 rounded-xl flex flex-col items-center justify-center">
                                                                <div className="text-center p-2">
                                                                    <div className="text-xs font-semibold text-gray-400 mb-1">Limit reached</div>
                                                                    <div className="text-[10px] text-gray-500">Remove some to add more</div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Keywords */}
                                    <div className="max-w-3xl mb-2">
                                        <p className="text-gray-200 font-bold mb-2 text-[17px]">
                                            Website Category / Keywords
                                        </p>
                                        <p className='text-gray-400 mb-4'>
                                            Add keywords that describe your website content (e.g., blog, tools, crypto, news, tutorials)
                                        </p>

                                        <div className="relative">
                                            <div
                                                className={`w-full min-h-[52px] px-3 py-2 border-2 rounded-lg flex flex-wrap gap-2 items-center focus-within:ring-2 bg-[#0a0a0a] transition-all
                                                    ${errors.keywords ? "border-red-500/50" : "border-gray-800/50 focus-within:border-[#00FFA3] focus-within:shadow-lg focus-within:shadow-[#00FFA3]/10"}
                                                `}
                                            >
                                                {keywords.map((keyword, index) => (
                                                    <span
                                                        key={index}
                                                        className="flex items-center gap-1 bg-gradient-to-r from-[#00FFA3]/20 to-[#DC1FFF]/20 text-[#00FFA3] px-2 py-1 rounded-md text-sm border border-[#00FFA3]/30"
                                                    >
                                                        {keyword}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeKeyword(index)}
                                                            className="text-[#00FFA3] cursor-pointer hover:text-[#DC1FFF]"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}

                                                <input
                                                    type="text"
                                                    value={keywordInput}
                                                    onChange={(e) => setKeywordInput(e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                    placeholder={keywords.length === 0 ? "Type and press Enter, Space, or Comma" : ""}
                                                    className="flex-1 outline-none text-gray-200 placeholder-gray-600 min-w-[120px] bg-transparent"
                                                />
                                            </div>

                                            {errors.keywords && (
                                                <p className="mt-2 text-sm text-red-400">{errors.keywords}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-8 py-6 bg-[#0a0a0a] border-t border-gray-800/50">
                                    <div className="flex items-center justify-between">
                                        <button
                                            className="px-6 py-3 border-2 border-gray-800/50 text-gray-300 font-medium rounded-lg hover:bg-[#161616]/50 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FFA3] transition-all"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            onClick={handleSubmit}
                                            className="group relative px-8 py-3 rounded-xl font-semibold
                                                bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]
                                                text-black overflow-hidden
                                                hover:shadow-2xl hover:shadow-[#00FFA3]/20
                                                active:scale-95
                                                transition-all duration-300"
                                        >
                                            <span className="relative z-10">Submit for Review</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#DC1FFF] to-[#00FFA3] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}