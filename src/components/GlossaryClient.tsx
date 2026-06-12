"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { AudioButton } from "./AudioButton";

export interface GlossaryItem {
  id: string;
  korean: string;
  romanization: string;
  meaningVn: string;
  meaningEn: string;
  pos: string;
  audioPath?: string | null;
  unitNumber: number;
}

export function GlossaryClient({ items }: { items: GlossaryItem[] }) {
  const [q, setQ] = useState("");
  const [pos, setPos] = useState("all");

  const posList = useMemo(
    () => ["all", ...Array.from(new Set(items.map((i) => i.pos)))],
    [items]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return items.filter((i) => {
      const matchPos = pos === "all" || i.pos === pos;
      const matchQ =
        !s ||
        i.korean.includes(s) ||
        i.romanization.toLowerCase().includes(s) ||
        i.meaningVn.toLowerCase().includes(s) ||
        i.meaningEn.toLowerCase().includes(s);
      return matchPos && matchQ;
    });
  }, [items, q, pos]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
        <Search size={18} className="text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Tìm từ (tiếng Hàn, phiên âm, nghĩa)..."
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {posList.map((p) => (
          <button
            key={p}
            onClick={() => setPos(p)}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              pos === p ? "bg-secondary text-white" : "bg-muted text-fg/70"
            }`}
          >
            {p === "all" ? "Tất cả" : p}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500">{filtered.length} từ</p>

      <div className="divide-y divide-border rounded-xl border border-border bg-card">
        {filtered.map((v) => (
          <div key={v.id} className="flex items-center gap-3 p-3">
            <AudioButton src={v.audioPath} text={v.korean} size={16} />
            <div className="min-w-0 flex-1">
              <span className="font-kr text-base font-semibold">{v.korean}</span>{" "}
              <span className="text-xs text-gray-400">{v.romanization}</span>
              <p className="text-sm text-gray-500">{v.meaningVn}</p>
            </div>
            <Link
              href={`/vocabulary/${v.unitNumber}`}
              className="shrink-0 rounded-md bg-muted px-2 py-1 text-xs text-gray-500 hover:text-primary"
            >
              Bài {v.unitNumber}
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="p-8 text-center text-gray-500">Không tìm thấy từ nào.</p>
        )}
      </div>
    </div>
  );
}
