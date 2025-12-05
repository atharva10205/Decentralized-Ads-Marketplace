import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";

export const RECEIPT_TTL = 60;

const KEY = process.env.SIGNING_KEY || "dev-secret-key";

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
  const now = Date.now();

  const {
    adId,
    visibleRatio,
    visibleDurationMs,
    clientTimestamp,
    userAgent,
    pointerEventsSeen,
    pageUrl,
  } = body;

  if (
    !adId ||
    visibleRatio == null ||
    visibleDurationMs == null ||
    !clientTimestamp
  ) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }

  const clientTs = Number(clientTimestamp);
  if (isNaN(clientTs) || Math.abs(now - clientTs) > 30_000) {
    return NextResponse.json({ error: "stale_timestamp" }, { status: 400 });
  }

  const ratioOk = visibleRatio >= 0.5;
  const durationOk = visibleDurationMs >= 1000;
  const pointerOk = !!pointerEventsSeen;

  const passed = ratioOk && durationOk && pointerOk;

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
