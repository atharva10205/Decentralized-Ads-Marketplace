import { prisma } from "@/app/lib/prisma";

interface CachedPublisher { id: string; expiresAt: number; }
interface CachedCPC { cpc: number; expiresAt: number; }

const publisherCache = new Map<string, CachedPublisher>();
const cpcCache = new Map<string, CachedCPC>();
const CACHE_TTL = 5 * 60 * 1000;

setInterval(() => {
    const now = Date.now();
    for (const [k, v] of publisherCache.entries()) if (v.expiresAt < now) publisherCache.delete(k);
    for (const [k, v] of cpcCache.entries()) if (v.expiresAt < now) cpcCache.delete(k);
}, 60000);

export async function getPublisher(url: string) {
    if (!url) return null;
    const cached = publisherCache.get(url);
    if (cached && cached.expiresAt > Date.now()) return { id: cached.id };

    const publisher = await prisma.publisher.findUnique({
        where: { website_url: url },
        select: { id: true }
    });
    if (publisher) publisherCache.set(url, { id: publisher.id, expiresAt: Date.now() + CACHE_TTL });
    return publisher;
}

export async function getAdCPC(adId: string): Promise<number | null> {
    if (!adId) return null;
    const cached = cpcCache.get(adId);
    if (cached && cached.expiresAt > Date.now()) return cached.cpc;

    const ad = await prisma.ad.findUnique({
        where: { id: adId },
        select: { cost_per_click: true }
    });
    if (!ad?.cost_per_click) return null;

    const cpc = Math.round(Number(ad.cost_per_click) * 1_000_000_000);
    cpcCache.set(adId, { cpc, expiresAt: Date.now() + CACHE_TTL });
    return cpc;
}