"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { AudioButton } from "./AudioButton";
import { ExerciseBlock, type ExerciseData } from "./ExerciseBlock";
import { Markdown } from "./Markdown";
import { explainGrammar } from "@/lib/ai";

export interface GrammarData {
  id: string;
  pattern: string;
  titleVn: string;
  explanationVn: string;
  rule: string;
  examples: { id: string; korean: string; meaningVn: string; audioPath?: string | null }[];
  exercises: ExerciseData[];
}

export function GrammarCard({ g }: { g: GrammarData }) {
  const [aiText, setAiText] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    const cacheKey = `grammar-ai:${g.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      setAiText(cached);
      setLoading(false);
      return;
    }
    const text = await explainGrammar(g.pattern, `Giải thích chi tiết "${g.pattern}"`);
    localStorage.setItem(cacheKey, text);
    setAiText(text);
    setLoading(false);
  };

  return (
    <section className="card-cute space-y-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-kr text-2xl font-bold text-primary">{g.pattern}</h2>
          <p className="text-sm text-gray-500">{g.titleVn}</p>
        </div>
        <button
          onClick={askAI}
          className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-secondary/10 px-3 py-1.5 text-sm font-bold text-secondary transition-all hover:bg-secondary/20 hover:scale-105 active:scale-95"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          Hỏi AI
        </button>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-muted to-muted/50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Quy tắc</p>
        <p className="mt-1 font-kr">{g.rule}</p>
      </div>

      <p className="text-sm leading-relaxed">{g.explanationVn}</p>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ví dụ</p>
        {g.examples.map((ex) => (
          <div key={ex.id} className="flex items-center justify-between gap-2 rounded-2xl border border-border/60 bg-card/50 px-3 py-2 transition-colors hover:border-secondary/30">
            <div>
              <p className="font-kr">{ex.korean}</p>
              <p className="text-sm text-gray-500">{ex.meaningVn}</p>
            </div>
            <AudioButton src={ex.audioPath} text={ex.korean} />
          </div>
        ))}
      </div>

      {aiText && (
        <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4">
          <Markdown text={aiText} />
        </div>
      )}

      {g.exercises.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bài tập</p>
          {g.exercises.map((ex) => (
            <ExerciseBlock key={ex.id} ex={ex} />
          ))}
        </div>
      )}
    </section>
  );
}
