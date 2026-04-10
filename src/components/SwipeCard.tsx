"use client";

import { useMemo, useRef, useState } from "react";

type SwipeDirection = "left" | "right";

export function SwipeCard({
  children,
  onSwipe,
  disabled,
}: {
  children: React.ReactNode;
  onSwipe: (dir: SwipeDirection) => void;
  disabled?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [delta, setDelta] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState<SwipeDirection | null>(null);

  const rotate = useMemo(() => {
    const clamped = Math.max(-220, Math.min(220, delta.x));
    return (clamped / 220) * 10;
  }, [delta.x]);

  const likeOpacity = Math.max(0, Math.min(1, delta.x / 140));
  const nopeOpacity = Math.max(0, Math.min(1, -delta.x / 140));

  const commitSwipe = (dir: SwipeDirection) => {
    if (disabled) return;
    if (isAnimatingOut) return;
    setIsAnimatingOut(dir);
    const x = dir === "right" ? 520 : -520;
    setDelta({ x, y: delta.y });
    window.setTimeout(() => {
      onSwipe(dir);
      setDelta({ x: 0, y: 0 });
      setIsAnimatingOut(null);
      setIsDragging(false);
      start.current = null;
    }, 210);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    if (isAnimatingOut) return;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    setDelta({ x: dx, y: dy });
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    const threshold = 130;
    if (delta.x > threshold) return commitSwipe("right");
    if (delta.x < -threshold) return commitSwipe("left");
    setIsDragging(false);
    start.current = null;
    setDelta({ x: 0, y: 0 });
  };

  // const dragAmount = Math.min(1, Math.abs(delta.x) / 220);
  // const opacity = isDragging || isAnimatingOut ? 1 - dragAmount * 0.22 : 1;
  const opacity = 1;

  const style: React.CSSProperties = {
    transform: `translate3d(${delta.x}px, ${delta.y}px, 0) rotate(${rotate}deg)`,
    transition:
      isDragging || isAnimatingOut ? "none" : "transform 160ms ease-out, opacity 160ms ease-out",
    opacity,
    touchAction: "none",
  };

  return (
    <div ref={rootRef} className="relative">
      <div
        className="pointer-events-none absolute left-6 top-6 z-20 flex items-center gap-3"
        aria-hidden
      >
        <div
          className="rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-2 text-sm font-semibold tracking-wide text-emerald-800 shadow-sm"
          style={{ opacity: likeOpacity }}
        >
          有興趣
        </div>
        <div
          className="rounded-2xl border border-rose-300/70 bg-rose-50 px-4 py-2 text-sm font-semibold tracking-wide text-rose-800 shadow-sm"
          style={{ opacity: nopeOpacity }}
        >
          沒興趣
        </div>
      </div>

      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={disabled ? "opacity-60" : ""}
        style={style}
      >
        {children}
      </div>
    </div>
  );
}

