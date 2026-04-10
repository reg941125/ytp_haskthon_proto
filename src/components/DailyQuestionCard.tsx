"use client";

import type { DailyAnswerValue, DailyQuestion } from "@/lib/types";

export function DailyQuestionCard({
  question,
  answered,
  onAnswer,
}: {
  question: DailyQuestion;
  answered?: { answer: DailyAnswerValue } | null;
  onAnswer: (answer: DailyAnswerValue) => void;
}) {
  return (
    <div className="rounded-[28px] border border-black/10 bg-white/80 p-7 shadow-[0_30px_90px_rgba(2,6,23,0.12)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-zinc-600">職涯小問題</div>
          <div className="mt-1 text-xl font-semibold tracking-tight">
            今天你想探索什麼？
          </div>
        </div>
        <div className="hidden rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs text-zinc-700 sm:block">
          每天一題，累積 strike
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5">
        <div className="text-sm text-zinc-600">題目</div>
        <div className="mt-2 text-lg font-semibold leading-7">{question.text}</div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {question.options.map((opt) => {
          const isPicked = answered?.answer === opt;
          return (
            <button
              key={opt}
              type="button"
              disabled={!!answered}
              onClick={() => onAnswer(opt)}
              className={[
                "inline-flex h-12 items-center justify-center rounded-2xl border px-4 text-sm font-semibold transition active:scale-[0.99]",
                answered
                  ? isPicked
                    ? "border-black/15 bg-zinc-950 text-white"
                    : "border-black/10 bg-white text-zinc-600"
                  : "border-black/10 bg-white text-zinc-950 hover:bg-zinc-50",
              ].join(" ")}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className="mt-5 space-y-3">
          <div className="text-sm text-zinc-700">
            你今天的答案是：{" "}
            <span className="font-semibold text-zinc-950">{answered.answer}</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-black/10 bg-white text-sm font-semibold text-zinc-950">
              A
            </div>
            <div className="flex-1 rounded-2xl border border-black/10 bg-white p-4 text-sm leading-7 text-zinc-900">
              {question.answer}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-xs text-zinc-600">作答後會自動計入今日 strike。</div>
      )}
    </div>
  );
}

