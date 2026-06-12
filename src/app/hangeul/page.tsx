import { HangeulGrid } from "@/components/HangeulGrid";
import hangeul from "../../../data/hangeul.json";

export default function HangeulPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="font-display text-3xl font-extrabold">
          한글 배우기 <span className="inline-block animate-bounce-soft">ㄱ</span>
        </h2>
        <p className="mt-1 text-fg/60">
          Học bảng chữ cái — nhấn vào ký tự để nghe phát âm nhé!
        </p>
      </div>
      <HangeulGrid
        consonants={hangeul.consonants}
        vowels={hangeul.vowels}
        batchim={hangeul.batchim}
      />
    </div>
  );
}
