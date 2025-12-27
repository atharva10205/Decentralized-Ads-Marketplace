import { prisma } from "@/app/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const { publicKey, maximim_cost_per_bid, click, adID } = await req.json();

    console.log("publicKey:", publicKey);
    console.log("maximim_cost_per_bid:", maximim_cost_per_bid);
    console.log("click:", click);

    const res = await prisma.ad.update({
        where: {
            id: adID
        },
        data: {
            wallet_address: publicKey,
            cost_per_click: new Prisma.Decimal(maximim_cost_per_bid),
            Weekly_Clicks: Number(click),
            Weekly_Cost: new Prisma.Decimal(maximim_cost_per_bid)
        .mul(new Prisma.Decimal(click)),
        }
    })
    return NextResponse.json({ success: true })

}