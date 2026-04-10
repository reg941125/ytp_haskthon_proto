import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-14">
      <main className="w-full max-w-4xl">
        <div className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-[0_20px_80px_rgba(2,6,23,0.12)] backdrop-blur sm:p-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-400/35 to-fuchsia-400/25 ring-1 ring-black/10">
                <span className="text-lg font-semibold tracking-tight">e</span>
              </div>
              <div>
                <div className="text-sm text-zinc-600">職涯探索</div>
                <div className="text-2xl font-semibold tracking-tight">EmploYA!</div>
              </div>
            </div>

            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              用滑卡探索你的興趣，
              <br className="hidden sm:block" />
              生成一份可執行的職涯計畫
            </h1>
            <p className="max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg">
              先像交友軟體一樣左右滑，選出你感興趣的職位；接著根據結果，用假 AI
              生成一份 4–8 週的行動清單，並每天回答一題職涯小問題累積 strike。
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/explore"
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-zinc-900 active:scale-[0.99]"
              >
                開始興趣探索
              </Link>
              <Link
                href="/plan"
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-50 active:scale-[0.99]"
              >
                直接看職涯計畫
              </Link>
              <div className="text-sm text-zinc-600 sm:ml-auto">
                無登入・資料只存在本機
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
