"use client";

import { useState } from "react";
import { Loader2, PenLine } from "lucide-react";
import { Markdown } from "./Markdown";
import { checkWriting } from "@/lib/ai";

export function WritingChecker({ patterns }: { patterns: string[] }) {
  const [pattern, setPattern] = useState(patterns[0] ?? "");
  const [sentence, setSentence] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!sentence.trim()) return;
    setLoading(true);
    setResult("");
    const res = await checkWriting(sentence, pattern);
    setResult(res);
    setLoading(false);
  };

  return (
    <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <PenLine size={18} className="text-secondary" />
        <h3 className="font-bold">Luyện viết — AI chấm câu</h3>
      </div>
      <select
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-kr text-sm"
      >
        {patterns.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <textarea
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        placeholder="Viết một câu tiếng Hàn dùng ngữ pháp trên..."
        rows={2}
        className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-kr outline-none focus:border-secondary"
      />
      <button
        onClick={check}
        disabled={loading || !sentence.trim()}
        className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
      >
        {loading && <Loader2 size={15} className="animate-spin" />} Kiểm tra
      </button>
      {result && (
        <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-4">
          <Markdown text={result} />
        </div>
      )}
    </section>
  );
}
