import { auth } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth();

        const publisher_id = await prisma.publisher.findMany({
            where: {
                email: session?.user?.email
            }
        })
        const publisher_Id_website_url = publisher_id.map(p => ({ publisher_url: p.website_url, publisher_id: p.id }));

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("publisher_Id_website_url", publisher_Id_website_url)



        const impression = await prisma.impression.groupBy({
            by: ['publisher_id', 'publisher_url'],
            _sum: {
                impression: true
            },
            where: {
                OR: publisher_Id_website_url.map(p => ({
                    publisher_id: p.publisher_id,
                    publisher_url: p.publisher_url
                }))
            }
        });
        console.log("impression", impression);


        const clickCounts1 = await prisma.click.groupBy({
            by: ['publisher_id', 'publisher_url'],
            _count: {
                _all: true
            },
            where: {
                OR: publisher_Id_website_url.map(p => ({
                    publisher_id: p.publisher_id,
                    publisher_url: p.publisher_url
                }))
            }
        });

        console.log("clickCounts1", clickCounts1);

        const map = new Map<string, any>();

        // add impressions
        for (const i of impression) {
            const key = `${i.publisher_id}|${i.publisher_url}`;
            map.set(key, {
                publisher_id: i.publisher_id,
                publisher_url: i.publisher_url,
                impressions: i._sum.impression ?? 0,
                clicks: 0
            });
        }

        // add clicks
        for (const c of clickCounts1) {
            const key = `${c.publisher_id}|${c.publisher_url}`;
            const prev = map.get(key) || {
                publisher_id: c.publisher_id,
                publisher_url: c.publisher_url,
                impressions: 0,
                clicks: 0
            };

            prev.clicks = c._count._all;
            map.set(key, prev);
        }

        const merged = Array.from(map.values());

        console.log("merged", merged);





        const websites = await prisma.publisher.findMany({
            where: { email: session.user.email },
        });
        if (websites.length === 0) {
            return NextResponse.json([]);
        }



        const websiteUrls = websites.map(w => w.website_url).filter(Boolean) as string[];


        if (websiteUrls.length === 0) {
            return NextResponse.json([]);
        }


        const websiteNameMap = Object.fromEntries(
            websites.map(w => [w.website_url, w.website_name])
        );

        const websiteStatusMap = Object.fromEntries(
            websites.map(w => [w.website_url, w.status])
        );

        const impressions = await prisma.impression.findMany({
            where: { publisher_id: publisher_id.id }
        });

        const impression_map = impressions.map(w => ({
            publisher_url: w.publisher_url,
            impression: w.impression,
        }));

        // console.log("impression", impression_map)
        // console.log("impression_map", impression_map)


        const ad_id = await prisma.click.findMany({
            where: { publisher_id: publisher_id.id }
        })

        const ad_id_map = ad_id.map(w => w.ad_id)



        const clickCounts = await prisma.click.groupBy({
            by: ['ad_id'],
            where: {
                publisher_id: publisher_id.id,
                ad_id: { in: ad_id_map }
            },
            _count: {
                ad_id: true
            }
        });

        // console.log("Click counts:", clickCounts);

        const result = websiteUrls.map(url => {

            const impressionsCount = 0;

            const clicksCount = 0;

            const ctr = impressionsCount === 0 ? 0 : (clicksCount / impressionsCount) * 100;

            return {
                name: websiteNameMap[url],
                website_url: url,
                impressions: impressionsCount,
                clicks: clicksCount,
                ctr: Number(ctr.toFixed(2)),
                status: websiteStatusMap[url]
            };
        });

        // console.log("result", result)



        return NextResponse.json(result);

    } catch (error) {
        console.error("Error in GET /api/publisher/stats:", error);
        return NextResponse.json(
            { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
        );
    }
}