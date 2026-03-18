import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();
    if (!session || !session.user?.email) return;

    const res = await prisma.user.findUnique({
        where: {
            email: session.user.email,
            role: "advertiser"
        },
        select: {
            email: true,
            name: true,
            accent: true
        }
    });

    if (res) {
        return NextResponse.json({ res });
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

export async function PUT(req: Request) {
    const session = await auth();
    if (!session || !session.user?.email) return;

    const { accent } = await req.json();

    const updated = await prisma.user.update({
        where: { email: session.user.email },
        data: { accent },
    });

    return NextResponse.json({ success: true, updated });
}