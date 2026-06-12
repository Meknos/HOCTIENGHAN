import { UnitGrid } from "@/components/UnitGrid";

export default function VocabularyHome() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="font-display text-3xl font-extrabold">
          Từ vựng <span className="inline-block animate-bounce-soft">📝</span>
        </h2>
        <p className="mt-1 text-fg/60">Chọn bài để học từ vựng — học, flashcard, quiz!</p>
      </div>
      <UnitGrid base="/vocabulary" />
    </div>
  );
}
