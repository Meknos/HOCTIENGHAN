/**
 * Extract điểm ngữ pháp (문법과 표현) từ ảnh trang sách bằng Gemini Vision.
 * npx tsx scripts/extract-grammar.ts --image /tmp/page-58.jpg --order 1
 */
import "dotenv/config";
import fs from "node:fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ Thiếu GEMINI_API_KEY trong .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

const PROMPT = `Đây là trang ngữ pháp sách tiếng Hàn 서울대 한국어 1A.
Extract điểm ngữ pháp thành JSON. Chỉ trả về JSON.

{
  "orderInUnit": 1,
  "pattern": "N은/는 N이에요/예요",
  "titleVn": "Câu khẳng định: N là N",
  "explanationVn": "giải thích chi tiết bằng tiếng Việt",
  "rule": "받침 O → 은/이에요 | 받침 X → 는/예요",
  "examples": [{ "korean": "저는 학생이에요.", "meaningVn": "Tôi là học sinh." }],
  "exercises": [{ "type": "fill_blank", "question": "저___ 학생이에요.", "answer": "는" }]
}`;

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const image = arg("image");
  if (!image) {
    console.error("Dùng: npx tsx scripts/extract-grammar.ts --image <path> [--order N]");
    process.exit(1);
  }
  const base64 = fs.readFileSync(image).toString("base64");
  const mimeType = image.endsWith(".png") ? "image/png" : "image/jpeg";

  const result = await model.generateContent([
    { inlineData: { mimeType, data: base64 } },
    { text: PROMPT },
  ]);

  console.log(
    result.response
      .text()
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim()
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
