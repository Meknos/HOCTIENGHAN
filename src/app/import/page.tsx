"use client";

import { useState } from "react";
import { Upload, Sparkles, Loader2, Save, FileJson, X, FileText, Image as ImageIcon } from "lucide-react";
import {
  extractFromImages,
  extractFromPdf,
  importUnit,
  type ImageInput,
} from "@/lib/import-actions";
import { UNITS } from "@/lib/units";

const TEMPLATE = `{
  "unit": 5,
  "titleKr": "주말에 친구를 만났어요",
  "titleVn": "Gặp bạn cuối tuần",
  "topic": "Số đếm, Ngày trong tuần",
  "vocabulary": [
    {
      "korean": "주말", "romanization": "jumal", "meaningVn": "cuối tuần",
      "meaningEn": "weekend", "pos": "noun",
      "examples": [{ "korean": "주말에 친구를 만나요.", "meaningVn": "Cuối tuần tôi gặp bạn." }]
    }
  ],
  "grammar": [
    {
      "orderInUnit": 1, "pattern": "V-았/었-", "titleVn": "Thì quá khứ",
      "explanationVn": "Diễn tả hành động đã xảy ra.",
      "rule": "ㅏ/ㅗ → 았 · khác → 었 · 하다 → 했",
      "examples": [{ "korean": "친구를 만났어요.", "meaningVn": "Tôi đã gặp bạn." }],
      "exercises": [{ "type": "fill_blank", "question": "어제 책을 읽___어요.", "answer": "었" }]
    }
  ]
}`;

interface Pic extends ImageInput {
  name: string;
  preview: string;
}

/** "54-56" hoặc "54" → mảng index 0-based (trang in 54 = index 53). */
function parseRange(input: string, total: number): number[] {
  const m = input.trim().match(/^(\d+)\s*(?:-\s*(\d+))?$/);
  if (!m) return [];
  const a = Number(m[1]);
  const b = m[2] ? Number(m[2]) : a;
  const out: number[] = [];
  for (let p = Math.min(a, b); p <= Math.max(a, b); p++) {
    if (p >= 1 && p <= total) out.push(p - 1);
  }
  return out;
}

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin);
}

