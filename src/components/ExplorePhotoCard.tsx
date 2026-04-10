"use client";

import Image from "next/image";
import type { CareerRole } from "@/lib/types";

function stableNumberFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function ExplorePhotoCard({ role }: { role: CareerRole }) {
  const subtitle = role.tags[0] ? role.tags[0] : "career";

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_30px_90px_rgba(2,6,23,0.14)]">
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={"/jobs/data_analyst.jpg"}
          alt={"/jobs/data_analyst.jpg"}
          fill
          sizes="(max-width: 640px) 92vw, 420px"
          className="object-cover"
          // onError={(e) => {
          //   const img = e.currentTarget as unknown as HTMLImageElement;
          //   if (!img.dataset.fallbackApplied) {
          //     img.dataset.fallbackApplied = "1";
          //     img.src = "/jobs/data_analyst.jpg";
          //   }
          // }}
          priority
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/0 to-zinc-100" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_circle_at_20%_0%,rgba(56,189,248,0.20),transparent_55%),radial-gradient(520px_circle_at_90%_12%,rgba(244,114,182,0.18),transparent_55%)]" />

      </div>

      <div className="border-t border-black/10 bg-zinc-50/80 p-5">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-semibold tracking-tight text-zinc-950">
            {role.title}
          </div>
        </div>
        <div className="mt-1 text-sm text-zinc-700">{role.tagline}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {role.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-zinc-700"
            >
              {t}
            </span>
          ))}
          <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-zinc-700">
            {subtitle}
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-xs font-semibold tracking-wide text-zinc-600">代表技能</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-900">
              {role.skills.slice(0, 5).map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-sky-500/70" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-xs font-semibold tracking-wide text-zinc-600">日常工作</div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-900">
              {role.dayToDay.slice(0, 5).map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-fuchsia-500/60" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

