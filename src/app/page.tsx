import { BookOpen } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BOOKS } from "@/lib/books";
import { BookCard } from "@/components/BookCard";

export const dynamic = "force-dynamic";

async function getSummary(slug: string) {
  const book = await prisma.book.findUnique({
    where: { slug },
    include: { units: { include: { vocab: { include: { srsCard: true } } } } },
  });
  if (!book) return null;
  const vocab = book.units.flatMap((u) => u.vocab);
  return {
    total: vocab.length,
    learned: vocab.filter((v) => v.srsCard).length,
    units: book.units.filter((u) => u.number > 0).length,
  };
}

export default async function LibraryPage() {
  const summaries: Record<string, Awaited<ReturnType<typeof getSummary>>> = {};
  for (const b of BOOKS.filter((x) => x.available)) {
    summaries[b.slug] = await getSummary(b.slug);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="font-display text-3xl font-extrabold">
          Thư viện sách{" "}
          <span className="inline-block animate-bounce-soft" aria-hidden>
            📖
          </span>
        </h2>
        <p className="mt-1 text-fg/60">
          Bộ giáo trình 서울대 한국어 — chọn sách để bắt đầu học nhé!
        </p>
      </div>

      <div className="stagger-children grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BOOKS.map((b) => (
          <BookCard key={b.slug} book={b} summary={summaries[b.slug] ?? null} />
        ))}
      </div>

      <p className="flex items-center gap-2 rounded-3xl border border-dashed border-border/80 bg-card/50 p-4 text-sm text-fg/50">
        <BookOpen size={16} className="shrink-0" />
        Các sách &quot;Sắp có&quot; sẽ mở khi nhập dữ liệu từ PDF tương ứng (thêm vào{" "}
        <code className="rounded bg-muted px-1">data/</code> rồi seed).
      </p>
    </div>
  );
}
