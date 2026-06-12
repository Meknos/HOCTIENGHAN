"use server";

import { prisma } from "@/lib/prisma";
import { calcNextReview, type Grade } from "@/lib/srs";

/* ----------------------------- Vocabulary ----------------------------- */

export async function getVocabByUnit(unitNumber: number, bookSlug = "snu-1a") {
  const unit = await prisma.unit.findFirst({
    where: { number: unitNumber, book: { slug: bookSlug } },
    include: {
      vocab: {
        include: { examples: true, srsCard: true },
        orderBy: { korean: "asc" },
      },
    },
  });
  return unit?.vocab ?? [];
}

export async function getGrammarByUnit(unitNumber: number, bookSlug = "snu-1a") {
  const unit = await prisma.unit.findFirst({
    where: { number: unitNumber, book: { slug: bookSlug } },
    include: {
      grammar: {
        include: { examples: true, exercises: true },
        orderBy: { orderInUnit: "asc" },
      },
    },
  });
  return unit?.grammar ?? [];
}

export async function getGlossary(query: string) {
  const q = query.trim();
  return prisma.vocab.findMany({
    where: q
      ? {
          OR: [
            { korean: { contains: q } },
            { meaningVn: { contains: q } },
            { meaningEn: { contains: q } },
            { romanization: { contains: q } },
          ],
        }
      : undefined,
    include: { unit: true },
    orderBy: { korean: "asc" },
    take: 200,
  });
}

export async function getSentences(unitNumber: number, bookSlug = "snu-1a") {
  const unit = await prisma.unit.findFirst({
    where: { number: unitNumber, book: { slug: bookSlug } },
    include: {
      vocab: { include: { examples: true } },
      grammar: { include: { examples: true } },
    },
  });
  if (!unit) return [];
  const fromVocab = unit.vocab.flatMap((v) => v.examples);
  const fromGrammar = unit.grammar.flatMap((g) => g.examples);
  return [...fromVocab, ...fromGrammar].map((e) => ({
    korean: e.korean,
    meaningVn: e.meaningVn,
    audioPath: e.audioPath,
  }));
}

/* -------------------------------- SRS -------------------------------- */

export async function getDueCards() {
  return prisma.srsCard.findMany({
    where: { nextReviewAt: { lte: new Date() } },
    include: { vocab: { include: { examples: true } } },
    orderBy: { nextReviewAt: "asc" },
  });
}

export async function getDueCount() {
  return prisma.srsCard.count({ where: { nextReviewAt: { lte: new Date() } } });
}

export async function gradeCard(vocabId: string, grade: Grade) {
  const card = await prisma.srsCard.findUnique({ where: { vocabId } });
  if (!card) return;
  const next = calcNextReview(card, grade);
  await prisma.srsCard.update({
    where: { vocabId },
    data: { ...next, lastReviewAt: new Date() },
  });
  await updateStreak();
}

export async function markVocabLearned(vocabId: string) {
  await prisma.srsCard.upsert({
    where: { vocabId },
    create: { vocabId, nextReviewAt: new Date() },
    update: {},
  });
}

export async function isVocabLearned(vocabId: string) {
  return Boolean(await prisma.srsCard.findUnique({ where: { vocabId } }));
}

/* ------------------------------ Progress ----------------------------- */

export interface UnitProgress {
  number: number;
  learned: number;
  total: number;
}

export async function getProgressByBook(bookSlug: string): Promise<UnitProgress[]> {
  const book = await prisma.book.findUnique({
    where: { slug: bookSlug },
    include: { units: { where: { number: { gt: 0 } }, include: { vocab: { include: { srsCard: true } } }, orderBy: { number: "asc" } } },
  });
  if (!book) return [];
  return book.units.map((u) => ({
    number: u.number,
    total: u.vocab.length,
    learned: u.vocab.filter((v) => v.srsCard).length,
  }));
}

export async function getProgress(): Promise<UnitProgress[]> {
  const units = await prisma.unit.findMany({
    where: { number: { gt: 0 } },
    include: { vocab: { include: { srsCard: true } } },
    orderBy: { number: "asc" },
  });
  return units.map((u) => ({
    number: u.number,
    total: u.vocab.length,
    learned: u.vocab.filter((v) => v.srsCard).length,
  }));
}

/* ------------------------------- Streak ------------------------------ */

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export async function updateStreak() {
  const today = startOfDay(new Date());
  await prisma.streak.upsert({
    where: { date: today },
    create: { date: today, reviewed: 1 },
    update: { reviewed: { increment: 1 } },
  });
}

/* ------------------------------ Settings ----------------------------- */

export async function resetAllSrs() {
  await prisma.srsCard.deleteMany();
  await prisma.streak.deleteMany();
}

export interface Stats {
  totalVocab: number;
  learned: number;
  totalReviews: number;
  due: number;
}

export async function getStats(): Promise<Stats> {
  const [totalVocab, learned, streaks, due] = await Promise.all([
    prisma.vocab.count(),
    prisma.srsCard.count(),
    prisma.streak.findMany(),
    prisma.srsCard.count({ where: { nextReviewAt: { lte: new Date() } } }),
  ]);
  return {
    totalVocab,
    learned,
    totalReviews: streaks.reduce((s, r) => s + r.reviewed, 0),
    due,
  };
}

export async function exportData() {
  const [vocab, srs, streaks] = await Promise.all([
    prisma.vocab.count(),
    prisma.srsCard.findMany(),
    prisma.streak.findMany(),
  ]);
  return JSON.stringify({ exportedAt: new Date(), vocab, srs, streaks }, null, 2);
}

export async function getStreakCount(): Promise<number> {
  const rows = await prisma.streak.findMany({ orderBy: { date: "desc" } });
  if (rows.length === 0) return 0;

  const days = new Set(rows.map((r) => startOfDay(r.date).getTime()));
  let count = 0;
  const cursor = startOfDay(new Date());

  // Cho phép streak vẫn còn nếu hôm nay chưa ôn nhưng hôm qua đã ôn.
  if (!days.has(cursor.getTime())) cursor.setDate(cursor.getDate() - 1);

  while (days.has(cursor.getTime())) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
