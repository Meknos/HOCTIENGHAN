import { notFound } from "next/navigation";
import { BOOKS } from "@/lib/books";
import { UNITS_BY_SLUG } from "@/lib/units";
import { UnitGrid } from "@/components/UnitGrid";

export default function BookVocabularyHome({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const book = BOOKS.find((b) => b.slug === slug);
  if (!book || !book.available) notFound();

  const units = UNITS_BY_SLUG[slug] ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="font-display text-3xl font-extrabold">
          Từ vựng <span className="inline-block animate-bounce-soft">📝</span>
        </h2>
        <p className="mt-1 text-fg/60">{book.nameKr} — chọn bài để học từ vựng!</p>
      </div>
      <UnitGrid base={`/${slug}/vocabulary`} units={units} />
    </div>
  );
}
