"use client";

import { useState, useMemo } from "react";
import { Check, ChevronLeft, ChevronRight, List, Layers, ListChecks } from "lucide-react";
import { AudioButton } from "./AudioButton";
import { FlashCard } from "./FlashCard";
import { markVocabLearned } from "@/lib/actions";
import { cn } from "@/lib/utils";

export interface VocabItem {
  id: string;
  korean: string;
  romanization: string;
  meaningVn: string;
  meaningEn: string;
  pos: string;
  audioPath?: string | null;
  examples: { korean: string; meaningVn: string }[];
  learned: boolean;
}

type Mode = "study" | "flashcard" | "quiz";

export function VocabStudy({ vocab }: { vocab: VocabItem[] }) {
  const [mode, setMode] = useState<Mode>("study");
  const [learned, setLearned] = useState<Set<string>>(
    new Set(vocab.filter((v) => v.learned).map((v) => v.id))
  );

  const mark = async (id: string) => {
    setLearned((s) => new Set(s).add(id));
    await markVocabLearned(id);
  };

  const tabs: { id: Mode; label: string; icon: typeof List }[] = [
    { id: "study", label: "Học", icon: List },
    { id: "flashcard", label: "Flashcard", icon: Layers },
    { id: "quiz", label: "Quiz", icon: ListChecks },
  ];

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition",
              mode === t.id ? "bg-primary text-white" : "bg-muted text-fg/70"
            )}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
        <span className="ml-auto self-center text-sm text-gray-500">
          {learned.size}/{vocab.length} đã học
        </span>
      </div>

      {mode === "study" && <StudyList vocab={vocab} learned={learned} onMark={mark} />}
      {mode === "flashcard" && <FlashcardMode vocab={vocab} learned={learned} onMark={mark} />}
      {mode === "quiz" && <QuizMode vocab={vocab} />}
    </div>
  );
}

/* ------------------------------- Study ------------------------------- */
function StudyList({
  vocab,
  learned,
  onMark,
}: {
  vocab: VocabItem[];
  learned: Set<string>;
  onMark: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {vocab.map((v) => (
        <div key={v.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <AudioButton src={v.audioPath} text={v.korean} />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-kr text-lg font-bold">{v.korean}</span>
              <span className="text-xs text-gray-400">{v.romanization}</span>
            </div>
            <p className="text-sm text-gray-500">
              {v.meaningVn} · <span className="text-gray-400">{v.meaningEn}</span>
            </p>
          </div>
          <button
            onClick={() => onMark(v.id)}
            disabled={learned.has(v.id)}
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold",
              learned.has(v.id) ? "bg-success/10 text-success" : "bg-muted hover:bg-primary hover:text-white"
            )}
          >
            <Check size={14} /> {learned.has(v.id) ? "Đã học" : "Đã biết"}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- Flashcard ----------------------------- */
function FlashcardMode({
  vocab,
  learned,
  onMark,
}: {
  vocab: VocabItem[];
  learned: Set<string>;
  onMark: (id: string) => void;
}) {
  const [i, setI] = useState(0);
  const v = vocab[i];
  if (!v) return null;

  const go = (d: number) => setI((p) => (p + d + vocab.length) % vocab.length);

  return (
    <div className="space-y-4">
      <FlashCard data={v} resetKey={v.id} />
      <p className="text-center text-sm text-gray-500">
        {i + 1} / {vocab.length}
      </p>
      <div className="mx-auto flex max-w-md items-center gap-3">
        <button onClick={() => go(-1)} className="rounded-lg bg-muted p-3">
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => {
            onMark(v.id);
            go(1);
          }}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-3 text-sm font-semibold",
            learned.has(v.id) ? "bg-success/10 text-success" : "bg-primary text-white"
          )}
        >
          <Check size={16} /> {learned.has(v.id) ? "Đã học · Tiếp" : "Đã biết · Tiếp"}
        </button>
        <button onClick={() => go(1)} className="rounded-lg bg-muted p-3">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------- Quiz ------------------------------- */
function QuizMode({ vocab }: { vocab: VocabItem[] }) {
  const questions = useMemo(() => buildQuiz(vocab), [vocab]);
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length < 4)
    return <p className="text-gray-500">Cần ít nhất 4 từ để tạo quiz.</p>;

  const q = questions[i];

  if (done)
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-lg font-bold">Hoàn thành!</p>
        <p className="mt-2 text-3xl font-bold text-primary">
          {score}/{questions.length}
        </p>
        <button
          onClick={() => {
            setI(0);
            setScore(0);
            setPicked(null);
            setDone(false);
          }}
          className="mt-4 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white"
        >
          Làm lại
        </button>
      </div>
    );

  const next = () => {
    if (i + 1 >= questions.length) setDone(true);
    else {
      setI(i + 1);
      setPicked(null);
    }
  };

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-card p-6">
      <p className="text-sm text-gray-500">
        Câu {i + 1}/{questions.length} · Điểm: {score}
      </p>
      <p className="font-kr text-2xl font-bold">{q.korean}</p>
      <p className="text-sm text-gray-500">Từ này nghĩa là gì?</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {q.options.map((opt) => {
          const isCorrect = opt === q.answer;
          const show = picked !== null;
          return (
            <button
              key={opt}
              disabled={show}
              onClick={() => {
                setPicked(opt);
                if (opt === q.answer) setScore((s) => s + 1);
              }}
              className={cn(
                "rounded-lg border px-4 py-3 text-left text-sm transition",
                !show && "border-border hover:border-secondary",
                show && isCorrect && "border-success bg-success/10",
                show && picked === opt && !isCorrect && "border-danger bg-danger/10",
                show && !isCorrect && picked !== opt && "border-border opacity-60"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <button onClick={next} className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white">
          {i + 1 >= questions.length ? "Xem kết quả" : "Câu tiếp →"}
        </button>
      )}
    </div>
  );
}

function buildQuiz(vocab: VocabItem[]) {
  const meanings = vocab.map((v) => v.meaningVn);
  return vocab.map((v) => {
    const wrong = shuffle(meanings.filter((m) => m !== v.meaningVn)).slice(0, 3);
    return {
      korean: v.korean,
      answer: v.meaningVn,
      options: shuffle([v.meaningVn, ...wrong]),
    };
  });
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
