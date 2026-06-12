import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { getVocabByUnit } from "@/lib/actions";
import { UNITS } from "@/lib/units";
import { VocabStudy, type VocabItem } from "@/components/VocabStudy";

export const dynamic = "force-dynamic";

export default async function VocabUnitPage({
  params,
}: {
  params: { unit: string };
}) {
  const num = Number(params.unit);
  const meta = UNITS.find((u) => u.number === num);
  const raw = await getVocabByUnit(num);

  const vocab: VocabItem[] = raw.map((v) => ({
    id: v.id,
    korean: v.korean,
    romanization: v.romanization,
    meaningVn: v.meaningVn,
    meaningEn: v.meaningEn,
    pos: v.pos,
    audioPath: v.audioPath,
    examples: v.examples.map((e) => ({ korean: e.korean, meaningVn: e.meaningVn })),
    learned: Boolean(v.srsCard),
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link href="/vocabulary" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary">
        <ArrowLeft size={16} /> Tất cả bài
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-kr text-2xl font-bold">{meta?.titleKr}</h2>
          <p className="text-gray-500">Bài {num} · Từ vựng · {meta?.titleVn}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/chat?unit=${num}`} className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
            <Sparkles size={15} /> Hỏi AI
          </Link>
          <Link href={`/grammar/${num}`} className="rounded-lg bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
            Ngữ pháp →
          </Link>
        </div>
      </div>

      {vocab.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-gray-500">
          Chưa có dữ liệu từ vựng cho bài này. Hãy extract & seed từ PDF.
        </p>
      ) : (
        <VocabStudy vocab={vocab} />
      )}
    </div>
  );
}