export default function ImportPage() {
  const [mode, setMode] = useState<"pdf" | "image">("pdf");
  const [unit, setUnit] = useState(5);

  // PDF mode
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [range, setRange] = useState("");

  // Image mode
  const [pics, setPics] = useState<Pic[]>([]);

  const [json, setJson] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const onImages = async (files: FileList | null) => {
    if (!files) return;
    const arr: Pic[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      const dataUrl: string = await new Promise((res) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.readAsDataURL(f);
      });
      arr.push({ name: f.name, preview: dataUrl, mimeType: f.type, data: dataUrl.split(",")[1] });
    }
    setPics((p) => [...p, ...arr]);
  };

  const extractPdf = async () => {
    if (!pdfFile) return setMsg({ ok: false, text: "Chưa chọn file PDF." });
    setExtracting(true);
    setMsg(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const src = await PDFDocument.load(await pdfFile.arrayBuffer());
      const total = src.getPageCount();
      const idx = parseRange(range, total);
      if (idx.length === 0) {
        setExtracting(false);
        return setMsg({ ok: false, text: `Khoảng trang không hợp lệ (PDF có ${total} trang). VD: 54-56` });
      }
      if (idx.length > 8) {
        setExtracting(false);
        return setMsg({ ok: false, text: "Chọn tối đa 8 trang mỗi lần để tránh quá tải." });
      }
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, idx);
      pages.forEach((p) => out.addPage(p));
      const b64 = bytesToBase64(await out.save());
      const res = await extractFromPdf(b64, unit);
      finishExtract(res);
    } catch (e) {
      setExtracting(false);
      setMsg({ ok: false, text: "Lỗi đọc PDF: " + (e instanceof Error ? e.message : "") });
    }
  };

  const extractImages = async () => {
    setExtracting(true);
    setMsg(null);
    const res = await extractFromImages(
      pics.map((p) => ({ data: p.data, mimeType: p.mimeType })),
      unit
    );
    finishExtract(res);
  };

  const finishExtract = (res: { ok: boolean; text: string; error?: string }) => {
    setExtracting(false);
    if (res.ok) {
      setJson(res.text);
      setMsg({ ok: true, text: "Đã trích xuất. Kiểm tra/sửa JSON rồi bấm Lưu." });
    } else {
      setMsg({ ok: false, text: res.error || "Lỗi trích xuất." });
    }
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const res = await importUnit(json);
    setSaving(false);
    setMsg({ ok: res.ok, text: res.message });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Nhập liệu từ sách</h2>
        <p className="text-fg/60">
          Tải PDF (hoặc ảnh) trang sách → AI trích xuất → kiểm tra → lưu vào sách.
        </p>
      </div>

      {/* Bước 1 */}
      <section className="card-cute space-y-4 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-sm font-bold text-white">1</span>
          <label className="text-sm font-semibold">Chọn bài & nguồn</label>
        </div>

        <select
          value={unit}
          onChange={(e) => setUnit(Number(e.target.value))}
          className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
        >
          {UNITS.map((u) => (
            <option key={u.number} value={u.number}>
              Bài {u.number} — {u.titleKr}
            </option>
          ))}
        </select>

        {/* Toggle nguồn */}
        <div className="flex gap-2">
          {([
            { id: "pdf", label: "Từ PDF", icon: FileText },
            { id: "image", label: "Từ ảnh", icon: ImageIcon },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                mode === t.id ? "bg-primary text-white" : "bg-muted text-fg/70"
              }`}
            >
              <t.icon size={15} /> {t.label}
            </button>
          ))}
        </div>

        {mode === "pdf" ? (
          <div className="space-y-3">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-6 text-center transition hover:border-primary">
              <Upload size={24} className="text-primary" />
              <span className="text-sm font-medium">
                {pdfFile ? `📄 ${pdfFile.name}` : "Bấm để chọn file PDF"}
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm text-fg/70">Trang:</label>
              <input
                value={range}
                onChange={(e) => setRange(e.target.value)}
                placeholder="VD: 54-56 (số trang in trên sách)"
                className="flex-1 rounded-xl border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={extractPdf}
              disabled={extracting || !pdfFile}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {extracting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Trích xuất từ PDF
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-6 text-center transition hover:border-primary">
              <Upload size={24} className="text-primary" />
              <span className="text-sm font-medium">Bấm để chọn ảnh (JPG/PNG) — nhiều ảnh được</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onImages(e.target.files)} />
            </label>
            {pics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {pics.map((p, i) => (
                  <div key={i} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.preview} alt={p.name} className="h-20 w-16 rounded-lg border border-border object-cover" />
                    <button
                      onClick={() => setPics((arr) => arr.filter((_, j) => j !== i))}
                      className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-danger text-white"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={extractImages}
              disabled={extracting || pics.length === 0}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {extracting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Trích xuất từ {pics.length} ảnh
            </button>
          </div>
        )}
      </section>

      {/* Bước 2 */}
      <section className="card-cute space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-secondary text-sm font-bold text-white">2</span>
            <label className="text-sm font-semibold">Kiểm tra & sửa dữ liệu (JSON)</label>
          </div>
          <button onClick={() => setJson(TEMPLATE)} className="flex items-center gap-1 text-xs text-secondary hover:underline">
            <FileJson size={13} /> Chèn mẫu
          </button>
        </div>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder="Dán JSON ở đây, hoặc trích xuất ở Bước 1. Cũng có thể tự gõ tay."
          rows={14}
          spellCheck={false}
          className="w-full rounded-xl border border-border bg-bg px-3 py-2 font-mono text-xs outline-none focus:border-secondary"
        />
      </section>

      {/* Bước 3 */}
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || !json.trim()}
          className="flex items-center gap-2 rounded-xl bg-success px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Lưu vào sách
        </button>
        {msg && (
          <span className={`text-sm font-medium ${msg.ok ? "text-success" : "text-danger"}`}>{msg.text}</span>
        )}
      </div>
    </div>
  );
}
