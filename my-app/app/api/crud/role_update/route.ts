import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route"
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {

    const session = await auth()
    if (!session || !session.user?.email) {
       return;
    }
    
    const { role } = await req.json();
    if (
        role == "advertiser"
    ) {
        await prisma.user.update({
            where: {email:session.user.email},
            data: { role: "advertiser" },
        })
    } else {
        await prisma.user.update({
            where: {email:session.user.email},
            data: { role: "publisher" },
        })
    }
    return NextResponse.json({ success: true });
}