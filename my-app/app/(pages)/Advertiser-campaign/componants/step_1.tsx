'use client'

import { HelpCircle, Globe, User, ChevronRight } from 'lucide-react'
import { useState } from 'react'

type OneProps = {
    next: () => void;
    setAdID: (id: string) => void;
};

type Errors = {
    businessName?: string
    url?: string
}

export default function One({ next, setAdID }: OneProps) {
    const [businessName, setBusinessName] = useState("")
    const [url, setUrl] = useState("")
    const [errors, setErrors] = useState<Errors>({})
    const [loading, setLoading] = useState(false);

    // URL validation function
    const isValidUrl = (urlString: string): boolean => {
        if (!urlString.trim()) return false;
        
        // Add https:// prefix if not present for validation
        const urlToTest = urlString.startsWith('http://') || urlString.startsWith('https://') 
            ? urlString 
            : `https://${urlString}`;
        
        try {
            const url = new URL(urlToTest);
            // Check if it has a valid protocol and hostname
            return (url.protocol === 'http:' || url.protocol === 'https:') && 
                   url.hostname.includes('.');
        } catch {
            return false;
        }
    };

    const input_field_check = async () => {
        setLoading(true);

        const newErrors: Errors = {}

        if (!businessName.trim()) {
            newErrors.businessName = "This field is mandatory"
        }
        
        if (!url.trim()) {
            newErrors.url = "This field is mandatory"
        } else if (!isValidUrl(url)) {
            newErrors.url = "Please enter a valid URL (e.g., example.com or www.example.com)"
        }

        setErrors(newErrors)

        if (Object.keys(newErrors).length > 0) {
            setLoading(false);
            return;
        }

        // Ensure URL has https:// prefix before sending to backend
        const formattedUrl = url.startsWith('http://') || url.startsWith('https://') 
            ? url 
            : `https://${url}`;

        const res = await fetch("/api/crud/Advertiser-campaign-step-1", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ businessName, url: formattedUrl })
        })

        if (!res.ok) {
            setLoading(false);
            return;
        }

        const data = await res.json();
        setAdID(data.adID); 

        setLoading(false);
        next();
    }

    // Real-time validation as user types (optional but provides better UX)
    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUrl(value);
        
        // Clear error when user starts typing
        if (errors.url) {
            setErrors(prev => ({ ...prev, url: undefined }));
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-gray-800 border-t-[#00FFA3] rounded-full animate-spin" />
                        <p className="text-gray-200 text-sm">Setting up your account…</p>
                    </div>
                </div>
            )}
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
                                    <div className="relative">
                                        <div className="flex items-center mb-2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full flex items-center justify-center text-black text-sm font-semibold shadow-lg shadow-[#00FFA3]/20 mr-3">
                                                1
                                            </div>
                                            <span className="font-semibold text-gray-200">About your business</span>
                                        </div>
                                        <div className="ml-11  ">
                                            <div className="flex items-center text-sm text-[#00FFA3] font-medium">
                                            </div>
                                        </div>
                                        <div className="absolute left-4 top-8 bottom-0  w-px bg-gradient-to-b from-[#00FFA3]/30 to-transparent"></div>

                                        <div className="relative">
                                            <div className="ml-11 space-y-2.5">
                                                <div className="flex items-center text-sm text-gray-400 font-medium">
                                                    <span> Your business name</span>
                                                </div>
                                                <div className="text-sm text-gray-500">Choose your destination</div>
                                            </div>
                                            <div className="absolute left-4 top-8 bottom-0 w-px bg-gradient-to-b from-[#00FFA3]/20 to-transparent"></div>
                                        </div>
                                    </div>

                                    {/* Create your campaign section */}
                                    <div className="relative">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-[#161616] border border-gray-800/50 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium mr-3">
                                                2
                                            </div>
                                            <span className="font-medium text-gray-500">Create campaign</span>
                                        </div>
                                    </div>

                                    {/* Enter payment details section */}
                                    <div>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-[#161616] border border-gray-800/50 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium mr-3">
                                                3
                                            </div>
                                            <span className="font-medium text-gray-500">Set Budget</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-8">
                                    <div className="mb-8">
                                        <div className="flex items-center text-sm text-gray-500 mb-3">
                                            <span>Step 1 of 3</span>
                                            <ChevronRight className="w-4 h-4 mx-2" />
                                            <span className="font-medium text-[#00FFA3]">About your business</span>
                                        </div>
                                        <h1 className="text-2xl font-semibold text-gray-200 mb-3">
                                            Tell us about your business
                                        </h1>

                                        <p className="text-gray-400 text-lg">
                                            Get personalized suggestions based on your business information
                                        </p>
                                    </div>

                                    {/* Business Name Section */}
                                    <div className="mb-10">
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="block text-sm font-semibold text-gray-200">
                                                What's your business name?
                                            </label>
                                        </div>
                                        <div className="max-w-2xl">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={businessName}
                                                    onChange={(e) => setBusinessName(e.target.value)}
                                                    placeholder="e.g., 'Bharat Stores' or 'Sunny Restaurant'"
                                                    className={`w-full text-gray-200 px-4 py-3.5 rounded-lg outline-none transition-all border-2 bg-[#0a0a0a]
                                               ${errors.businessName
                                                            ? "border-red-500/50"
                                                            : "border-gray-800/50 focus:border-[#00FFA3] focus:shadow-lg focus:shadow-[#00FFA3]/10"
                                                        }`}
                                                />

                                                {errors.businessName && (
                                                    <p className="mt-2 text-sm text-red-400">{errors.businessName}</p>
                                                )}
                                            </div>
                                            <div className="mt-3 text-sm text-gray-500">
                                                Your business name will appear in your ads
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="relative my-10">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-800/50"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-4 bg-gradient-to-r from-[#121212] to-[#0f0f0f] text-sm text-gray-500">Where should people go after clicking your ad?</span>
                                        </div>
                                    </div>

                                    {/* URL Destination Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-200 mb-2">
                                            Choose your destination
                                        </h3>
                                        <p className="text-gray-400 mb-8">
                                            Select where you want to send people who click your ad
                                        </p>

                                        {/* Your Website Option */}
                                        <div className="mb-8 p-4 border border-gray-800/50 rounded-xl hover:border-[#00FFA3]/30 hover:shadow-lg hover:shadow-[#00FFA3]/5 transition-all">
                                            <div className="flex items-start mb-4">
                                                <div className="flex items-center h-5 mt-0.5">
                                                    <input
                                                        type="radio"
                                                        id="website"
                                                        name="destination"
                                                        className="w-5 h-5 text-[#00FFA3] border-gray-700 focus:ring-2 focus:ring-[#00FFA3] focus:ring-offset-2 focus:ring-offset-[#0a0a0a] bg-[#0a0a0a]"
                                                        defaultChecked
                                                    />
                                                </div>
                                                <label htmlFor="website" className="ml-4 cursor-pointer flex-1">
                                                    <div className="flex items-center mb-2">
                                                        <Globe className="w-5 h-5 text-[#00FFA3] mr-2" />
                                                        <div className="text-base font-semibold text-gray-200">Your website</div>
                                                    </div>
                                                    <div className="text-sm text-gray-400 pl-7">
                                                        Send people to a specific page on your website, homepage, YouTube channel, or social media page.
                                                    </div>
                                                </label>
                                            </div>

                                            <div className="ml-9">
                                                <div className="mb-3">
                                                    <span className="text-sm font-medium text-gray-300">Enter your website URL</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center">
                                                        <div className="flex items-center px-4 py-3 bg-[#0a0a0a] border border-r-0 border-gray-800/50 rounded-l-lg">
                                                            <Globe className="w-4 h-4 text-gray-500" />
                                                            <span className="ml-2 text-sm text-gray-500">https://</span>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={url}
                                                            onChange={handleUrlChange}
                                                            placeholder="www.example.com"
                                                            className={`flex-1 text-gray-200 px-4 py-3 rounded-r-lg outline-none transition-all border-2 text-sm font-mono bg-[#0a0a0a]
                                                            ${errors.url
                                                                    ? "border-red-500/50"
                                                                    : "border-gray-800/50 focus:border-[#00FFA3] focus:shadow-lg focus:shadow-[#00FFA3]/10"
                                                                }`}
                                                        />
                                                    </div>
                                                    {errors.url && (
                                                        <p className="mt-2 text-sm text-red-400">{errors.url}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer with Help and Next Button */}
                                <div className="px-8 py-6 bg-[#0a0a0a] border-t border-gray-800/50">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="text-sm text-gray-500">
                                            <div className="inline-flex items-center flex-wrap justify-center">
                                                <HelpCircle className="w-2 h-1 mr-2" />
                                                <span>Need help? Call for free ad setup at </span>
                                                <span className="text-[#00FFA3] mx-1">6767-676-6767</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={input_field_check}
                                            className="group relative px-8 py-3 rounded-xl font-semibold
                                              bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]
                                              text-black overflow-hidden
                                              hover:shadow-2xl hover:shadow-[#00FFA3]/20
                                              active:scale-95
                                              transition-all duration-300"
                                        >
                                            <span className="relative z-10">Next</span>
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
    )
}