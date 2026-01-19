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


    const res = await prisma.publisher.create({
        data: {
            website_name: websiteName,
            website_url: websiteURL,
            Tags: cleanNiches,
            keywords: keywords,
            wallet_address: walletAddress,
            email : session.user?.email
        }
    })

    if (res) {
        return NextResponse.json({ success: true })
    }

}