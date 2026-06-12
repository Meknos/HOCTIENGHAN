import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getGrammarByUnit } from "@/lib/actions";
import { BOOKS } from "@/lib/books";
import { UNITS_BY_SLUG } from "@/lib/units";
import { GrammarCard } from "@/components/GrammarCard";
import { WritingChecker } from "@/components/WritingChecker";

export const dynamic = "force-dynamic";

export default async function BookGrammarUnitPage({
  params,
}: {
  params: { slug: string; unit: string };
}) {
  const { slug } = params;
  const book = BOOKS.find((b) => b.slug === slug);
  if (!book || !book.available) notFound();

  const num = Number(params.unit);
  const units = UNITS_BY_SLUG[slug] ?? [];
  const meta = units.find((u) => u.number === num);
  const grammar = await getGrammarByUnit(num, slug);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href={`/${slug}/grammar`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
        <ArrowLeft size={16} /> {book.nameKr}
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-kr text-2xl font-bold">{meta?.titleKr}</h2>
          <p className="text-gray-500">Bài {num} · Ngữ pháp · {meta?.titleVn}</p>
        </div>
        <Link href={`/chat?unit=${num}&book=${slug}`} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
          <Sparkles size={15} /> Hỏi AI
        </Link>
      </div>

      {grammar.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-gray-500">
          Chưa có dữ liệu ngữ pháp cho bài này. Hãy extract & seed từ PDF.
        </p>
      ) : (
        <div className="space-y-6">
          {grammar.map((g) => (
            <GrammarCard
              key={g.id}
              g={{
                id: g.id,
                pattern: g.pattern,
                titleVn: g.titleVn,
                explanationVn: g.explanationVn,
                rule: g.rule,
                examples: g.examples,
                exercises: g.exercises,
              }}
            />
          ))}
          <WritingChecker patterns={grammar.map((g) => g.pattern)} />
        </div>
      )}
    </div>
  );
}
