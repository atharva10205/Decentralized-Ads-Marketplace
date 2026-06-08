import { prisma } from "@/app/lib/prisma";
import { auth } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth()
    if (!session || !session.user?.email) {
        return;
    }
    const { websiteName, websiteURL, walletAddress, keywords, selectedNiches } = await req.json();


    const cleanNiches = selectedNiches.map(niche =>
        niche.replace(/\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu, '').trim()
    );

    try {
        const res = await prisma.publisher.create({
            data: {
                website_name: websiteName,
                website_url: websiteURL,
                Tags: cleanNiches,
                keywords: keywords,
                wallet_address: walletAddress,
                email: session.user.email,
            },
        });

        if (res) return NextResponse.json({ success: true });
    } catch (err: any) {
        if (err.code === 'P2002') {
            return NextResponse.json(
                { error: "This website URL is already registered." },
                { status: 409 }
            );
        }
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }

}

export async function GET(req: Request) {
    const session = await auth()
    if (!session || !session.user?.email) {
        return;
    }
    const [address, user] = await Promise.all([
        prisma.publisher.findFirst({
            where: { email: session.user.email },
            select: { wallet_address: true }
        }),
        prisma.user.findUnique({
            where: { email: session.user.email },
            select: { accent: true, name: true, image: true }
        })
    ]); return NextResponse.json({
        address,
        accent: user?.accent ?? '#ffffff',
        user: {
            name: user?.name ?? '',
            image: user?.image ?? ''
        }
    });
}