"use client";

import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useTheme } from "./ThemeProvider";

function Decorations() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse-ring" />
      <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl animate-float-slow" />
      
      <div className="absolute top-[15%] left-[10%] text-3xl opacity-20 animate-float-slow" style={{ animationDelay: '0s' }}>🌸</div>
      <div className="absolute top-[30%] right-[12%] text-4xl opacity-15 animate-float-slow" style={{ animationDelay: '2s' }}>🎀</div>
      <div className="absolute bottom-[25%] left-[15%] text-2xl opacity-30 animate-sparkle-spin" style={{ animationDelay: '1s' }}>✨</div>
      <div className="absolute top-[10%] right-[25%] text-3xl opacity-20 animate-float-slow" style={{ animationDelay: '3s' }}>☁️</div>
      <div className="absolute bottom-[10%] right-[30%] text-2xl opacity-20 animate-sparkle-spin" style={{ animationDelay: '2.5s' }}>💖</div>
      <div className="absolute top-[60%] left-[5%] text-xl opacity-15 animate-float-slow" style={{ animationDelay: '1.5s' }}>🌸</div>
      <div className="absolute bottom-[40%] right-[5%] text-2xl opacity-15 animate-float-slow" style={{ animationDelay: '0.5s' }}>🍓</div>
    </div>
  );
}

/**
 * Thư viện sách ("/") hiển thị toàn màn hình, KHÔNG sidebar.
 * Khi đã vào sách (mọi route khác) mới hiện sidebar + topbar.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLibrary = pathname === "/";
  const { theme, toggle } = useTheme();

  if (isLibrary) {
    return (
      <div className="relative min-h-screen">
        <Decorations />

        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/60 bg-bg/80 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <span className="logo-badge animate-bounce-soft">한</span>
            <span className="font-display text-lg font-bold">서울대 한국어</span>
          </div>
          <button
            onClick={toggle}
            className="btn-icon"
            aria-label="Đổi giao diện"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
        <main className="animate-fade-in p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen">
      <Decorations />

      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 animate-fade-in p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
