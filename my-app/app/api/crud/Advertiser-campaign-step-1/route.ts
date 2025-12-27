import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
    const session = await auth()
    if (!session || !session.user?.email) {
        return;
    }


    const { businessName, url } = await req.json();

    console.log("businessName", businessName);
    console.log("url", url);

    const ad = await prisma.ad.create({
        data: {
            user_email:session.user.email, 
            business_name: businessName,
            destination_url: url
        }
    })
    return NextResponse.json({adID : ad.id})
}