import { getGlossary } from "@/lib/actions";
import { GlossaryClient, type GlossaryItem } from "@/components/GlossaryClient";

export const dynamic = "force-dynamic";

export default async function GlossaryPage() {
  const raw = await getGlossary("");
  const items: GlossaryItem[] = raw.map((v) => ({
    id: v.id,
    korean: v.korean,
    romanization: v.romanization,
    meaningVn: v.meaningVn,
    meaningEn: v.meaningEn,
    pos: v.pos,
    audioPath: v.audioPath,
    unitNumber: v.unit.number,
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tra từ — 어휘 색인</h2>
        <p className="text-gray-500">Tìm kiếm toàn bộ từ vựng trong sách.</p>
      </div>
      <GlossaryClient items={items} />
    </div>
  );
}
