"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { AudioButton } from "./AudioButton";

export interface FlashCardData {
  korean: string;
  romanization: string;
  meaningVn: string;
  meaningEn?: string;
  pos?: string;
  audioPath?: string | null;
  examples?: { korean: string; meaningVn: string }[];
}

interface Props {
  data: FlashCardData;
  /** Reset về mặt trước khi data đổi (dùng trong session lật nhiều thẻ). */
  resetKey?: string;
  onFlip?: (flipped: boolean) => void;
}

export function FlashCard({ data, resetKey, onFlip }: Props) {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => setFlipped(false), [resetKey]);

  const toggle = () => {
    setFlipped((f) => {
      onFlip?.(!f);
      return !f;
    });
  };

  return (
    <div className="perspective mx-auto w-full max-w-md">
      <button
        onClick={toggle}
        className="preserve-3d relative h-72 w-full cursor-pointer rounded-3xl transition-transform duration-500 ease-out"
        style={{ transform: flipped ? "rotateY(180deg)" : "" }}
        aria-label="Lật thẻ"
      >
        {/* Mặt trước */}
        <div className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 shadow-card">
          <span className="font-kr text-5xl font-bold text-fg">{data.korean}</span>
          <span className="rounded-full bg-muted px-3 py-1 text-sm text-fg/60">{data.romanization}</span>
          <div onClick={(e) => e.stopPropagation()}>
            <AudioButton src={data.audioPath} text={data.korean} size={22} />
          </div>
          <span className="absolute bottom-4 flex items-center gap-1 text-xs text-fg/40">
            <Sparkles size={12} className="text-accent" /> Nhấn để lật
          </span>
        </div>

        {/* Mặt sau */}
        <div
          className="backface-hidden rotate-y-180 absolute inset-0 flex flex-col items-center justify-center gap-2 overflow-y-auto rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/5 p-6 shadow-soft"
        >
          <span className="font-display text-2xl font-extrabold text-primary">{data.meaningVn}</span>
          {data.meaningEn && (
            <span className="text-sm text-fg/50">{data.meaningEn}</span>
          )}
          {data.pos && (
            <span className="rounded-full bg-secondary/15 px-3 py-0.5 text-xs font-bold text-secondary">
              {data.pos}
            </span>
          )}
          {data.examples?.[0] && (
            <div className="mt-3 rounded-2xl bg-card/80 px-4 py-2 text-center">
              <p className="font-kr text-base">{data.examples[0].korean}</p>
              <p className="text-sm text-fg/50">{data.examples[0].meaningVn}</p>
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
