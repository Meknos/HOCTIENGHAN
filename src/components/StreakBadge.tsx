"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { getStreakCount } from "@/lib/actions";

export function StreakBadge() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    getStreakCount()
      .then(setDays)
      .catch(() => setDays(0));
  }, []);

  return (
    <span
      className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 px-3 py-1.5 text-sm font-bold text-accent shadow-sm"
      title="Số ngày ôn tập liên tiếp"
    >
      <Flame size={16} className="fill-accent animate-bounce-soft" />
      {days ?? "–"}
    </span>
  );
}
