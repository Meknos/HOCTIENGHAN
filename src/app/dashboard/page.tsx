import Link from "next/link";
import { RotateCcw, ArrowRight, BookA, Languages, ChevronLeft, Sparkles } from "lucide-react";
import { getDueCount, getProgress, getStreakCount } from "@/lib/actions";
import { UNITS } from "@/lib/units";
import { CURRENT_BOOK } from "@/lib/books";
import { ProgressRing } from "@/components/ProgressRing";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [due, progress, streak] = await Promise.all([
    getDueCount(),
    getProgress(),
    getStreakCount(),
  ]);

  const totalLearned = progress.reduce((s, p) => s + p.learned, 0);
  const totalVocab = progress.reduce((s, p) => s + p.total, 0);

  const stats = [
    { label: "Thẻ cần ôn hôm nay", value: due, accent: "text-primary", emoji: "📋", bg: "from-primary/10 to-primary/5" },
    { label: "Từ đã học", value: `${totalLearned}/${totalVocab}`, accent: "text-secondary", emoji: "📚", bg: "from-secondary/10 to-secondary/5" },
    { label: "Chuỗi ngày", value: streak, accent: "text-accent", emoji: "🔥", bg: "from-accent/15 to-accent/5" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="animate-fade-in-up">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-fg/50 transition-colors hover:text-primary">
          <ChevronLeft size={16} /> Thư viện sách
        </Link>
        <h2 className="mt-2 font-display text-3xl font-extrabold">
          안녕하세요! <span className="inline-block animate-bounce-soft">👋</span>
        </h2>
        <p className="mt-1 text-fg/60">
          Đang học <span className="font-semibold text-fg">{CURRENT_BOOK.nameKr}</span> — hôm nay học gì nào?
        </p>
      </div>

      <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`card-cute bg-gradient-to-br ${s.bg} p-5`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-fg/60">{s.label}</p>
              <span className="text-xl">{s.emoji}</span>
            </div>
            <p className={`mt-2 font-display text-4xl font-extrabold ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <Link href="/review" className="gradient-cta group flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-white/20 p-3 transition-transform group-hover:animate-wiggle">
            <RotateCcw size={28} />
          </div>
          <div>
            <p className="font-display text-xl font-bold">Bắt đầu ôn tập</p>
            <p className="text-sm text-white/85">
              {due > 0 ? `${due} thẻ đang chờ bạn ✨` : "Không có thẻ nào — học từ mới nhé! 🌱"}
            </p>
          </div>
        </div>
        <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
      </Link>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/hangeul"
          className="card-cute group flex items-center gap-3 p-5 hover:border-secondary/40"
        >
          <div className="rounded-2xl bg-secondary/10 p-3 text-secondary transition-transform group-hover:scale-110">
            <BookA size={22} />
          </div>
          <span className="font-display font-bold">Học bảng chữ cái 한글</span>
        </Link>
        <Link
          href="/vocabulary"
          className="card-cute group flex items-center gap-3 p-5 hover:border-secondary/40"
        >
          <div className="rounded-2xl bg-secondary/10 p-3 text-secondary transition-transform group-hover:scale-110">
            <Languages size={22} />
          </div>
          <span className="font-display font-bold">Học từ vựng</span>
        </Link>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-accent" />
          <h3 className="font-display text-lg font-bold">Tiến độ 8 bài</h3>
        </div>
        <div className="stagger-children grid grid-cols-2 gap-4 sm:grid-cols-4">
          {UNITS.map((u) => {
            const p = progress.find((x) => x.number === u.number);
            const pct = p && p.total ? (p.learned / p.total) * 100 : 0;
            return (
              <Link
                key={u.number}
                href={`/vocabulary/${u.number}`}
                className="card-cute group flex flex-col items-center gap-2 p-4 text-center"
              >
                <div className="transition-transform group-hover:scale-110">
                  <ProgressRing value={pct} />
                </div>
                <span className="font-kr text-sm font-semibold">{u.titleKr}</span>
                <span className="tag-cute">Bài {u.number}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
