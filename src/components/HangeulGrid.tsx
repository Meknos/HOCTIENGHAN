"use client";

import { useState, useMemo, useEffect } from "react";
import { speakKorean } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface Letter {
  char: string;
  rom: string;
  name?: string;
  example: string;
  exampleVn: string;
}
interface Batchim {
  group: string;
  sound: string;
  members: string;
  example: string;
  exampleVn: string;
}

export function HangeulGrid({
  consonants,
  vowels,
  batchim,
}: {
  consonants: Letter[];
  vowels: Letter[];
  batchim: Batchim[];
}) {
  const [tab, setTab] = useState<"consonants" | "vowels" | "batchim" | "quiz">("consonants");
  const [sel, setSel] = useState<Letter | null>(null);

  const tabs = [
    { id: "consonants" as const, label: "자음 — Phụ âm" },
    { id: "vowels" as const, label: "모음 — Nguyên âm" },
    { id: "batchim" as const, label: "받침 — Âm cuối" },
    { id: "quiz" as const, label: "🎧 Quiz nghe" },
  ];

  const letters = tab === "consonants" ? consonants : vowels;
  const quizPool = [...consonants, ...vowels];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setSel(null);
            }}
            className={cn(
              "rounded-2xl px-4 py-2 text-sm font-bold transition-all duration-200",
              tab === t.id
                ? "bg-gradient-to-r from-primary to-primary/85 text-white shadow-soft"
                : "bg-muted text-fg/70 hover:scale-105 hover:bg-muted/80"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "quiz" ? (
        <HangeulQuiz pool={quizPool} />
      ) : tab === "batchim" ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {batchim.map((b) => (
            <button
              key={b.group}
              onClick={() => speakKorean(b.example)}
              className="card-cute flex items-center gap-4 p-4 text-left"
            >
              <span className="font-kr text-3xl font-bold text-primary">{b.group}</span>
              <div>
                <p className="text-sm">
                  Phát âm <b>[{b.sound}]</b> · {b.members}
                </p>
                <p className="font-kr text-sm text-gray-500">
                  {b.example} — {b.exampleVn}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 lg:grid-cols-7">
            {letters.map((l) => (
              <button
                key={l.char}
                onClick={() => {
                  setSel(l);
                  speakKorean(l.char);
                }}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-soft",
                  sel?.char === l.char ? "border-primary ring-2 ring-primary/30 scale-105" : "border-border/70"
                )}
              >
                <span className="font-kr text-3xl font-bold">{l.char}</span>
                <span className="text-xs text-gray-400">{l.rom}</span>
              </button>
            ))}
          </div>

          {sel && (
            <div className="animate-pop rounded-3xl border-2 border-primary/25 bg-gradient-to-br from-primary/10 to-secondary/5 p-5 text-center shadow-soft">
              <p className="font-kr text-5xl font-bold">{sel.char}</p>
              <p className="mt-1 text-gray-500">
                [{sel.rom}] {sel.name && `· ${sel.name}`}
              </p>
              <button
                onClick={() => speakKorean(sel.example)}
                className="mt-3 font-kr text-lg hover:text-primary"
              >
                {sel.example} <span className="text-sm text-gray-500">— {sel.exampleVn}</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ---------------------- Quiz nghe → chọn ký tự ---------------------- */
function HangeulQuiz({ pool }: { pool: Letter[] }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const question = useMemo(() => {
    const answer = pool[Math.floor(Math.random() * pool.length)];
    const distractors = shuffle(pool.filter((l) => l.char !== answer.char))
      .slice(0, 3);
    return { answer, options: shuffle([answer, ...distractors]) };
    // round là dependency để tạo câu mới mỗi lượt
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  // Tự phát âm khi sang câu mới
  useEffect(() => {
    speakKorean(question.answer.char);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  const choose = (l: Letter) => {
    if (picked) return;
    setPicked(l.char);
    setTotal((t) => t + 1);
    if (l.char === question.answer.char) setScore((s) => s + 1);
  };

  return (
    <div className="mx-auto max-w-md space-y-5 text-center">
      <p className="text-sm text-gray-500">
        Điểm: {score}/{total}
      </p>
      <button
        onClick={() => speakKorean(question.answer.char)}
        className="mx-auto flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 font-semibold text-white"
      >
        🔊 Nghe lại âm
      </button>
      <p className="text-sm text-gray-500">Âm vừa nghe là ký tự nào?</p>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((l) => {
          const isAnswer = l.char === question.answer.char;
          return (
            <button
              key={l.char}
              onClick={() => choose(l)}
              disabled={!!picked}
              className={cn(
                "flex aspect-[2/1] items-center justify-center rounded-xl border font-kr text-3xl font-bold transition",
                !picked && "border-border hover:border-secondary",
                picked && isAnswer && "border-success bg-success/10 text-success",
                picked && picked === l.char && !isAnswer && "border-danger bg-danger/10 text-danger",
                picked && !isAnswer && picked !== l.char && "border-border opacity-50"
              )}
            >
              {l.char}
            </button>
          );
        })}
      </div>

      {picked && (
        <button
          onClick={() => {
            setPicked(null);
            setRound((r) => r + 1);
          }}
          className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white"
        >
          Câu tiếp →
        </button>
      )}
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
