"use client";

import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { resetAllSrs, exportData, type Stats } from "@/lib/actions";

export function SettingsClient({ stats }: { stats: Stats }) {
  const [busy, setBusy] = useState(false);

  const handleReset = async () => {
    if (!confirm("Xoá toàn bộ tiến độ ôn tập (SRS + streak)? Không thể hoàn tác.")) return;
    setBusy(true);
    await resetAllSrs();
    setBusy(false);
    location.reload();
  };

  const handleExport = async () => {
    const json = await exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `korean-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const cards = [
    { label: "Tổng từ vựng", value: stats.totalVocab },
    { label: "Từ đã học", value: stats.learned },
    { label: "Lượt ôn tổng", value: stats.totalReviews },
    { label: "Cần ôn hôm nay", value: stats.due },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-xs text-gray-500">{c.label}</p>
            <p className="mt-1 text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
        <h3 className="font-bold">Dữ liệu</h3>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white"
        >
          <Download size={16} /> Export backup (JSON)
        </button>
        <button
          onClick={handleReset}
          disabled={busy}
          className="flex items-center gap-2 rounded-lg bg-danger/10 px-4 py-2 text-sm font-semibold text-danger disabled:opacity-50"
        >
          <RotateCcw size={16} /> Reset toàn bộ tiến độ SRS
        </button>
      </div>
    </div>
  );
}
