import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

export const RECEIPT_TTL = 60;
const KEY = process.env.SIGNING_KEY || "dev-secret-key";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export function signReceipt(payloadObj: any) {
  const payload = JSON.stringify(payloadObj);
  const h = crypto.createHmac("sha256", KEY);
  h.update(payload);
  const signature = h.digest("hex");
  return { payloadObj, signature };
}

export function logEvent(event: any) {
  try {
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
    fs.appendFileSync(
      path.join(logsDir, "views.jsonl"),
      JSON.stringify(event) + "\n"
    );
  } catch {}
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log("receiveView body:", body);

  const {
    adId,
    visibleRatio,
    visibleDurationMs,
    clientTimestamp,
    pointerEventsSeen,
    pageUrl,
  } = body;

  const missing: string[] = [];
  if (adId === undefined || adId === null || adId === "") missing.push("adId");
  if (visibleRatio === undefined || visibleRatio === null) missing.push("visibleRatio");
  if (visibleDurationMs === undefined || visibleDurationMs === null) missing.push("visibleDurationMs");
  if (clientTimestamp === undefined || clientTimestamp === null) missing.push("clientTimestamp");

  if (missing.length) {
    console.log("missing fields:", missing);
    return NextResponse.json({ error: "missing_fields", missing, received: body }, { status: 400 });
  }

  const clientTs = Number(clientTimestamp);
  if (isNaN(clientTs) || Math.abs(Date.now() - clientTs) > 30000) {
    console.log("stale timestamp", { clientTs });
    return NextResponse.json({ error: "stale_timestamp" }, { status: 400 });
  }

  const ratioOk = visibleRatio >= 0.5;
  const durationOk = visibleDurationMs >= 1000;
  const pointerOk = !!pointerEventsSeen;
  const passed = ratioOk && durationOk && pointerOk;

  const now = Date.now();
  const payload = {
    adId,
    pageUrl: pageUrl || null,
    visibleRatio,
    visibleDurationMs,
    serverTimestamp: now,
    clientTimestamp: clientTs,
    passed,
  };

  logEvent({ raw: body });

  try {
    // treat incoming adId as string key (ad_key); ensure your Prisma schema has `ad_key String @unique`
    // look up existing row by the unique string field
const adKey = String(adId);
if (adKey) {
  const existing = await prisma.aD_1.findUnique({
    where: { ad_id: adKey },    // <- use ad_id (String @unique)
  });

  if (existing) {
    // you can keep updating by id or by ad_id
    await prisma.aD_1.update({
      where: { id: existing.id },
      data: { views: { increment: 1 } },
    });
    console.log("incremented views for ad_id:", adKey);
  } else {
    await prisma.aD_1.create({
      data: { ad_id: adKey, views: 1 },  // <- create using ad_id
    });
    console.log("created ad row for ad_id:", adKey);
  }
}

  } catch (err) {
    console.error("DB error incrementing ad view:", err);
  }

  const { payloadObj, signature } = signReceipt(payload);

  return NextResponse.json({
    verified: passed,
    receipt: {
      payload: payloadObj,
      signature,
    },
    receipt_ttl_seconds: RECEIPT_TTL,
  });
}
