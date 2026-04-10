import type { CareerRole } from "@/lib/types";

export function RoleCard({ role }: { role: CareerRole }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_30px_90px_rgba(2,6,23,0.12)]">
      <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_20%_0%,rgba(56,189,248,0.22),transparent_58%),radial-gradient(700px_circle_at_90%_15%,rgba(244,114,182,0.18),transparent_58%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 to-white/20" />

      <div className="relative p-7 sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-600">興趣探索</div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {role.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-700 sm:text-base">
              {role.tagline}
            </p>
          </div>
          <div className="hidden shrink-0 rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-xs text-zinc-700 sm:block">
            左滑不喜歡／右滑喜歡
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
            <div className="text-xs font-semibold tracking-wide text-zinc-600">
              代表技能
            </div>
            <ul className="mt-3 space-y-2 text-sm text-zinc-900">
              {role.skills.slice(0, 5).map((s) => (
                <li key={s} className="flex items-start gap-2">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-sky-500/70" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
            <div className="text-xs font-semibold tracking-wide text-zinc-600">
              日常工作
            </div>
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

        <div className="mt-6 flex flex-wrap gap-2">
          {role.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs text-zinc-700"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

