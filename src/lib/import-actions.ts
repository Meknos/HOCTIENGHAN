"use server";

import { prisma } from "@/lib/prisma";
import { generate, hasGemini, VISION_MODELS } from "@/lib/gemini";
import { UNITS } from "@/lib/units";
import { CURRENT_BOOK } from "@/lib/books";

export interface ImageInput {
  data: string; // base64 (không gồm tiền tố data:)
  mimeType: string; // "image/jpeg" | "image/png"
}

const EXTRACT_PROMPT = (unit: number) => `Đây là (các) trang sách tiếng Hàn 서울대 한국어 1A, Bài ${unit}.
Hãy trích xuất TẤT CẢ từ vựng và điểm ngữ pháp có trên trang, trả về MỘT object JSON DUY NHẤT (chỉ JSON, không markdown, không giải thích).

Định dạng:
{
  "unit": ${unit},
  "titleKr": "tiêu đề bài bằng tiếng Hàn (nếu thấy)",
  "titleVn": "dịch nghĩa tiêu đề sang tiếng Việt",
  "topic": "chủ đề ngắn gọn tiếng Việt",
  "vocabulary": [
    {
      "korean": "학생",
      "romanization": "haksaeng",
      "meaningVn": "học sinh",
      "meaningEn": "student",
      "pos": "noun | verb | adjective | expression",
      "examples": [{ "korean": "저는 학생이에요.", "meaningVn": "Tôi là học sinh." }]
    }
  ],
  "grammar": [
    {
      "orderInUnit": 1,
      "pattern": "N은/는 N이에요/예요",
      "titleVn": "tên điểm ngữ pháp bằng tiếng Việt",
      "explanationVn": "giải thích ngắn gọn tiếng Việt",
      "rule": "quy tắc chia",
      "examples": [{ "korean": "...", "meaningVn": "..." }],
      "exercises": [{ "type": "fill_blank", "question": "...", "answer": "..." }]
    }
  ]
}

Nếu trang không có ngữ pháp thì để "grammar": []. Nếu không có từ vựng thì "vocabulary": [].

QUAN TRỌNG:
- Sách gốc chỉ in tiếng Hàn + tiếng Anh (KHÔNG có tiếng Việt). Bạn BẮT BUỘC tự DỊCH sang tiếng Việt cho trường "meaningVn" — tuyệt đối không để trống.
- "romanization" theo Revised Romanization tiêu chuẩn.
- Chỉ lấy mục từ thật sự là từ vựng/ngữ pháp; bỏ qua số trang, tiêu đề trang trí, hướng dẫn.`;

function clean(text: string) {
  return text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
}

type ExtractResult = { ok: boolean; text: string; error?: string };

async function runExtraction(
  parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }>
): Promise<ExtractResult> {
  try {
    const raw = await generate(VISION_MODELS, {
      contents: [{ role: "user", parts }],
    });
    return { ok: true, text: clean(raw) };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      text: "",
      error: /403|denied/.test(msg)
        ? "API key bị từ chối quyền (403). Dùng key Google khác."
        : /429|quota/.test(msg)
          ? "Hết quota Gemini. Thử lại sau ít phút hoặc đổi key."
          : "Lỗi gọi Gemini Vision: " + msg.slice(0, 120),
    };
  }
}

/** Trích xuất từ (các) ảnh trang sách. */
export async function extractFromImages(
  images: ImageInput[],
  unit: number
): Promise<ExtractResult> {
  if (!hasGemini)
    return { ok: false, text: "", error: "Chưa cấu hình GEMINI_API_KEY trong .env." };
  if (images.length === 0)
    return { ok: false, text: "", error: "Chưa chọn ảnh nào." };

  return runExtraction([
    ...images.map((im) => ({
      inlineData: { mimeType: im.mimeType, data: im.data },
    })),
    { text: EXTRACT_PROMPT(unit) },
  ]);
}

/** Trích xuất trực tiếp từ file PDF (đã cắt sẵn vài trang ở client). */
export async function extractFromPdf(
  pdfBase64: string,
  unit: number
): Promise<ExtractResult> {
  if (!hasGemini)
    return { ok: false, text: "", error: "Chưa cấu hình GEMINI_API_KEY trong .env." };
  if (!pdfBase64)
    return { ok: false, text: "", error: "Chưa có dữ liệu PDF." };

  return runExtraction([
    { inlineData: { mimeType: "application/pdf", data: pdfBase64 } },
    { text: EXTRACT_PROMPT(unit) },
  ]);
}

