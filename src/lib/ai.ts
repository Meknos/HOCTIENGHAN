"use server";

import {
  generate,
  hasGemini,
  parseJsonResponse,
  CHAT_MODELS,
  TASK_MODELS,
} from "@/lib/gemini";

export interface ChatMsg {
  role: "user" | "model";
  text: string;
}

const NO_KEY =
  "⚠️ Chưa cấu hình GEMINI_API_KEY. Thêm key vào .env (lấy free tại aistudio.google.com).";
const ERR =
  "⚠️ Lỗi gọi Gemini (tất cả model đều bận hoặc hết quota). Thử lại sau ít phút.";

/* --------------------------- 1. AI Tutor Chat --------------------------- */

const systemPrompt = (unit: number, unitTitle: string, learned: string[]) => `
Bạn là gia sư tiếng Hàn tên 하늘 선생님.
Đang dạy người Việt theo sách 서울대 한국어 1A.

Bài đang học: Bài ${unit} — "${unitTitle}"
Ngữ pháp đã học: ${learned.join(" · ") || "(mới bắt đầu)"}

NGUYÊN TẮC:
- Chỉ dùng từ vựng/ngữ pháp trong các bài đã học.
- Trả lời xen kẽ tiếng Hàn + giải thích tiếng Việt.
- Sửa lỗi nhẹ nhàng: "Gần đúng rồi! Đúng hơn là...".
- Đặt câu hỏi ngược lại để luyện nói.

FORMAT trả lời:
🇰🇷 [Tiếng Hàn]
📖 [Giải thích tiếng Việt]
💡 [Mẹo / ghi chú nếu cần]
`;

export async function chatWithAI(
  messages: ChatMsg[],
  unit: number,
  unitTitle: string,
  learnedGrammar: string[]
): Promise<string> {
  if (!hasGemini) return NO_KEY;
  try {
    const contents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));
    return await generate(
      CHAT_MODELS,
      { contents },
      systemPrompt(unit, unitTitle, learnedGrammar)
    );
  } catch (e) {
    console.error(e);
    return ERR;
  }
}

/* ------------------------- 2. Grammar Explainer ------------------------- */

export async function explainGrammar(
  pattern: string,
  question: string
): Promise<string> {
  if (!hasGemini) return NO_KEY;
  const prompt = `Giải thích ngữ pháp tiếng Hàn cho người Việt. Trả về markdown.

Điểm ngữ pháp: "${pattern}"
Câu hỏi: "${question}"

Trả lời theo format:
## Ý nghĩa
(1 câu ngắn gọn)
## Công thức
(bảng hoặc công thức rõ ràng)
## Ví dụ
1. (KR) — (VN)
2. (KR) — (VN)
3. (KR) — (VN)
## Lỗi thường gặp
(1-2 lỗi phổ biến)`;
  try {
    return await generate(CHAT_MODELS, prompt);
  } catch (e) {
    console.error(e);
    return ERR;
  }
}

/* --------------------------- 3. Quiz Generator -------------------------- */

export interface QuizResult {
  question: string;
  correct: string;
  wrong: string[];
}

export async function generateQuiz(
  korean: string,
  meaningVn: string,
  otherMeanings: string[]
): Promise<QuizResult> {
  // Fallback nếu không có Gemini / lỗi: lấy nghĩa khác cùng unit làm đáp án sai.
  const fallback = (): QuizResult => ({
    question: `"${korean}" nghĩa là gì?`,
    correct: meaningVn,
    wrong: otherMeanings.filter((m) => m !== meaningVn).slice(0, 3),
  });

  if (!hasGemini) return fallback();

  const prompt = `Tạo quiz trắc nghiệm cho từ tiếng Hàn. Trả về JSON ONLY, không markdown.
Từ cần hỏi: "${korean}" — nghĩa: "${meaningVn}"
Tạo 3 đáp án sai hợp lý (nghĩa tiếng Việt khác, cùng chủ đề, không trùng đáp án đúng).
JSON: { "question": "\\"${korean}\\" nghĩa là gì?", "correct": "${meaningVn}", "wrong": ["sai1","sai2","sai3"] }`;
  try {
    return parseJsonResponse<QuizResult>(await generate(TASK_MODELS, prompt));
  } catch {
    return fallback();
  }
}

/* -------------------------- 4. Writing Checker -------------------------- */

export async function checkWriting(
  sentence: string,
  pattern: string
): Promise<string> {
  if (!hasGemini) return NO_KEY;
  const prompt = `Bạn là gia sư tiếng Hàn. Người Việt vừa viết câu dùng ngữ pháp "${pattern}".
Câu của họ: "${sentence}"

Phân tích bằng markdown:
## Đánh giá
(Đúng/Sai và mức độ tự nhiên)
## Câu đúng
(câu Hàn chuẩn nếu cần sửa)
## Giải thích
(ngắn gọn tiếng Việt, chỉ ra lỗi cụ thể)`;
  try {
    return await generate(TASK_MODELS, prompt);
  } catch (e) {
    console.error(e);
    return ERR;
  }
}

export async function geminiReady() {
  return hasGemini;
}
