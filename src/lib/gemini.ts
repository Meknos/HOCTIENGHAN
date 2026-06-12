import {
  GoogleGenerativeAI,
  type GenerateContentRequest,
} from "@google/generative-ai";

/**
 * Gemini client + fallback model.
 *
 * ⚠️ Gemini 2.0 Flash đã bị tắt 1/6/2026 → dùng dòng 2.5.
 * Vì free tier hay 503 (quá tải) / 429 (hết quota) tùy model, ta thử lần lượt
 * theo thứ tự ưu tiên cho tới khi một model trả lời được.
 *   - chat tutor + grammar explain → 2.5-flash, fallback 2.5-flash-lite
 *   - quiz generate + writing check → 2.5-flash-lite, fallback 2.5-flash
 *   - extract PDF (Vision)          → 2.5-pro (trong scripts)
 */
const apiKey = process.env.GEMINI_API_KEY;

export const hasGemini = Boolean(apiKey);

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Thứ tự ưu tiên — nếu model đầu lỗi (429/503/403) thì thử model sau.
export const CHAT_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
export const TASK_MODELS = ["gemini-2.5-flash-lite", "gemini-2.5-flash"];
// Vision (đọc ảnh trang sách) — pro chính xác nhất, fallback flash.
export const VISION_MODELS = ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

/** Lỗi tạm thời / quota / quyền → thử model kế tiếp. */
function shouldFallback(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /\b(429|500|503|403)\b|quota|overload|unavailable|denied/i.test(msg);
}

/**
 * Gọi generateContent với danh sách model fallback.
 * Trả về text, hoặc ném lỗi cuối nếu tất cả model đều fail.
 */
export async function generate(
  models: string[],
  request: string | GenerateContentRequest,
  systemInstruction?: string
): Promise<string> {
  if (!genAI) throw new Error("NO_KEY");
  let lastErr: unknown;
  for (const name of models) {
    try {
      const model = genAI.getGenerativeModel(
        systemInstruction ? { model: name, systemInstruction } : { model: name }
      );
      const res = await model.generateContent(request);
      return res.response.text();
    } catch (e) {
      lastErr = e;
      if (!shouldFallback(e)) throw e; // lỗi thật (vd prompt sai) → dừng luôn
    }
  }
  throw lastErr;
}

/** Bóc JSON từ response (Gemini hay bọc trong ```json ... ```). */
export function parseJsonResponse<T>(text: string): T {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  return JSON.parse(cleaned) as T;
}
