import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const websites = await prisma.new_website.findMany({
        where: { email: session.user.email },
    });

    const websiteUrls = websites.map(w => w.website_url);

    const impressions = await prisma.impression.groupBy({
        by: ["website_url"],
        where: { website_url: { in: websiteUrls } },
        _count: { _all: true }
    });

    const clicks = await prisma.click.groupBy({
        by: ["website_url"],
        where: { website_url: { in: websiteUrls } },
        _count: { _all: true }
    });

    const impressionsMap = Object.fromEntries(
        impressions.map(i => [i.website_url, i._count._all])
    );

    const clicksMap = Object.fromEntries(
        clicks.map(c => [c.website_url, c._count._all])
    );

    const websiteNameMap = Object.fromEntries(
        websites.map(w => [w.website_url, w.website_name])
    );

    const websiteStatusMap = Object.fromEntries(
        websites.map(w => [w.website_url , w.status])
    )

    const result = websiteUrls.map(url => {
        const impressionsCount = impressionsMap[url] ?? 0;
        const clicksCount = clicksMap[url] ?? 0;

        const ctr =impressionsCount === 0? 0: (clicksCount / impressionsCount) * 100;

        return {
            name : websiteNameMap[url] ,
            website_url: url,
            impressions: impressionsCount,
            clicks: clicksCount,
            ctr: Number(ctr.toFixed(2)),
            status : websiteStatusMap[url]
        };
    });

    return NextResponse.json(result);

}
