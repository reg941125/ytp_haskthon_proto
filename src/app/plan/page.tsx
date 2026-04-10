"use client";

import Link from "next/link";
import { DailyQuestionCard } from "@/components/DailyQuestionCard";
import { RoleDetailDialog } from "@/components/RoleDetailDialog";
import { StrikeBadge } from "@/components/StrikeBadge";
import { dailyQuestions } from "@/data/dailyQuestions";
import { roles } from "@/data/roles";
import { toLocalDateString, isYesterday } from "@/lib/date";
import { clearStorage, loadStorage, updateStorage } from "@/lib/storage";
import { generatePlan } from "@/lib/generatePlan";
import type { AppStorage, DailyAnswerValue, RoleTag } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";

function makeTodoKey(
  week: number,
  section: "goals" | "resources" | "outputs",
  index: number
): string {
  return `w${week}:${section}:${index}`;
}

function hashStringToInt(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function intersect<T>(a: T[], b: T[]): boolean {
  const set = new Set(a);
  for (const x of b) if (set.has(x)) return true;
  return false;
}

export default function PlanPage() {
  const [app, setApp] = useState<AppStorage | null>(null);
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);

  useEffect(() => {
    setApp(loadStorage());
  }, []);

  const today = useMemo(() => toLocalDateString(), []);
  const answeredToday = app?.dailyAnswers[today] ?? null;

  const likedTags = useMemo(() => {
    if (!app) return [] as RoleTag[];
    const likedRoles = roles.filter((r) => app.explore.likedRoleIds.includes(r.id));
    const tags = likedRoles.flatMap((r) => r.tags);
    return Array.from(new Set(tags));
  }, [app]);

  const question = useMemo(() => {
    if (!app) return null;
    if (answeredToday) {
      return dailyQuestions.find((q) => q.id === answeredToday.questionId) ?? null;
    }
    const pool =
      likedTags.length
        ? dailyQuestions.filter((q) => intersect(q.roleTags, likedTags))
        : dailyQuestions;
    const idx = hashStringToInt(today) % Math.max(1, pool.length);
    return pool[idx] ?? dailyQuestions[0] ?? null;
  }, [app, answeredToday, likedTags, today]);

  const plan = useMemo(() => {
    if (!app) return null;
    return generatePlan(app.explore.likedRoleIds);
  }, [app]);

  useEffect(() => {
    if (!plan?.weeks.length) return;
    const first = plan.weeks[0]?.week ?? 1;
    setActiveWeek((prev) => (plan.weeks.some((w) => w.week === prev) ? prev : first));
  }, [plan]);

  const todoProgress = useMemo(() => {
    if (!app || !plan) return { done: 0, total: 0, pct: 0 };
    const keys: string[] = [];
    for (const w of plan.weeks) {
      w.goals.forEach((_, i) => keys.push(makeTodoKey(w.week, "goals", i)));
      w.resources.forEach((_, i) => keys.push(makeTodoKey(w.week, "resources", i)));
      w.outputs.forEach((_, i) => keys.push(makeTodoKey(w.week, "outputs", i)));
    }
    const total = keys.length;
    const done = keys.reduce((acc, k) => acc + (app.planTodos[k] ? 1 : 0), 0);
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  }, [app, plan]);

  const activeWeekData = useMemo(() => {
    if (!plan) return null;
    return plan.weeks.find((w) => w.week === activeWeek) ?? plan.weeks[0] ?? null;
  }, [plan, activeWeek]);

  const activeWeekProgress = useMemo(() => {
    if (!app || !activeWeekData) return { done: 0, total: 0, pct: 0 };
    const keys: string[] = [];
    activeWeekData.goals.forEach((_, i) => keys.push(makeTodoKey(activeWeekData.week, "goals", i)));
    activeWeekData.resources.forEach((_, i) =>
      keys.push(makeTodoKey(activeWeekData.week, "resources", i))
    );
    activeWeekData.outputs.forEach((_, i) =>
      keys.push(makeTodoKey(activeWeekData.week, "outputs", i))
    );
    const total = keys.length;
    const done = keys.reduce((acc, k) => acc + (app.planTodos[k] ? 1 : 0), 0);
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { done, total, pct };
  }, [app, activeWeekData]);

  const toggleTodo = (
    week: number,
    section: "goals" | "resources" | "outputs",
    index: number
  ) => {
    const key = makeTodoKey(week, section, index);
    const next = updateStorage((prev) => ({
      ...prev,
      planTodos: {
        ...prev.planTodos,
        [key]: !prev.planTodos[key],
      },
    }));
    setApp(next);
  };

  const setWeekNote = (week: number, note: string) => {
    const key = String(week);
    const next = updateStorage((prev) => ({
      ...prev,
      planWeekNotes: {
        ...(prev.planWeekNotes ?? {}),
        [key]: note,
      },
    }));
    setApp(next);
  };

  const answer = (value: DailyAnswerValue) => {
    if (!question) return;
    if (answeredToday) return;

    const next = updateStorage((prev) => {
      const prevStrike = prev.strike.current ?? 0;
      const last = prev.strike.lastAnsweredDate;
      const nextStrike = isYesterday(last, today) ? prevStrike + 1 : 1;

      return {
        ...prev,
        dailyAnswers: {
          ...prev.dailyAnswers,
          [today]: { questionId: question.id, answer: value },
        },
        strike: {
          current: nextStrike,
          lastAnsweredDate: today,
        },
      };
    });
    setApp(next);
  };

  const resetAll = () => {
    clearStorage();
    setApp(loadStorage());
  };

  if (!app || !plan || !question) {
    return (
      <div className="flex flex-1 items-center justify-center px-5 py-12">
        <div className="text-sm text-zinc-600">載入中…</div>
      </div>
    );
  }

  const selectedRole =
    selectedRoleId != null
      ? plan.recommendedRoles.find((r) => r.id === selectedRoleId) ??
        roles.find((r) => r.id === selectedRoleId) ??
        null
      : null;

  return (
    <div className="flex flex-1 flex-col px-5 py-10">
      <header className="mx-auto w-full max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm text-zinc-600">職涯計畫</div>
            <div className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {plan.headline}
            </div>
            <div className="mt-2 text-sm text-zinc-700">
              根據你喜歡的職位（{app.explore.likedRoleIds.length}）生成；資料為假資料，可之後替換成 AI API。
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StrikeBadge strike={app.strike.current} />
            <Link
              href="/explore"
              className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
            >
              回興趣探索
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 w-full max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-6">
            <DailyQuestionCard
              question={question}
              answered={answeredToday ? { answer: answeredToday.answer } : null}
              onAnswer={answer}
            />

            <div className="rounded-[28px] border border-black/10 bg-white/80 p-7 shadow-[0_30px_90px_rgba(2,6,23,0.12)] backdrop-blur">
              <div className="text-sm text-zinc-600">推薦方向</div>
              <div className="mt-1 text-xl font-semibold tracking-tight">你可能會喜歡</div>
              <div className="mt-5 space-y-3">
                {plan.recommendedRoles.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRoleId(r.id)}
                    className="w-full rounded-2xl border border-black/10 bg-white p-4 text-left transition hover:bg-zinc-50"
                  >
                    <div className="text-base font-semibold">{r.title}</div>
                    <div className="mt-1 text-sm text-zinc-700">{r.tagline}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {r.skills.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-zinc-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-[28px] border border-black/10 bg-white/80 p-7 shadow-[0_30px_90px_rgba(2,6,23,0.12)] backdrop-blur">
              <div className="text-sm text-zinc-600">4–8 週行動計畫</div>
              <div className="mt-1 text-xl font-semibold tracking-tight">從今天就能開始</div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <div>進度</div>
                  <div className="tabular-nums">
                    {todoProgress.done}/{todoProgress.total}（{todoProgress.pct}%）
                  </div>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500/65 to-sky-500/60"
                    style={{ width: `${todoProgress.pct}%` }}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {plan.weeks.map((w) => (
                    <button
                      key={w.week}
                      type="button"
                      onClick={() => setActiveWeek(w.week)}
                      className={[
                        "rounded-full border px-4 py-2 text-sm font-semibold transition",
                        activeWeek === w.week
                          ? "border-black/15 bg-zinc-950 text-white"
                          : "border-black/10 bg-white text-zinc-800 hover:bg-zinc-50",
                      ].join(" ")}
                    >
                      第 {w.week} 週
                    </button>
                  ))}
                </div>

                {activeWeekData ? (
                  <div className="rounded-2xl border border-black/10 bg-white px-5 py-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <div className="text-xs text-zinc-600">第 {activeWeekData.week} 週</div>
                        <div className="mt-1 text-base font-semibold">{activeWeekData.title}</div>
                      </div>
                      <div className="text-xs text-zinc-600 tabular-nums">
                        本週 {activeWeekProgress.done}/{activeWeekProgress.total}（{activeWeekProgress.pct}%）
                      </div>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500/65 to-sky-500/60"
                        style={{ width: `${activeWeekProgress.pct}%` }}
                      />
                    </div>

                    <div className="mt-4 grid gap-4 text-sm text-zinc-900 sm:grid-cols-3">
                      {(
                        [
                          ["目標", "goals"],
                          ["資源", "resources"],
                          ["產出", "outputs"],
                        ] as const
                      ).map(([label, section]) => (
                        <div key={section}>
                          <div className="text-xs font-semibold tracking-wide text-zinc-600">
                            {label}
                          </div>
                          <ul className="mt-2 space-y-2">
                            {activeWeekData[section].map((g, i) => {
                              const key = makeTodoKey(activeWeekData.week, section, i);
                              const done = !!app.planTodos[key];
                              return (
                                <li key={key}>
                                  <button
                                    type="button"
                                    onClick={() => toggleTodo(activeWeekData.week, section, i)}
                                    className="flex w-full items-start gap-2 rounded-lg px-1 py-1 text-left transition hover:bg-zinc-50"
                                  >
                                    <span
                                      className={[
                                        "mt-0.5 grid size-5 shrink-0 place-items-center rounded border",
                                        done
                                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                          : "border-black/15 bg-white text-transparent",
                                      ].join(" ")}
                                      aria-hidden
                                    >
                                      ✓
                                    </span>
                                    <span className={done ? "text-zinc-500 line-through" : ""}>
                                      {g}
                                    </span>
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 rounded-2xl border border-black/10 bg-zinc-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs font-semibold tracking-wide text-zinc-700">
                          任務完成心得
                        </div>
                        <div className="text-xs text-zinc-500">
                          第 {activeWeekData.week} 週
                        </div>
                      </div>
                      <textarea
                        value={app.planWeekNotes?.[String(activeWeekData.week)] ?? ""}
                        onChange={(e) => setWeekNote(activeWeekData.week, e.target.value)}
                        placeholder="寫下你這週完成任務的心得、卡住的點、下週要怎麼調整…"
                        className="mt-3 min-h-[110px] w-full resize-y rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm leading-7 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                      />
                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-xs text-zinc-500">
                          會自動保存到本機（localStorage）
                        </div>
                        <button
                          type="button"
                          className="inline-flex h-10 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-900 active:scale-[0.99]"
                        >
                          提交
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-zinc-600">
                今日日期：{today}（同一天題目固定）
              </div>
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex h-10 items-center justify-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50"
              >
                清空本機資料
              </button>
            </div>
          </section>
        </div>

        {selectedRole ? (
          <RoleDetailDialog
            role={selectedRole}
            open={!!selectedRoleId}
            onClose={() => setSelectedRoleId(null)}
          />
        ) : null}
      </main>
    </div>
  );
}

