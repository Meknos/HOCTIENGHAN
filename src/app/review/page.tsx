import { getDueCards } from "@/lib/actions";
import { ReviewSession, type ReviewCard } from "@/components/ReviewSession";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const due = await getDueCards();
  const cards: ReviewCard[] = due.map((c) => ({
    vocabId: c.vocabId,
    korean: c.vocab.korean,
    romanization: c.vocab.romanization,
    meaningVn: c.vocab.meaningVn,
    meaningEn: c.vocab.meaningEn,
    pos: c.vocab.pos,
    audioPath: c.vocab.audioPath,
    examples: c.vocab.examples.map((e) => ({ korean: e.korean, meaningVn: e.meaningVn })),
  }));

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="font-display text-3xl font-extrabold">
          Ôn tập SRS <span className="inline-block animate-bounce-soft">🔄</span>
        </h2>
        <p className="mt-1 text-fg/60">Lặp lại ngắt quãng — nhớ lâu hơn, học vui hơn!</p>
      </div>
      <ReviewSession cards={cards} />
    </div>
  );
}
