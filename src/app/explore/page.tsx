"use client";

import Link from "next/link";
import { ExplorePhotoCard } from "@/components/ExplorePhotoCard";
import { SwipeCard } from "@/components/SwipeCard";
import { roles } from "@/data/roles";
import { loadStorage, updateStorage } from "@/lib/storage";
import type { AppStorage, RoleId } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export default function ExplorePage() {
  const [app, setApp] = useState<AppStorage | null>(null);

  useEffect(() => {
    setApp(loadStorage());
  }, []);

  const swiped = useMemo(() => {
    if (!app) return new Set<RoleId>();
    return new Set<RoleId>([
      ...app.explore.likedRoleIds,
      ...app.explore.dislikedRoleIds,
    ]);
  }, [app]);

  const remaining = useMemo(() => {
    return roles.filter((r) => !swiped.has(r.id));
  }, [swiped]);

  const current = remaining[0] ?? null;
  const next = remaining[1] ?? null;

  const likedCount = app?.explore.likedRoleIds.length ?? 0;
  const totalCount = roles.length;
  const doneCount = swiped.size;

  const swipe = (dir: "left" | "right") => {
    if (!current) return;
    const roleId = current.id;
    const nextApp = updateStorage((prev) => {
      const liked = prev.explore.likedRoleIds;
      const disliked = prev.explore.dislikedRoleIds;
      const nextExplore =
        dir === "right"
          ? {
              ...prev.explore,
              likedRoleIds: uniq([...liked, roleId]),
            }
          : {
              ...prev.explore,
              dislikedRoleIds: uniq([...disliked, roleId]),
            };

      const nextSwiped = new Set<RoleId>([
        ...nextExplore.likedRoleIds,
        ...nextExplore.dislikedRoleIds,
      ]);

      return {
        ...prev,
        explore: {
          ...nextExplore,
          exploreCompletedAt:
            nextSwiped.size >= roles.length ? new Date().toISOString() : prev.explore.exploreCompletedAt,
        },
      };
    });
    setApp(nextApp);
  };

  const reset = () => {
    const nextApp = updateStorage((prev) => ({
      ...prev,
      explore: { likedRoleIds: [], dislikedRoleIds: [], exploreCompletedAt: undefined },
    }));
    setApp(nextApp);
  };

  if (!app) {
    return (
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="text-sm text-zinc-600">載入中…</div>
      </div>
    );
  }

  const likedRoles = roles.filter((r) => app.explore.likedRoleIds.includes(r.id));
  const topLiked = likedRoles.slice(0, 3);

  return (
    <div className="flex flex-1 flex-col px-5 py-10">
      <header className="mx-auto w-full max-w-xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-600">興趣探索</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">左滑／右滑</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-600">
              進度 {doneCount}/{totalCount}
            </div>
            <div className="text-sm text-zinc-700">已喜歡 {likedCount}</div>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500/60 to-fuchsia-500/55"
            style={{ width: `${Math.round((doneCount / totalCount) * 100)}%` }}
          />
        </div>
      </header>

      <main className="mx-auto mt-8 w-full max-w-xl">
        {current ? (
          <div className="relative">
            {next ? (
              <div className="pointer-events-none absolute inset-0 translate-y-2 scale-[0.985] opacity-70 blur-[0.2px]">
                <ExplorePhotoCard role={next} />
              </div>
            ) : null}

            <SwipeCard onSwipe={swipe}>
              <ExplorePhotoCard role={current} />
            </SwipeCard>
          </div>
        ) : (
          <div className="rounded-[28px] border border-black/10 bg-white/80 p-7 text-zinc-950 shadow-[0_30px_90px_rgba(2,6,23,0.12)] backdrop-blur">
            <div className="text-sm text-zinc-600">已完成探索</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight">你的興趣摘要</div>

            {topLiked.length ? (
              <div className="mt-5 space-y-3">
                {topLiked.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-black/10 bg-white p-4"
                  >
                    <div className="text-base font-semibold">{r.title}</div>
                    <div className="mt-1 text-sm text-zinc-700">{r.tagline}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 text-sm text-zinc-700">
                你目前沒有按過「有興趣」，也沒關係；可以再探索一次看看。
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/plan"
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-900 active:scale-[0.99]"
              >
                前往職涯計畫
              </Link>
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50 active:scale-[0.99]"
              >
                重新探索
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => swipe("left")}
              disabled={!current}
              className="grid size-16 place-items-center rounded-full border border-black/10 bg-white text-rose-600 shadow-[0_18px_55px_rgba(2,6,23,0.14)] transition hover:bg-rose-50 disabled:opacity-40"
              title="沒興趣"
            >
              ✕
            </button>
            <div className="text-xs font-semibold text-zinc-600">左滑不喜歡</div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => swipe("right")}
              disabled={!current}
              className="grid size-16 place-items-center rounded-full border border-black/10 bg-white text-emerald-600 shadow-[0_18px_55px_rgba(2,6,23,0.14)] transition hover:bg-emerald-50 disabled:opacity-40"
              title="有興趣"
            >
              ♥
            </button>
            <div className="text-xs font-semibold text-zinc-600">右滑喜歡</div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-zinc-600">
          也可以直接拖曳卡片左右滑動
        </div>
      </main>
    </div>
  );
}

