"use client";

import { useEffect, useRef, useState } from "react";

export default function Ad({ adId }: { adId: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pointerSeen, setPointerSeen] = useState(false);
  const visibleStart = useRef<number | null>(null);
  const visibleMs = useRef(0);
  const sent = useRef(false);

  useEffect(() => {
    const pointer = () => setPointerSeen(true);

    window.addEventListener("mousemove", pointer);
    window.addEventListener("touchstart", pointer);

    return () => {
      window.removeEventListener("mousemove", pointer);
      window.removeEventListener("touchstart", pointer);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          console.log("Ad visible:", adId);
          visibleStart.current = performance.now();

          const loop = () => {
            if (!visibleStart.current) return;

            const now = performance.now();
            const timePassed = now - visibleStart.current;
            visibleMs.current = visibleMs.current + timePassed;
            visibleStart.current = now;

            const ratio = entry.intersectionRatio;

            if (
              !sent.current &&
              ratio >= 0.5 &&
              visibleMs.current >= 1000 &&
              pointerSeen
            ) {
              sendView(ratio, visibleMs.current);
            }

            requestAnimationFrame(loop);
          };

          requestAnimationFrame(loop);
        } else {
          console.log("Ad not visible:", adId);
          visibleStart.current = null;
        }
      },
      {
        threshold: [0, 0.5, 1],
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [pointerSeen]);

  async function sendView(ratio: number, ms: number) {
    sent.current = true;

    const body = {
      adId,          
      visibleRatio: Number(ratio.toFixed(3)),
      visibleDurationMs: Math.round(ms),
      clientTimestamp: Date.now(),
      pointerEventsSeen: pointerSeen,
      pageUrl: location.href,
      userAgent: navigator.userAgent,
    };

    console.log("sending view body:", body); 

    const res = await fetch("/api/receiveView", {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });

    console.log("Impression result:", await res.json());
  }


  return (
    <div
      ref={ref} className="w-full h-[250px] border border-neutral-700 rounded-xl flex items-center justify-center my-6 bg-neutral-900 shadow-lg">
      <div className="text-center">
        <div className="text-xs text-neutral-500 mb-1">Sponsored</div>
        <div className="text-lg font-semibold text-white tracking-wide">
          Ad Unit {adId}
        </div>
      </div>
    </div>
  );

}
