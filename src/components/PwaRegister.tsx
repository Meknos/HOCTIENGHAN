"use client";

import { useEffect } from "react";

/** Đăng ký service worker. Bỏ qua khi dev để tránh xung đột HMR của Next. */
export function PwaRegister() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    )
      return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
