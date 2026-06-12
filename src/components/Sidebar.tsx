"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Library,
  BookA,
  Languages,
  BookOpen,
  RotateCcw,
  MessageCircle,
  Mic,
  Search,
  Settings,
  Upload,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BOOKS } from "@/lib/books";

const STATIC_NAV = [
  { href: "/", label: "Thư viện sách", icon: Library, emoji: "📚" },
  { href: "/hangeul", label: "한글 — Bảng chữ cái", icon: BookA, emoji: "ㄱ" },
  { href: "/review", label: "Ôn tập (SRS)", icon: RotateCcw, emoji: "🔄" },
  { href: "/chat", label: "AI Gia sư", icon: MessageCircle, emoji: "💬" },
  { href: "/shadowing", label: "Shadowing", icon: Mic, emoji: "🎤" },
  { href: "/glossary", label: "Tra từ", icon: Search, emoji: "🔍" },
  { href: "/import", label: "Nhập liệu", icon: Upload, emoji: "📥" },
  { href: "/settings", label: "Cài đặt", icon: Settings, emoji: "⚙️" },
];

function useCurrentBook() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const slug = segments[0];
  return BOOKS.find((b) => b.slug === slug && b.available) ?? null;
}

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentBook = useCurrentBook();

  const bookNav = currentBook
    ? [
        { href: `/${currentBook.slug}`, label: "Tổng quan", icon: LayoutDashboard, emoji: "✨" },
        { href: `/${currentBook.slug}/vocabulary`, label: "Từ vựng", icon: Languages, emoji: "📝" },
        { href: `/${currentBook.slug}/grammar`, label: "Ngữ pháp", icon: BookOpen, emoji: "📖" },
      ]
    : [];

  const NAV = [...bookNav, ...STATIC_NAV];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-30 rounded-2xl bg-card p-2.5 shadow-card ring-1 ring-border/60 transition-transform hover:scale-105 active:scale-95 lg:hidden"
        aria-label="Mở menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/60 bg-card/95 backdrop-blur-md transition-transform duration-300 ease-out lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="relative flex items-center justify-between px-5 py-6">
          <div className="absolute -top-2 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2 rounded bg-primary/20 backdrop-blur-sm" />

          <Link href="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="logo-badge relative transition-transform group-hover:animate-wiggle">
              한
              <span className="absolute -top-2 -right-2 text-sm animate-bounce-soft">🎀</span>
            </span>
            <div className="leading-tight">
              <p className="font-display text-base font-extrabold text-primary">
                {currentBook ? currentBook.code : "한국어"}
              </p>
              <p className="text-xs font-medium text-fg/50">서울대 한국어 ✨</p>
            </div>
          </Link>
          <button onClick={() => setOpen(false)} className="btn-icon lg:hidden" aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
          {bookNav.length > 0 && (
            <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-fg/30">
              {currentBook?.nameKr}
            </p>
          )}
          {NAV.map(({ href, label, icon: Icon, emoji }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "nav-pill group",
                  active ? "nav-pill-active" : "nav-pill-inactive"
                )}
              >
                <span className="text-base leading-none transition-transform group-hover:scale-110">
                  {active ? <Icon size={18} /> : <span className="text-sm">{emoji}</span>}
                </span>
                {label}
              </Link>
            );
          })}
        </nav>

        <p className="px-5 pb-4 text-[11px] text-fg/40">
          🌸 Học cá nhân · $0/tháng
        </p>
      </aside>
    </>
  );
}
