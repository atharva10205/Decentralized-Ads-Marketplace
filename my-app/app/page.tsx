"use client";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function GetStarted() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white">
            <header>
                <div className="flex items-center justify-between px-8 py-6">
                    <div className="flex items-center gap-8">

                        <h1
                            onClick={() => router.push("/")}
                            className="text-xl font-semibold tracking-wide cursor-pointer"
                        >
                            AdFlow
                        </h1>

                        <div>
                            <h1 className="text-gray-500 hover:text-gray-300 cursor-pointer">Goal</h1>
                        </div>

                        <div className="">
                            <h1 className="text-gray-500 hover:text-gray-300 cursor-pointer">How it work</h1>
                        </div>



                    </div>


                    <div className="flex gap-4">
                        <button
                           onClick={() => signIn("google")}
                            className="px-4 py-2 text-sm text-gray-300 hover:text-white transition cursor-pointer"
                        >
                            Sign in
                        </button>

                        <button
                             onClick={() => signIn("google")}
                            className="px-5 py-2 text-sm rounded-full bg-white text-black font-medium hover:bg-gray-200 transition cursor-pointer"
                        >
                            Start now
                        </button>
                    </div>
                </div>

                <div className="h-px w-screen bg-gray-800" />
            </header>

            <main className="flex flex-col items-center justify-center text-center px-6 mt-32">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
                    Ads that work. <br className="hidden md:block" />
                    Only pay for real attention.
                </h2>

                <p className="mt-6 text-gray-400 max-w-xl text-sm md:text-base">
                    Launch, track, and optimize ads with full transparency.
                    Built for modern products.
                </p>

                <div className="mt-10">
                    <button
                        onClick={() => router.push("/api/auth/signin")}
                        className="px-8 py-3 rounded-full bg-white text-black font-medium hover:bg-gray-200 transition cursor-pointer"
                    >
                        Start Now
                    </button>
                </div>
            </main>

            <footer className="absolute bottom-6 w-full text-center text-xs text-gray-600">
                Simple. Transparent. Performance-driven.
            </footer>
        </div>
    );
}
