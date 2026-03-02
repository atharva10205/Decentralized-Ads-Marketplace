import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const session = await auth();

    if (!session || !session.user?.email) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
    const publisher = await prisma.publisher.findFirst({
        where: {
            email: session.user.email
        },
        select: {
            wallet_address: true
        }
    });

    const user = await prisma.publisher.findMany({
        where: {
            email: session.user.email
        },
        select: {
            id: true,
            website_url: true,
        }
    })

    const websiteUrlMap = user
        .map(w => w.website_url)
        .filter((url): url is string => url !== null);

    if (websiteUrlMap.length === 0) {
        return NextResponse.json({ error: "No websites found" }, { status: 404 });
    }

    const data = await prisma.click.findMany({
        where: {
            publisher_url: {
                in: websiteUrlMap
            }
        },
        select: {
            ad_id: true,
            publisher_id: true,
        }
    });
    
    if (!data) {
        return NextResponse.json({ error: "data not found" }, { status: 404 });
    }

    const adIdMap = data.map(w=>w.ad_id);

    const cpc = await prisma.ad.findMany({
        where:{
            id:{in:adIdMap}
        },
        select:{
            id:true,
            Cost:true
        }
    })
    console.log("dadtatdatdtadtatttata", cpc)

    return NextResponse.json(publisher);
}