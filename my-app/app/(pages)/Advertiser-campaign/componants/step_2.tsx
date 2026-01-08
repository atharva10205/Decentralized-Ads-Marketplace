'use client'

import { HelpCircle, User, ChevronRight, Check, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type Errors = {
    title?: string;
    description?: string;
    selectedTags?: string;
    keywords?: string;
    image?: string;
};

type StepProps = {
    adID: string | null;
    next: () => void;
    back: () => void;
};

export default function Two({ adID, next, back }: StepProps) {
    const [KeyWords, setKeyWords] = useState([]);
    const [input, setInput] = useState("");
    const [description, setdescription] = useState("")
    const [errors, setErrors] = useState<Errors>({})
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(false);
    const [Title, setTitle] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        setErrors({})
    }, [description, input, KeyWords, selectedTags, Title, imageFile])

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " " || e.key === ",") {
            e.preventDefault();

            const value = input.trim().toLowerCase();
            if (!value) return;

            if (!KeyWords.includes(value)) {
                setKeyWords([...KeyWords, value]);
            }

            setInput("");
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors({ ...errors, image: "Please select a valid image file" });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, image: "Image size should be less than 5MB" });
                return;
            }

            setImageFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
    };

    const removeTag1 = (index) => {
        setKeyWords(KeyWords.filter((_, i) => i !== index));
    };

    const Next_btn = async () => {
        setLoading(true)

        const newErrors: Errors = {}

        if (Title === "") {
            newErrors.title = "This field is mandatory"
            setLoading(false)
        }

        if (description === "") {
            newErrors.description = "This field is mandatory"
            setLoading(false)
        }

        if (selectedTags.length === 0) {
            newErrors.selectedTags = "This field is mandatory"
            setLoading(false)
        }

        if (KeyWords.length === 0 && input === "") {
            newErrors.keywords = "This field is mandatory"
            setLoading(false)
        }

        if (!imageFile) {
            newErrors.image = "Please upload an image"
            setLoading(false)
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('KeyWords', JSON.stringify(KeyWords));
                formData.append('description', description);
                formData.append('selectedTags', JSON.stringify(selectedTags));
                formData.append('input', input);
                formData.append('adID', adID || '');
                formData.append('Title', Title);

                const res = await fetch("/api/crud/Advertiser-campaign-step-2", {
                    method: "POST",
                    body: formData
                })

                if (!res.ok) {
                    setLoading(false)
                    return;
                }

                next()
            } catch (error) {
                console.error('Error:', error);
                setLoading(false)
            }
        }
        setLoading(false)
    }

    const removeTag = (tagToRemove) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
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
            <div>
                <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0b0b0b] to-[#0d0d0d] font-sans">
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
                            <aside className="lg:w-64 flex-shrink-0">
                                <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl shadow-xl p-6 sticky top-8">
                                    <h3 className="font-semibold text-gray-200 mb-6 text-lg">Add business information</h3>

                                    <div className="space-y-8">
                                        <div className="relative">
                                            <div className="flex items-center mb-4">
                                                <div className="w-8 h-8 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full flex items-center justify-center text-black text-sm font-semibold shadow-lg shadow-[#00FFA3]/20 mr-3">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                                <span className="font-medium text-gray-400">About your business</span>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <div className="flex items-center mb-4">
                                                <div className="w-8 h-8 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] rounded-full flex items-center justify-center text-black text-sm font-semibold shadow-lg shadow-[#00FFA3]/20 mr-3">
                                                    2
                                                </div>
                                                <span className="font-semibold text-gray-200">Create your campaign</span>
                                            </div>
                                            <div className="ml-11 space-y-2.5">
                                                <div className="flex items-center text-sm text-gray-400 font-medium">
                                                    <span>Campaign details</span>
                                                </div>
                                                <div className="text-sm text-gray-500">Select Website Niches</div>
                                                <div className="text-sm text-gray-500">Enter keywords</div>
                                            </div>
                                            <div className="absolute left-4 top-10 bottom-0 w-px bg-gradient-to-b from-[#00FFA3]/20 to-transparent"></div>
                                        </div>

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

                            <div className="flex-1">
                                <div className="bg-gradient-to-br from-[#121212] to-[#0f0f0f] border border-gray-800/50 rounded-2xl shadow-xl overflow-hidden">
                                    <div className="p-8">
                                        <div className="mb-8">
                                            <div className="flex items-center text-sm text-gray-500 mb-3">
                                                <span>Step 2 of 3</span>
                                                <ChevronRight className="w-4 h-4 mx-2" />
                                                <span className="font-medium text-[#00FFA3]">Create your campaign</span>
                                            </div>
                                            <h1 className="text-2xl font-semibold text-gray-200 mb-3">
                                                Tell us more about your business
                                            </h1>
                                        </div>

                                        <div className="mb-10">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-xl font-semibold text-gray-200">
                                                    Title
                                                </label>
                                            </div>

                                            <div className="max-w-3xl mb-2">
                                                <p className="text-gray-400 mb-4">
                                                    Title which best represent your business
                                                </p>

                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={Title}
                                                        onChange={(e) => setTitle(e.target.value)}
                                                        placeholder='Try something like, "The best Web3 guide for Beginners"'
                                                        className={`w-full px-4 py-3.5 rounded-lg outline-none transition-all border-2 bg-[#0a0a0a] text-gray-200 placeholder-gray-600
                                                    ${errors.title
                                                                ? "border-red-500/50"
                                                                : "border-gray-800/50 focus:border-[#00FFA3] focus:shadow-lg focus:shadow-[#00FFA3]/10"
                                                            }`}
                                                        maxLength={3000}
                                                    />
                                                    {errors.title && (
                                                        <p className="mt-2 text-sm text-red-400">{errors.title}</p>
                                                    )}
                                                    <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-[#0a0a0a] px-2 py-1 rounded">
                                                        {Title.length} / 3000
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-10">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-lg font-semibold text-gray-200">
                                                    Description
                                                </label>
                                            </div>

                                            <div className="max-w-3xl mb-2">
                                                <p className="text-gray-400 mb-4">
                                                    Describe what makes your business unique
                                                </p>

                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={description}
                                                        onChange={(e) => setdescription(e.target.value)}
                                                        placeholder='Try something like, "independent bookstore specializing in rare first editions and hosting author events."'
                                                        className={`w-full px-4 py-3.5 rounded-lg outline-none transition-all border-2 bg-[#0a0a0a] text-gray-200 placeholder-gray-600
                                                    ${errors.description
                                                                ? "border-red-500/50"
                                                                : "border-gray-800/50 focus:border-[#00FFA3] focus:shadow-lg focus:shadow-[#00FFA3]/10"
                                                            }`}
                                                        maxLength={3000}
                                                    />
                                                    {errors.description && (
                                                        <p className="mt-2 text-sm text-red-400">{errors.description}</p>
                                                    )}
                                                    <div className="absolute bottom-3 right-3 text-sm text-gray-500 bg-[#0a0a0a] px-2 py-1 rounded">
                                                        {description.length} / 3000
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-10">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-lg font-semibold text-gray-200">
                                                    Business Image
                                                </label>
                                            </div>

                                            <div className="max-w-3xl">
                                                <p className="text-gray-400 mb-4">
                                                    Upload an image that represents your business (Max 5MB)
                                                </p>

                                                {!imagePreview ? (
                                                    <label className={`relative block w-full cursor-pointer ${errors.image ? 'border-red-500/50' : 'border-gray-800/50 hover:border-[#00FFA3]/50'}`}>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                        />
                                                        <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${errors.image ? 'border-red-500/50 bg-red-500/5' : 'border-gray-800/50 hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/5'}`}>
                                                            <Upload className={`w-12 h-12 mx-auto mb-4 ${errors.image ? 'text-red-400' : 'text-gray-400'}`} />
                                                            <p className="text-gray-300 font-medium mb-2">
                                                                Click to upload or drag and drop
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                PNG, JPG, GIF up to 5MB
                                                            </p>
                                                        </div>
                                                    </label>
                                                ) : (
                                                    <div className="relative">
                                                        <div className="border-2 border-gray-800/50 rounded-lg p-4 bg-[#0a0a0a]">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Preview"
                                                                className="max-h-64 mx-auto rounded-lg"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={removeImage}
                                                            className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                                                        >
                                                            <X className="w-5 h-5 text-white" />
                                                        </button>
                                                    </div>
                                                )}

                                                {errors.image && (
                                                    <p className="mt-2 text-sm text-red-400">{errors.image}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-12">
                                            <div className="mb-8">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className={`text-2xl font-bold 
                                                        ${errors.selectedTags ? "text-red-400" : "text-gray-200"}
                                                        `}>
                                                        Select Website Niches
                                                    </h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-sm text-gray-400`}>
                                                            {selectedTags.length} of 15 selected
                                                        </span>
                                                        {selectedTags.length > 0 && (
                                                            <button
                                                                onClick={() => setSelectedTags([])}
                                                                className="text-sm text-gray-400 hover:text-[#00FFA3] font-medium transition-colors px-3 py-1 hover:bg-[#161616]/50 cursor-pointer rounded-lg"
                                                            >
                                                                Clear all
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <p className={` ${errors.selectedTags ? "text-red-400" : "text-gray-400"}`}>
                                                    Choose the niches that best represent your target audience. Select up to 15 options.
                                                </p>
                                                {errors.selectedTags && (
                                                    <p className="mt-4 text-sm text-red-400">
                                                        {errors.selectedTags}
                                                    </p>
                                                )}
                                            </div>

                                            {selectedTags.length > 0 && (
                                                <div className="mb-8">
                                                    <div className="flex items-center mb-3">
                                                        <span className="text-sm font-medium text-gray-300 mr-2">Selected:</span>
                                                        <span className="text-sm text-gray-500">
                                                            {selectedTags.length} niche{selectedTags.length !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedTags.map((tag, index) => (
                                                            <div
                                                                key={index}
                                                                className="inline-flex items-center bg-gradient-to-br from-[#121212] to-[#0f0f0f] rounded-lg pl-3 pr-2 py-2 text-sm font-medium text-gray-200 border border-gray-800/50 shadow-lg hover:shadow-[#00FFA3]/10 transition-all duration-200 group"
                                                            >
                                                                <span className="mr-1.5 text-lg">{tag.split(' ')[0]}</span>
                                                                <span className="mr-2">{tag.split(' ').slice(1).join(' ')}</span>
                                                                <button
                                                                    onClick={() => removeTag(tag)}
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center text-gray-500 hover:text-[#00FFA3] rounded hover:bg-[#161616]"
                                                                    aria-label={`Remove ${tag}`}
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
                                                    const tagText = `${niche.emoji} ${niche.label}`;
                                                    const isSelected = selectedTags.includes(tagText);
                                                    const isDisabled = !isSelected && selectedTags.length >= 15;

                                                    return (
                                                        <button
                                                            key={niche.id}
                                                            type="button"
                                                            onClick={() => {
                                                                if (isSelected) {
                                                                    removeTag(tagText);
                                                                } else if (selectedTags.length < 15) {
                                                                    setSelectedTags([...selectedTags, tagText]);
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
                                                             aspect-square
                                                             group
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

                                        <div className="max-w-3xl mb-2">
                                            <p className="text-gray-200 font-bold mb-2 text-[17px]">
                                                Enter keywords
                                            </p>
                                            <p className='text-gray-400 mb-4'>
                                                Keywords are words or phrases that are used to match your ads with the terms people are searching for
                                            </p>

                                            <div className="relative">
                                                <div
                                                    className={`w-full min-h-[52px] px-3 py-2 border-2 rounded-lg flex flex-wrap gap-2 items-center focus-within:ring-2 bg-[#0a0a0a] transition-all
                                                ${errors.keywords ? "border-red-500/50" : "border-gray-800/50 focus-within:border-[#00FFA3] focus-within:shadow-lg focus-within:shadow-[#00FFA3]/10"}
                                                `}
                                                >
                                                    {KeyWords.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="flex items-center gap-1 bg-gradient-to-r from-[#00FFA3]/20 to-[#DC1FFF]/20 text-[#00FFA3] px-2 py-1 rounded-md text-sm border border-[#00FFA3]/30"
                                                        >
                                                            {tag}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeTag1(index)}
                                                                className="text-[#00FFA3] cursor-pointer hover:text-[#DC1FFF]"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    ))}

                                                    <input
                                                        type="text"
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        onKeyDown={handleKeyDown}
                                                        className="flex-1 outline-none text-gray-200 placeholder-gray-600 min-w-[120px] bg-transparent"
                                                    />
                                                </div>

                                                {errors.keywords && (
                                                    <p className="mt-2 text-sm text-red-400">{errors.keywords}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-8 py-6 bg-[#0a0a0a] border-t border-gray-800/50">
                                        <div className="flex items-center justify-between">
                                            <button
                                                onClick={back}
                                                className="px-6 py-3 border-2 border-gray-800/50 text-gray-300 font-medium rounded-lg hover:bg-[#161616]/50 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00FFA3] transition-all">
                                                Back
                                            </button>

                                            <button
                                                onClick={Next_btn}
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
            </div>
        </>
    )
}