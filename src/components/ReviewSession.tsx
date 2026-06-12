"use client";

import { useState } from "react";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import { FlashCard } from "./FlashCard";
import { SrsRating } from "./SrsRating";
import { gradeCard } from "@/lib/actions";
import { RATING_TO_GRADE, type Rating } from "@/lib/srs";

export interface ReviewCard {
  vocabId: string;
  korean: string;
  romanization: string;
  meaningVn: string;
  meaningEn: string;
  pos: string;
  audioPath?: string | null;
  examples: { korean: string; meaningVn: string }[];
}

export function ReviewSession({ cards }: { cards: ReviewCard[] }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [stats, setStats] = useState({ hard: 0, ok: 0, easy: 0 });

  if (cards.length === 0)
    return (
      <Empty title="Tuyệt vời! 🎉" desc="Không còn thẻ nào cần ôn hôm nay." />
    );

  if (i >= cards.length)
    return (
      <Empty
        title="Hoàn thành phiên ôn! 🎉"
        desc={`Khó: ${stats.hard} · OK: ${stats.ok} · Dễ: ${stats.easy}`}
      />
    );

  const card = cards[i];

  const rate = async (r: Rating) => {
    setStats((s) => ({ ...s, [r]: s[r] + 1 }));
    await gradeCard(card.vocabId, RATING_TO_GRADE[r]);
    setFlipped(false);
    setI((x) => x + 1);
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(i / cards.length) * 100}%` }}
        />
      </div>
      <p className="text-center text-sm text-gray-500">
        {i + 1} / {cards.length}
      </p>

      <FlashCard data={card} resetKey={card.vocabId} onFlip={setFlipped} />

      {flipped ? (
        <SrsRating onRate={rate} />
      ) : (
        <p className="text-center text-sm text-gray-400">
          Lật thẻ rồi tự đánh giá độ nhớ
        </p>
      )}
    </div>
  );
}

function Empty({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center">
      <PartyPopper className="mx-auto text-accent" size={40} />
      <p className="mt-3 text-lg font-bold">{title}</p>
      <p className="mt-1 text-sm text-gray-500">{desc}</p>
      <Link href="/vocabulary" className="mt-5 inline-block rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white">
        Học từ mới
      </Link>
    </div>
  );
}
