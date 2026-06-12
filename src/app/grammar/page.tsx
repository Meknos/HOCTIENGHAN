import { UnitGrid } from "@/components/UnitGrid";

export default function GrammarHome() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="font-display text-3xl font-extrabold">
          Ngữ pháp <span className="inline-block animate-bounce-soft">📖</span>
        </h2>
        <p className="mt-1 text-fg/60">Chọn bài để xem điểm ngữ pháp + bài tập nhé!</p>
      </div>
      <UnitGrid base="/grammar" />
    </div>
  );
}
