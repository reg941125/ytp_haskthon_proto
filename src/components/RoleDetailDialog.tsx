"use client";

import Image from "next/image";
import type { CareerRole } from "@/lib/types";
import { useEffect, useId, useRef } from "react";

export function RoleDetailDialog({
  role,
  open,
  onClose,
}: {
  role: CareerRole;
  open: boolean;
  onClose: () => void;
}) {
  const id = useId();
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={id}
      className="fixed left-1/2 top-1/2 max-h-[min(780px,calc(100vh-48px))] w-[min(920px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-black/10 bg-white p-0 shadow-[0_30px_120px_rgba(2,6,23,0.18)] backdrop:bg-black/25"
      onClose={onClose}
      onClick={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <div className="grid max-h-[min(780px,calc(100vh-48px))] gap-0 overflow-auto md:grid-cols-[320px_1fr]">
        <div className="relative h-[220px] md:h-full">
          <Image
            src={role.imageSrc}
            alt={role.title}
            fill
            sizes="320px"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={id} className="text-2xl font-semibold tracking-tight text-zinc-950">
                {role.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-zinc-700">{role.tagline}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {role.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-black/10 bg-zinc-50 px-3 py-1 text-xs text-zinc-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="grid size-10 place-items-center rounded-full border border-black/10 bg-white text-zinc-700 transition hover:bg-zinc-50"
              aria-label="關閉"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-xs font-semibold tracking-wide text-zinc-600">
                代表技能
              </div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-900">
                {role.skills.map((s) => (
                  <li key={s} className="flex items-start gap-2">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-sky-500/70" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-xs font-semibold tracking-wide text-zinc-600">
                日常工作
              </div>
              <ul className="mt-3 space-y-2 text-sm text-zinc-900">
                {role.dayToDay.map((s) => (
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
    </dialog>
  );
}

