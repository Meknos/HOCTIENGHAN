/**
 * Trích xuất HÀNG LOẠT cả quyển sách theo config.
 *
 * 1. Tạo file config: data/<slug>.toc.json
 * 2. Chạy: npx tsx scripts/extract-book.ts data/snu-1a.toc.json [--force]
 * 3. Review JSON sinh ra trong data/<slug>/
 * 4. Seed:  npm run seed
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Thieu GEMINI_API_KEY trong .env");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const MODELS = ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite"];

const configPath = process.argv[2];
const force = process.argv.includes("--force");
if (!configPath) {
  console.error("Dung: npx tsx scripts/extract-book.ts <config.json> [--force]");
  process.exit(1);
}

interface UnitCfg {
  number: number;
  pages: string;
  titleKr?: string;
  titleVn?: string;
  topic?: string;
}
interface BookCfg {
  slug: string;
  pdf: string;
  units: UnitCfg[];
}

// ─── Validation ───────────────────────────────────────────────────────────────

interface ValidationIssue {
  field: string;
  message: string;
}

function validateExtracted(obj: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!Array.isArray(obj.vocabulary) || obj.vocabulary.length === 0)
    issues.push({ field: "vocabulary", message: "Mang vocabulary rong hoac thieu" });
  if (!Array.isArray(obj.grammar) || obj.grammar.length === 0)
    issues.push({ field: "grammar", message: "Mang grammar rong hoac thieu" });

  for (const v of (obj.vocabulary as Record<string, unknown>[] | undefined) ?? []) {
    const kr = String(v.korean ?? "?");
    if (!v.romanization)
      issues.push({ field: `vocab.${kr}`, message: "Thieu romanization" });
    if (!v.meaningVn)
      issues.push({ field: `vocab.${kr}`, message: "Thieu meaningVn" });
    if (!v.meaningEn)
      issues.push({ field: `vocab.${kr}`, message: "Thieu meaningEn" });
    if (!Array.isArray(v.examples) || (v.examples as unknown[]).length === 0)
      issues.push({ field: `vocab.${kr}`, message: "Thieu examples" });
  }

  for (const g of (obj.grammar as Record<string, unknown>[] | undefined) ?? []) {
    const pat = String(g.pattern ?? "?");
    if (!g.explanationVn || String(g.explanationVn).length < 30)
      issues.push({ field: `grammar.${pat}`, message: "explanationVn qua ngan (< 30 ky tu)" });
    if (!g.rule)
      issues.push({ field: `grammar.${pat}`, message: "Thieu rule" });
    if (!Array.isArray(g.examples) || (g.examples as unknown[]).length < 2)
      issues.push({ field: `grammar.${pat}`, message: "Can >= 2 examples" });
    if (!Array.isArray(g.exercises) || (g.exercises as unknown[]).length < 2)
      issues.push({ field: `grammar.${pat}`, message: "Can >= 2 exercises" });
  }

  return issues;
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

function buildPrompt(u: UnitCfg, isRetry = false): string {
  const retryNote = isRetry
    ? "LAN THU LAI - lan truoc thieu thong tin. Doc KY HON, trich xuat DAY DU hon.\n\n"
    : "";

  const unitLabel = u.titleKr ? ` - ${u.titleKr}` : "";

  // JSON schema example stored in separate file to keep source clean
  const schemaPath = path.join(process.cwd(), "data", "extract-schema-example.json");
  const schemaExample = fs.existsSync(schemaPath)
    ? fs.readFileSync(schemaPath, "utf-8")
    : '{"unit":1,"titleKr":"","titleVn":"","topic":"","vocabulary":[{"korean":"","romanization":"","meaningVn":"","meaningEn":"","pos":"noun","note":"","examples":[{"korean":"","meaningVn":""}]}],"grammar":[{"orderInUnit":1,"pattern":"","titleVn":"","explanationVn":"","rule":"","pronunciationTip":"","examples":[{"korean":"","meaningVn":""}],"exercises":[{"type":"fill_blank","question":"","answer":"","options":null}]}],"dialogues":[{"title":"","lines":[{"speaker":"A","korean":"","meaningVn":""}]}]}';

  return (
    retryNote +
    `Ban la chuyen gia ngon ngu hoc tieng Han. Day la cac trang sach "서울대 한국어"` +
    ` (Bai ${u.number}${unitLabel}).\n\n` +
    "Hay trich xuat DAY DU toan bo noi dung tu tat ca cac phan sau:\n" +
    "1. 어휘 (Tu vung): TOAN BO, ke ca tu xuat hien trong hoi thoai va bai tap\n" +
    "2. 문법과 표현 (Ngu phap): Moi diem ngu phap, giai thich day du + bai tap da dang\n" +
    "3. 대화 (Hoi thoai): Toan bo doan hoi thoai kem dich nghia tung dong\n" +
    "4. 발음 (Phat am): Ghi vao pronunciationTip cua ngu phap lien quan neu co\n\n" +
    "Tra ve 1 object JSON DUY NHAT (JSON thuan, KHONG co markdown, KHONG co backtick).\n" +
    "Cu phap JSON phai theo dung cau truc nay:\n\n" +
    schemaExample +
    "\n\n" +
    "QUY TAC BAT BUOC:\n" +
    "- Moi meaningVn PHAI co noi dung tieng Viet tu nhien co dau (KHONG de trong)\n" +
    "- Moi romanization PHAI co (theo Revised Romanization of Korean)\n" +
    "- Moi tu vung: it nhat 2 vi du cau\n" +
    "- Moi diem ngu phap: >= 3 examples, >= 3 exercises (gom fill_blank + multiple_choice + reorder)\n" +
    "- explanationVn: >= 2 cau, giai thich ro khi nao dung va cach dung, viet bang TIENG VIET CO DAU\n" +
    "- pos chi dung: noun | verb | adjective | adverb | expression | particle | counter\n" +
    "- dialogues: chi trich nguyen van tu sach, KHONG bia them\n" +
    "- Neu sach khong co phan nao, de mang rong []\n"
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseRange(input: string, total: number): number[] {
  const m = input.trim().match(/^(\d+)\s*(?:-\s*(\d+))?$/);
  if (!m) return [];
  const a = Number(m[1]);
  const b = m[2] ? Number(m[2]) : a;
  const out: number[] = [];
  for (let p = Math.min(a, b); p <= Math.max(a, b); p++)
    if (p >= 1 && p <= total) out.push(p - 1);
  return out;
}

const clean = (t: string) =>
  t
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function callGemini(b64: string, promptText: string): Promise<string> {
  let lastErr: unknown;
  for (const name of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: name });
      const res = await model.generateContent([
        { inlineData: { mimeType: "application/pdf", data: b64 } },
        { text: promptText },
      ]);
      return clean(res.response.text());
    } catch (e) {
      lastErr = e;
      const msg = e instanceof Error ? e.message : String(e);
      if (!/\b(429|500|503|403)\b|quota|overload|unavailable|denied/i.test(msg)) throw e;
      console.log(`    -> ${name} loi, thu model ke...`);
    }
  }
  throw lastErr;
}

async function extractSlice(b64: string, u: UnitCfg): Promise<Record<string, unknown>> {
  const text1 = await callGemini(b64, buildPrompt(u, false));
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(text1);
  } catch {
    console.log("\n    -> JSON parse loi lan 1, thu lai...");
    await sleep(2000);
    const text2 = await callGemini(b64, buildPrompt(u, true));
    obj = JSON.parse(text2);
  }

  const issues = validateExtracted(obj);
  if (issues.length > 0) {
    console.log(`\n    -> Thieu ${issues.length} truong, retry...`);
    if (issues.length <= 5) {
      for (const i of issues) console.log(`       * ${i.field}: ${i.message}`);
    }
    await sleep(3000);
    const text3 = await callGemini(b64, buildPrompt(u, true));
    try {
      const obj2 = JSON.parse(text3);
      const issues2 = validateExtracted(obj2);
      if (issues2.length < issues.length) {
        console.log(`    OK Retry tot hon (${issues2.length} issue con lai)`);
        return obj2;
      }
    } catch {
      console.log("    -> Retry JSON loi, giu ket qua lan 1");
    }
  }

  return obj;
}

async function main() {
  const cfg: BookCfg = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const pdfPath = path.isAbsolute(cfg.pdf) ? cfg.pdf : path.join(process.cwd(), cfg.pdf);
  const src = await PDFDocument.load(fs.readFileSync(pdfPath));
  const total = src.getPageCount();
  console.log(`Sach: ${cfg.slug} | PDF ${total} trang | ${cfg.units.length} bai can trich`);

  const outDir = path.join(process.cwd(), "data", cfg.slug);
  fs.mkdirSync(outDir, { recursive: true });

  for (const u of cfg.units) {
    const outFile = path.join(outDir, `unit${u.number}.json`);
    if (fs.existsSync(outFile) && !force) {
      console.log(`  [skip] Bai ${u.number}: da co (dung --force de ghi de)`);
      continue;
    }

    const idx = parseRange(u.pages, total);
    if (idx.length === 0) {
      console.log(`  [warn] Bai ${u.number}: khoang trang "${u.pages}" khong hop le -> bo qua`);
      continue;
    }

    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, idx);
    pages.forEach((p) => out.addPage(p));
    const b64 = Buffer.from(await out.save()).toString("base64");

    process.stdout.write(`  Bai ${u.number} (trang ${u.pages})... `);
    try {
      const obj = await extractSlice(b64, u);
      const issues = validateExtracted(obj);
      const warnSuffix = issues.length > 0 ? ` [!${issues.length} issue]` : "";
      fs.writeFileSync(outFile, JSON.stringify(obj, null, 2), "utf-8");
      const vocab = Array.isArray(obj.vocabulary) ? obj.vocabulary.length : 0;
      const gram = Array.isArray(obj.grammar) ? obj.grammar.length : 0;
      const dlg = Array.isArray(obj.dialogues) ? obj.dialogues.length : 0;
      console.log(`OK | ${vocab} tu | ${gram} ngu phap | ${dlg} hoi thoai${warnSuffix}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.toLowerCase().includes("json")) {
        fs.writeFileSync(outFile + ".raw.txt", msg, "utf-8");
        console.log("[WARN] JSON loi -> luu .raw.txt de sua tay");
      } else {
        console.log("[ERR] " + msg.slice(0, 100));
      }
    }

    await sleep(4000);
  }

  console.log(`\nXong! Review file trong data/${cfg.slug}/ roi chay: npm run seed`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
