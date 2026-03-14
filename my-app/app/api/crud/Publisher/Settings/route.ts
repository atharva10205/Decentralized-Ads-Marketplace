import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();
    if (!session || !session.user?.email) return;

    const res = await prisma.user.findUnique({
        where: {
            email: session.user.email,
            role: "publisher"
        },
        select: {
            email: true,
            name: true,
            accent : true
        }
    });

    const WalletAddress = await prisma.publisher.findFirst({
        where: {
            email: session.user.email
        },
        select: {
            wallet_address: true
        }
    })
    if (res) {
        return NextResponse.json({ res, WalletAddress });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session || !session.user?.email) return;

    const { name, email } = await req.json();

    const updated = await prisma.user.update({
        where: { email: session.user.email },
        data: { name, email },
    });

    return NextResponse.json({ success: true, updated });
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session || !session.user?.email) return;

    const { wallet_address } = await req.json();

    const updated = await prisma.publisher.updateMany({
        where: { email: session.user.email },
        data: { wallet_address },
    });

    return NextResponse.json({ success: true, updated });
}