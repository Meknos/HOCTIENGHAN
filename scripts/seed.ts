/**
 * Seed dữ liệu từ data/unit*.json vào DB.
 * Chạy: npx tsx scripts/seed.ts
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { UNITS_BY_SLUG } from "../src/lib/units";
import { BOOKS } from "../src/lib/books";

const prisma = new PrismaClient();
const DATA_DIR = path.join(process.cwd(), "data");

interface VocabJson {
  korean: string;
  romanization: string;
  meaningVn: string;
  meaningEn: string;
  pos: string;
  audioPath?: string;
  imagePath?: string;
  examples?: { korean: string; meaningVn: string; audioPath?: string }[];
}
interface ExerciseJson {
  type: string;
  question: string;
  answer: string;
  options?: string[];
}
interface GrammarJson {
  orderInUnit: number;
  pattern: string;
  titleVn: string;
  explanationVn: string;
  rule: string;
  pronunciationTip?: string;
  examples?: { korean: string; meaningVn: string; audioPath?: string }[];
  exercises?: ExerciseJson[];
}
interface DialogLineJson {
  speaker: string;
  korean: string;
  meaningVn: string;
  audioPath?: string;
}
interface DialogJson {
  title: string;
  lines: DialogLineJson[];
}
interface UnitJson {
  unit: number;
  titleKr: string;
  titleVn: string;
  topic: string;
  vocabulary: VocabJson[];
  grammar: GrammarJson[];
  dialogues?: DialogJson[];
}

async function seedUnitFile(bookId: string, data: UnitJson) {
  const unit = await prisma.unit.upsert({
    where: { bookId_number: { bookId, number: data.unit } },
    create: {
      bookId,
      number: data.unit,
      titleKr: data.titleKr,
      titleVn: data.titleVn,
      topic: data.topic,
    },
    update: { titleKr: data.titleKr, titleVn: data.titleVn, topic: data.topic },
  });

  // Xoá vocab/grammar/dialogs cũ để seed lại sạch (idempotent).
  await prisma.vocab.deleteMany({ where: { unitId: unit.id } });
  await prisma.grammar.deleteMany({ where: { unitId: unit.id } });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (prisma as any).dialog.deleteMany({ where: { unitId: unit.id } });

  for (const v of data.vocabulary ?? []) {
    await prisma.vocab.create({
      data: {
        unitId: unit.id,
        korean: v.korean,
        romanization: v.romanization,
        meaningVn: v.meaningVn,
        meaningEn: v.meaningEn ?? "",
        pos: v.pos,
        audioPath: v.audioPath ?? `/audio/unit${data.unit}/${v.korean}.mp3`,
        imagePath: v.imagePath ?? null,
        examples: {
          create: (v.examples ?? []).map((e) => ({
            korean: e.korean,
            meaningVn: e.meaningVn,
            audioPath: e.audioPath ?? null,
          })),
        },
      },
    });
  }

  for (const g of data.grammar ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).grammar.create({
      data: {
        unitId: unit.id,
        orderInUnit: g.orderInUnit,
        pattern: g.pattern,
        titleVn: g.titleVn,
        explanationVn: g.explanationVn,
        rule: g.rule,
        pronunciationTip: g.pronunciationTip ?? null,
        examples: {
          create: (g.examples ?? []).map((e) => ({
            korean: e.korean,
            meaningVn: e.meaningVn,
            audioPath: e.audioPath ?? null,
          })),
        },
        exercises: {
          create: (g.exercises ?? []).map((ex) => ({
            type: ex.type,
            question: ex.question,
            answer: ex.answer,
            options: ex.options ? JSON.stringify(ex.options) : null,
          })),
        },
      },
    });
  }

  const dialogues = data.dialogues ?? [];
  for (let i = 0; i < dialogues.length; i++) {
    const d = dialogues[i];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma as any).dialog.create({
      data: {
        unitId: unit.id,
        title: d.title,
        order: i,
        lines: {
          create: d.lines.map((l: DialogLineJson, idx: number) => ({
            order: idx,
            speaker: l.speaker,
            korean: l.korean,
            meaningVn: l.meaningVn,
            audioPath: l.audioPath ?? null,
          })),
        },
      },
    });
  }

  const dlgCount = data.dialogues?.length ?? 0;
  console.log(
    `    OK Bai ${data.unit}: ${data.vocabulary?.length ?? 0} tu, ${data.grammar?.length ?? 0} ngu phap, ${dlgCount} hoi thoai`
  );
}

function readUnitFiles(dir: string): UnitJson[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^unit\d+\.json$/.test(f))
    .sort()
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as UnitJson);
}

async function main() {
  console.log("Bat dau seed...");

  for (const meta of BOOKS) {
    const dirFiles = readUnitFiles(path.join(DATA_DIR, meta.slug));
    const legacyFiles = meta.slug === "snu-1a" ? readUnitFiles(DATA_DIR) : [];
    const units = [...legacyFiles, ...dirFiles];

    // Tao sach neu co data JSON hoac co trong UNITS_BY_SLUG (co PDF)
    if (units.length === 0 && !UNITS_BY_SLUG[meta.slug]) continue;

    const book = await prisma.book.upsert({
      where: { slug: meta.slug },
      create: { name: meta.nameKr, slug: meta.slug, level: meta.levelKr },
      update: { name: meta.nameKr },
    });
    console.log(`  ${meta.nameKr}`);

    // Tạo sẵn metadata tất cả bài cho mọi quyển đã có trong UNITS_BY_SLUG
    const unitMetas = UNITS_BY_SLUG[meta.slug];
    if (unitMetas) {
      for (const u of unitMetas) {
        await prisma.unit.upsert({
          where: { bookId_number: { bookId: book.id, number: u.number } },
          create: { bookId: book.id, number: u.number, titleKr: u.titleKr, titleVn: u.titleVn, topic: u.topic },
          update: { titleKr: u.titleKr, titleVn: u.titleVn, topic: u.topic },
        });
      }
    }

    for (const data of units) await seedUnitFile(book.id, data);
  }

  console.log("Seed xong!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
