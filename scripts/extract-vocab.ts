/**
 * Extract từ vựng từ ảnh trang sách bằng Gemini Vision.
 * Pipeline:
 *   pdftoppm -jpeg -r 150 -f 54 -l 54 book.pdf /tmp/page   # rasterize trang
 *   npx tsx scripts/extract-vocab.ts --image /tmp/page-54.jpg --unit 1
 * Output JSON in ra stdout → review thủ công → bỏ vào data/unitN.json
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

const PROMPT = `Đây là trang sách tiếng Hàn 서울대 한국어 1A.
Hãy extract TẤT CẢ từ vựng trên trang thành JSON. Chỉ trả về JSON, không text khác.

[
  {
    "korean": "학생",
    "romanization": "hak-saeng",
    "meaningVn": "học sinh",
    "meaningEn": "student",
    "pos": "noun",
    "examples": [{ "korean": "저는 학생이에요.", "meaningVn": "Tôi là học sinh." }]
  }
]`;

function arg(name: string) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

async function main() {
  const image = arg("image");
  if (!image) {
    console.error("Dùng: npx tsx scripts/extract-vocab.ts --image <path> [--unit N]");
    process.exit(1);
  }
  const base64 = fs.readFileSync(image).toString("base64");
  const mimeType = image.endsWith(".png") ? "image/png" : "image/jpeg";

  const result = await model.generateContent([
    { inlineData: { mimeType, data: base64 } },
    { text: PROMPT },
  ]);

  const text = result.response
    .text()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  // In ra để review/redirect vào file.
  console.log(text);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
