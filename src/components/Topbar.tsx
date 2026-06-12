"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { StreakBadge } from "./StreakBadge";

const TITLES: Record<string, string> = {
  "/": "Thư viện sách",
  "/dashboard": "Tổng quan",
  "/hangeul": "한글 — Bảng chữ cái",
  "/vocabulary": "Từ vựng",
  "/grammar": "Ngữ pháp",
  "/review": "Ôn tập",
  "/chat": "AI Gia sư 하늘 선생님",
  "/shadowing": "Shadowing",
  "/glossary": "Tra từ",
  "/import": "Nhập liệu",
  "/settings": "Cài đặt",
};

export function Topbar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const key = Object.keys(TITLES)
    .filter((k) => (k === "/" ? pathname === "/" : pathname.startsWith(k)))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b-2 border-border/50 bg-bg/80 px-4 pl-14 backdrop-blur-md sm:px-6 lg:pl-6">
      <h1 className="flex items-center gap-2 truncate font-display text-xl font-extrabold text-primary">
        <span className="animate-sparkle-spin">✨</span>
        {TITLES[key] ?? ""}
        <span className="text-sm opacity-50 animate-bounce-soft">🎀</span>
      </h1>
      <div className="flex items-center gap-2">
        <StreakBadge />
        <button
          onClick={toggle}
          className="btn-icon"
          aria-label="Đổi giao diện"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
