"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Loader2, Trash2 } from "lucide-react";
import { Markdown } from "./Markdown";
import { chatWithAI, type ChatMsg } from "@/lib/ai";
import { UNITS, UNITS_BY_SLUG } from "@/lib/units";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "chat-history";

export function ChatClient() {
  const searchParams = useSearchParams();
  const urlUnit = Number(searchParams.get("unit"));
  const bookSlug = searchParams.get("book") ?? "snu-1a";
  const bookUnits = UNITS_BY_SLUG[bookSlug] ?? UNITS;
  const [unit, setUnit] = useState(
    urlUnit >= 1 ? urlUnit : 1
  );
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const meta = bookUnits.find((u) => u.number === unit) ?? bookUnits[0];

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next: ChatMsg[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const learned = bookUnits.filter((u) => u.number <= unit).map((u) => u.titleKr);
    const reply = await chatWithAI(next, unit, meta.titleKr, learned);
    setMessages([...next, { role: "model", text: reply }]);
    setLoading(false);
  };

  const clear = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col">
      <div className="mb-3 flex items-center gap-3">
        <label className="text-sm text-gray-500">Đang học bài:</label>
        <select
          value={unit}
          onChange={(e) => setUnit(Number(e.target.value))}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
        >
          {bookUnits.map((u) => (
            <option key={u.number} value={u.number}>
              Bài {u.number} — {u.titleKr}
            </option>
          ))}
        </select>
        <button onClick={clear} className="ml-auto flex items-center gap-1 text-sm text-gray-400 hover:text-danger">
          <Trash2 size={15} /> Xoá
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-2xl border border-border bg-card p-4">
        {messages.length === 0 && (
          <div className="grid h-full place-items-center text-center text-gray-400">
            <div>
              <p className="font-kr text-3xl">하늘 선생님 🇰🇷</p>
              <p className="mt-2 text-sm">Chào bạn! Hãy nhắn gì đó bằng tiếng Hàn nhé.</p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5",
                m.role === "user"
                  ? "bg-primary text-white"
                  : "border border-border bg-bg"
              )}
            >
              {m.role === "user" ? (
                <p className="whitespace-pre-wrap text-sm">{m.text}</p>
              ) : (
                <Markdown text={m.text} />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 size={15} className="animate-spin" /> 하늘 선생님 đang soạn...
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Nhập tin nhắn (tiếng Hàn hoặc Việt)..."
          className="flex-1 rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="grid place-items-center rounded-xl bg-primary p-3 text-white disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
