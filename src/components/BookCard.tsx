import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";
import type { BookMeta } from "@/lib/books";

interface BookSummary {
  total: number;
  learned: number;
  units: number;
}

interface Props {
  book: BookMeta;
  summary: BookSummary | null;
}

export function BookCard({ book, summary }: Props) {
  const pct =
    summary && summary.total
      ? Math.round((summary.learned / summary.total) * 100)
      : 0;

  const content = (
    <div
      className={`card-cute relative overflow-hidden group flex h-full gap-4 p-5 ${
        book.available ? "" : "opacity-70 saturate-50"
      }`}
    >
      {/* Washi tape */}
      <div className="absolute -top-3 -right-6 h-8 w-24 rotate-45 bg-primary/20 backdrop-blur-md transition-transform group-hover:rotate-12" />
      <div className="absolute -bottom-3 -left-6 h-8 w-24 rotate-45 bg-secondary/20 backdrop-blur-md transition-transform group-hover:-rotate-12" />

      <div
        className="relative grid h-32 w-24 shrink-0 place-items-center rounded-[1.5rem] text-white shadow-card transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
        style={{ backgroundColor: book.cover }}
      >
        {/* Binder rings effect */}
        <div className="absolute -left-2 top-4 h-3 w-4 rounded-full border-2 border-white/50 bg-bg shadow-sm" />
        <div className="absolute -left-2 top-1/2 h-3 w-4 -translate-y-1/2 rounded-full border-2 border-white/50 bg-bg shadow-sm" />
        <div className="absolute -left-2 bottom-4 h-3 w-4 rounded-full border-2 border-white/50 bg-bg shadow-sm" />

        <div className="text-center leading-tight">
          <p className="font-kr text-[10px] opacity-90">서울대 🌸</p>
          <p className="font-kr text-sm font-bold">한국어</p>
          <p className="mt-1 text-3xl font-extrabold drop-shadow-md">{book.code}</p>
        </div>
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col z-10">
        <span className="tag-cute shadow-sm bg-primary/10 text-primary">
          {book.levelKr} · {book.level}
        </span>
        <p className="mt-1.5 font-kr text-lg font-extrabold text-fg">{book.nameKr}</p>
        <p className="text-xs font-medium text-fg/50">{book.units} bài học ✨</p>

        <div className="mt-auto pt-2">
          {book.available ? (
            <>
              {summary && (
                <div className="mb-1.5">
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-fg/50">
                    {summary.learned}/{summary.total} từ đã học · {pct}%
                  </p>
                </div>
              )}
              <span className="flex items-center gap-1 font-display text-sm font-bold text-primary">
                Vào học
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </>
          ) : (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-fg/40">
              <Lock size={14} /> Sắp có
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (book.available) {
    return (
      <Link href={`/${book.slug}/vocabulary`} className="block h-full">
        {content}
      </Link>
    );
  }

  return (
    <div aria-disabled className="block h-full cursor-not-allowed">
      {content}
    </div>
  );
}
