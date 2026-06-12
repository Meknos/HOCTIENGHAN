"use client";

import { useState } from "react";
import { Check, X, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ExerciseData {
  id: string;
  type: string; // fill_blank | multiple_choice | reorder
  question: string;
  answer: string;
  options?: string | null; // JSON text
}

export function ExerciseBlock({ ex }: { ex: ExerciseData }) {
  const [value, setValue] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [order, setOrder] = useState<number[]>([]); // reorder: index các token đã chọn
  const [checked, setChecked] = useState(false);

  const options: string[] = ex.options ? JSON.parse(ex.options) : [];
  const norm = (s: string) => s.trim().replace(/\s+/g, "");

  const userAnswer =
    ex.type === "multiple_choice"
      ? picked ?? ""
      : ex.type === "reorder"
        ? order.map((i) => options[i]).join(" ")
        : value;
  const correct = norm(userAnswer) === norm(ex.answer);

  const reset = () => {
    setChecked(false);
    setValue("");
    setPicked(null);
    setOrder([]);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="mb-3 font-kr text-base">{ex.question}</p>

      {ex.type === "multiple_choice" && (
        <div className="grid grid-cols-2 gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              disabled={checked}
              onClick={() => setPicked(opt)}
              className={cn(
                "rounded-lg border px-3 py-2 text-left font-kr text-sm transition",
                picked === opt ? "border-secondary bg-secondary/10" : "border-border",
                checked && norm(opt) === norm(ex.answer) && "border-success bg-success/10",
                checked && picked === opt && !correct && "border-danger bg-danger/10"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {ex.type === "reorder" && (
        <div className="space-y-3">
          {/* Vùng câu đang ghép */}
          <div className="flex min-h-[44px] flex-wrap items-center gap-2 rounded-lg border border-dashed border-border bg-bg p-2">
            {order.length === 0 && (
              <span className="px-1 text-sm text-gray-400">Nhấn các từ bên dưới để ghép câu...</span>
            )}
            {order.map((idx, pos) => (
              <button
                key={pos}
                disabled={checked}
                onClick={() => setOrder((o) => o.filter((_, p) => p !== pos))}
                className="rounded-md bg-secondary/10 px-3 py-1.5 font-kr text-sm text-secondary"
              >
                {options[idx]}
              </button>
            ))}
          </div>
          {/* Token còn lại */}
          <div className="flex flex-wrap gap-2">
            {options.map((opt, idx) =>
              order.includes(idx) ? null : (
                <button
                  key={idx}
                  disabled={checked}
                  onClick={() => setOrder((o) => [...o, idx])}
                  className="rounded-md border border-border px-3 py-1.5 font-kr text-sm hover:border-secondary"
                >
                  {opt}
                </button>
              )
            )}
            {order.length > 0 && !checked && (
              <button
                onClick={() => setOrder([])}
                className="flex items-center gap-1 rounded-md px-2 py-1.5 text-xs text-gray-400 hover:text-fg"
              >
                <RotateCw size={13} /> Xóa
              </button>
            )}
          </div>
        </div>
      )}

      {ex.type !== "multiple_choice" && ex.type !== "reorder" && (
        <input
          value={value}
          disabled={checked}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && userAnswer && setChecked(true)}
          placeholder="Nhập đáp án..."
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 font-kr outline-none focus:border-secondary"
        />
      )}

      <div className="mt-3 flex items-center gap-3">
        {!checked ? (
          <button
            disabled={!userAnswer}
            onClick={() => setChecked(true)}
            className="rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            Kiểm tra
          </button>
        ) : (
          <button onClick={reset} className="rounded-lg bg-muted px-4 py-2 text-sm font-semibold">
            Làm lại
          </button>
        )}

        {checked &&
          (correct ? (
            <span className="flex items-center gap-1 text-sm font-semibold text-success">
              <Check size={16} /> Chính xác!
            </span>
          ) : (
            <span className="flex items-center gap-1 text-sm font-semibold text-danger">
              <X size={16} /> Đáp án: <span className="font-kr">{ex.answer}</span>
            </span>
          ))}
      </div>
    </div>
  );
}