interface UnitJson {
  unit: number;
  titleKr?: string;
  titleVn?: string;
  topic?: string;
  vocabulary?: Array<{
    korean: string;
    romanization?: string;
    meaningVn?: string;
    meaningEn?: string;
    pos?: string;
    audioPath?: string;
    examples?: { korean: string; meaningVn: string }[];
  }>;
  grammar?: Array<{
    orderInUnit?: number;
    pattern: string;
    titleVn?: string;
    explanationVn?: string;
    rule?: string;
    examples?: { korean: string; meaningVn: string }[];
    exercises?: { type?: string; question: string; answer: string; options?: string[] }[];
  }>;
}

/** Lưu JSON (đã review) vào DB. Bỏ qua từ/ngữ pháp đã tồn tại (theo korean/pattern). */
export async function importUnit(
  jsonText: string
): Promise<{ ok: boolean; message: string }> {
  let data: UnitJson;
  try {
    data = JSON.parse(clean(jsonText));
  } catch {
    return { ok: false, message: "JSON không hợp lệ — kiểm tra lại cú pháp." };
  }

  const num = Number(data.unit);
  if (!num || num < 1) return { ok: false, message: "Thiếu hoặc sai trường 'unit' (1-8)." };

  const book = await prisma.book.findUnique({ where: { slug: CURRENT_BOOK.slug } });
  if (!book) return { ok: false, message: "Chưa có sách trong DB. Chạy 'npm run seed' trước." };

  const meta = UNITS.find((u) => u.number === num);
  const unit = await prisma.unit.upsert({
    where: { bookId_number: { bookId: book.id, number: num } },
    create: {
      bookId: book.id,
      number: num,
      titleKr: data.titleKr || meta?.titleKr || `Bài ${num}`,
      titleVn: data.titleVn || meta?.titleVn || "",
      topic: data.topic || meta?.topic || "",
    },
    update: {
      titleKr: data.titleKr || meta?.titleKr || undefined,
      titleVn: data.titleVn || meta?.titleVn || undefined,
      topic: data.topic || meta?.topic || undefined,
    },
  });

  let addedV = 0;
  for (const v of data.vocabulary ?? []) {
    if (!v.korean) continue;
    const exists = await prisma.vocab.findFirst({
      where: { unitId: unit.id, korean: v.korean },
    });
    if (exists) continue;
    await prisma.vocab.create({
      data: {
        unitId: unit.id,
        korean: v.korean,
        romanization: v.romanization || "",
        meaningVn: v.meaningVn || "",
        meaningEn: v.meaningEn || "",
        pos: v.pos || "noun",
        audioPath: v.audioPath || `/audio/unit${num}/${v.korean}.mp3`,
        examples: {
          create: (v.examples ?? []).map((e) => ({
            korean: e.korean,
            meaningVn: e.meaningVn,
          })),
        },
      },
    });
    addedV++;
  }

  let addedG = 0;
  for (const g of data.grammar ?? []) {
    if (!g.pattern) continue;
    const exists = await prisma.grammar.findFirst({
      where: { unitId: unit.id, pattern: g.pattern },
    });
    if (exists) continue;
    await prisma.grammar.create({
      data: {
        unitId: unit.id,
        orderInUnit: g.orderInUnit || 1,
        pattern: g.pattern,
        titleVn: g.titleVn || "",
        explanationVn: g.explanationVn || "",
        rule: g.rule || "",
        examples: {
          create: (g.examples ?? []).map((e) => ({
            korean: e.korean,
            meaningVn: e.meaningVn,
          })),
        },
        exercises: {
          create: (g.exercises ?? []).map((ex) => ({
            type: ex.type || "fill_blank",
            question: ex.question,
            answer: ex.answer,
            options: ex.options ? JSON.stringify(ex.options) : null,
          })),
        },
      },
    });
    addedG++;
  }

  return {
    ok: true,
    message: `✅ Đã thêm ${addedV} từ vựng và ${addedG} điểm ngữ pháp vào Bài ${num}.`,
  };
}
