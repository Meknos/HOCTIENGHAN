"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { playAudio, speakKorean } from "@/lib/audio";
import { cn } from "@/lib/utils";

interface Props {
  src?: string | null;
  text: string; // text Hàn để TTS fallback
  size?: number;
  className?: string;
}

/** Phát MP3 nếu có `src`, không thì dùng Web Speech TTS tiếng Hàn. */
export function AudioButton({ src, text, size = 18, className }: Props) {
  const [playing, setPlaying] = useState(false);

  const handle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(true);
    // Thử file MP3 trước; nếu không có/không phát được → TTS tiếng Hàn.
    const played = src ? await playAudio(src) : false;
    if (!played) speakKorean(text);
    setTimeout(() => setPlaying(false), 600);
  };

  return (
    <button
      onClick={handle}
      aria-label="Phát âm"
      className={cn(
        "grid place-items-center rounded-2xl bg-secondary/10 p-2.5 text-secondary transition-all duration-200 hover:bg-secondary/20 hover:scale-110 active:scale-95",
        playing && "animate-pulse-ring bg-secondary/25",
        className
      )}
    >
      <Volume2 size={size} />
    </button>
  );
}
