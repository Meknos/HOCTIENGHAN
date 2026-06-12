-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "level" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "titleKr" TEXT NOT NULL,
    "titleVn" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    CONSTRAINT "Unit_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vocab" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unitId" TEXT NOT NULL,
    "korean" TEXT NOT NULL,
    "romanization" TEXT NOT NULL,
    "meaningVn" TEXT NOT NULL,
    "meaningEn" TEXT NOT NULL,
    "pos" TEXT NOT NULL,
    "audioPath" TEXT,
    "imagePath" TEXT,
    CONSTRAINT "Vocab_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Example" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vocabId" TEXT NOT NULL,
    "korean" TEXT NOT NULL,
    "meaningVn" TEXT NOT NULL,
    "audioPath" TEXT,
    CONSTRAINT "Example_vocabId_fkey" FOREIGN KEY ("vocabId") REFERENCES "Vocab" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Grammar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unitId" TEXT NOT NULL,
    "orderInUnit" INTEGER NOT NULL,
    "pattern" TEXT NOT NULL,
    "titleVn" TEXT NOT NULL,
    "explanationVn" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    CONSTRAINT "Grammar_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GrammarExample" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "grammarId" TEXT NOT NULL,
    "korean" TEXT NOT NULL,
    "meaningVn" TEXT NOT NULL,
    "audioPath" TEXT,
    CONSTRAINT "GrammarExample_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "Grammar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "grammarId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "options" TEXT,
    CONSTRAINT "Exercise_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "Grammar" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SrsCard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vocabId" TEXT NOT NULL,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewAt" DATETIME,
    CONSTRAINT "SrsCard_vocabId_fkey" FOREIGN KEY ("vocabId") REFERENCES "Vocab" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "unitId" TEXT NOT NULL,
    "lessonType" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "score" INTEGER,
    "completedAt" DATETIME,
    CONSTRAINT "Progress_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Streak" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "reviewed" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_slug_key" ON "Book"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_bookId_number_key" ON "Unit"("bookId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "SrsCard_vocabId_key" ON "SrsCard"("vocabId");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_unitId_lessonType_key" ON "Progress"("unitId", "lessonType");

-- CreateIndex
CREATE UNIQUE INDEX "Streak_date_key" ON "Streak"("date");
