export function StrikeBadge({ strike }: { strike: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm">
      <span aria-hidden className="text-base">
        🔥
      </span>
      <span className="font-semibold tabular-nums">{strike}</span>
      {/* <span className="text-zinc-600">strike</span> */}
    </div>
  );
}

