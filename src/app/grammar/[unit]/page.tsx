import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getGrammarByUnit } from "@/lib/actions";
import { UNITS } from "@/lib/units";
import { GrammarCard } from "@/components/GrammarCard";
import { WritingChecker } from "@/components/WritingChecker";

export const dynamic = "force-dynamic";

export default async function GrammarUnitPage({
  params,
}: {
  params: { unit: string };
}) {
  const num = Number(params.unit);
  const meta = UNITS.find((u) => u.number === num);
  const grammar = await getGrammarByUnit(num);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/grammar" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
        <ArrowLeft size={16} /> Tất cả bài
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-kr text-2xl font-bold">{meta?.titleKr}</h2>
          <p className="text-gray-500">Bài {num} · Ngữ pháp · {meta?.titleVn}</p>
        </div>
        <Link href={`/chat?unit=${num}`} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
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
