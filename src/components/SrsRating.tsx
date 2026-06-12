"use client";

import type { Rating } from "@/lib/srs";

const BUTTONS: { rating: Rating; label: string; emoji: string; cls: string }[] = [
  { rating: "hard", label: "Khó", emoji: "😅", cls: "bg-danger/10 text-danger hover:bg-danger/20 hover:scale-105" },
  { rating: "ok", label: "OK", emoji: "🙂", cls: "bg-accent/15 text-accent hover:bg-accent/25 hover:scale-105" },
  { rating: "easy", label: "Dễ", emoji: "😊", cls: "bg-success/10 text-success hover:bg-success/20 hover:scale-105" },
];

export function SrsRating({ onRate }: { onRate: (r: Rating) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {BUTTONS.map((b) => (
        <button
          key={b.rating}
          onClick={() => onRate(b.rating)}
          className={`flex flex-col items-center gap-1 rounded-2xl py-3.5 font-display text-sm font-bold transition-all duration-200 active:scale-95 ${b.cls}`}
        >
          <span className="text-xl">{b.emoji}</span>
          {b.label}
        </button>
      ))}
    </div>
  );
}
