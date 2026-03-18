import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    const { adID } = body;

    if (!adID) return new Response(null, { status: 204 });

    await prisma.ad.deleteMany({
        where: {
            id: adID,
            wallet_address: null,
        }
    });

    return new NextResponse(null, { status: 204 });
}