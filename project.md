# 서울대 한국어 1A — Web Học Tiếng Hàn Nội Bộ

> Web app học tiếng Hàn cá nhân, xây dựng từ nội dung sách **서울대 한국어 1A**.  
> Một người dùng · Không auth · Không payment · **$0/tháng**.

---

## Mục tiêu

Xây dựng công cụ học tiếng Hàn cho bản thân với đầy đủ tính năng:
- Học từ vựng + ngữ pháp theo từng bài
- Ôn tập thông minh bằng Spaced Repetition (SM-2)
- Chat với AI tutor bằng tiếng Hàn
- Shadowing phát âm theo audio gốc

---

## Tech Stack — $0/tháng

| Tầng | Công nghệ | Lý do chọn |
|------|-----------|------------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | Full-stack trong 1 project |
| **Styling** | Tailwind CSS + shadcn/ui | UI nhanh, đẹp, free |
| **State** | Zustand + localStorage | Đơn giản, không cần server |
| **Database** | Supabase PostgreSQL (free 500MB) | Đủ cho toàn bộ nội dung 1A |
| **ORM** | Prisma | TypeScript-first, tự gen migration |
| **Audio CDN** | GitHub repo + jsDelivr | Lưu MP3, CDN free toàn cầu |
| **AI (chat/grammar)** | Gemini 2.5 Flash | 250 req/ngày, free, Vision, streaming |
| **AI (quiz/writing)** | Gemini 2.5 Flash-Lite | 1.000 req/ngày, nhẹ hơn, đủ cho task đơn giản |
| **AI Vision (1 lần)** | Gemini 2.5 Pro | Extract PDF sách — chỉ chạy 1 lần (~54 req) |
| **Deploy** | Vercel (free) | Auto deploy từ GitHub |
| **Repo** | GitHub | Source code + lưu audio files |

### Lưu ý quan trọng

- **Supabase free** tự pause sau 7 ngày không dùng → dùng GitHub Actions ping mỗi 5 ngày, hoặc thay bằng **Neon.tech** (PostgreSQL free, không pause, 512MB)
- **Gemini 2.0 Flash đã bị tắt 1/6/2026** — phải dùng model 2.5 trở lên
- **Gemini 2.5 Flash** (chat/grammar): 250 req/ngày — cache vào localStorage để tránh gọi lại
- **Gemini 2.5 Flash-Lite** (quiz/writing): 1.000 req/ngày — task đơn giản, tiết kiệm quota Flash
- **Gemini 2.5 Pro** (extract PDF): 100 req/ngày — chỉ chạy 1 lần ~54 req, còn dư 46 req nếu retry
- **Audio**: lưu file MP3 vào `public/audio/` trong repo, hoặc GitHub repo riêng + jsDelivr CDN

---

## Cấu trúc sách 서울대 한국어 1A

**263 trang · PDF scanned (không có text layer)**

```
서울대 한국어 1A
├── 한글 배우기 (Học bảng chữ cái)
│   ├── 모음 — Nguyên âm (21)
│   ├── 자음 — Phụ âm (21)
│   └── 받침 — Âm cuối (syllable-final consonants)
│
├── 과 1–8 (8 bài học chính)
│   └── Mỗi bài gồm 11 phần:
│       ├── 어휘          Từ vựng + hình minh họa
│       ├── 문법과 표현 1  Ngữ pháp 1 + ví dụ + bài tập
│       ├── 말하기 1      Hội thoại 1
│       ├── 문법과 표현 2  Ngữ pháp 2 + ví dụ + bài tập
│       ├── 말하기 2      Hội thoại 2
│       ├── 듣고 말하기   Nghe + nói
│       ├── 읽고 쓰기     Đọc + viết
│       ├── 과제          Task tổng hợp
│       ├── 문화 산책     Văn hóa Hàn Quốc
│       ├── 발음          Phát âm
│       └── 자기 평가     Tự kiểm tra
│
└── 부록 (Phụ lục)
    ├── 문법 해설   Grammar Extension
    ├── 듣기 지문   Listening Scripts
    ├── 모범 답안   Answer Key
    └── 어휘 색인   Glossary (tra từ)
```

### 8 bài học — nội dung chi tiết

| 과 | Chủ đề | Từ vựng | Ngữ pháp |
|----|--------|---------|----------|
| 1 | 안녕하세요? (Xin chào) | Quốc tịch, Nghề nghiệp | N은/는 N이에요/예요 · N입니까? · N이/가 아닙니다 |
| 2 | 이게 뭐예요? (Cái này là gì?) | Đồ dùng học tập, Đồ sinh hoạt | N이/가 있어요[없어요] · N 주세요 · N하고 N · N과/와 N |
| 3 | 여기가 어디예요? (Đây là đâu?) | Động từ 1, Địa điểm 1 | V-아요/어요 · N을/를 · N에서 · 안 V |
| 4 | 전화번호가 뭐예요? (Số điện thoại?) | Địa điểm 2, Vị trí | N에 있어요[없어요] · N에 가요[와요] · N 앞[뒤, 옆] |
| 5 | 주말에 친구를 만났어요 (Gặp bạn cuối tuần) | Số đếm, Ngày trong tuần | N에 · V-았/었- · V-고 |
| 6 | 얼마예요? (Bao nhiêu tiền?) | Đồ ăn, Số đếm 2, Tiền | V-(으)세요 · N 개[병,잔] · N이/가 A-아요/어요 · N도 |
| 7 | 날씨가 어떻습니까? (Thời tiết?) | Thời tiết, Mùa, Tính từ 1 | ㅂ 불규칙 · A/V-지만 · A/V-습니다/ㅂ니다 · A/V-고 |
| 8 | 영화 볼까요? (Xem phim nhé?) | Hoạt động giải trí | V-(으)ㄹ까요? · ㄷ 불규칙 · 이[그,저] N · A/V-네요 |

---

## Database Schema

```prisma
// schema.prisma

model Book {
  id    String  @id @default(cuid())
  name  String  // "서울대 한국어 1A"
  slug  String  @unique // "snu-1a"
  level String  // "beginner"
  units Unit[]
}

model Unit {
  id        String   @id @default(cuid())
  bookId    String
  number    Int      // 1-8, 0 = 한글 배우기
  titleKr   String   // "안녕하세요?"
  titleVn   String   // "Xin chào"
  topic     String   // chủ đề
  book      Book     @relation(fields: [bookId], references: [id])
  vocab     Vocab[]
  grammar   Grammar[]
  srsCards  SrsCard[]
  progress  Progress[]
}

model Vocab {
  id           String    @id @default(cuid())
  unitId       String
  korean       String    // "학생"
  romanization String    // "hak-saeng"
  meaningVn    String    // "học sinh"
  meaningEn    String    // "student"
  pos          String    // "noun" | "verb" | "adjective" | "expression"
  audioPath    String?   // "/audio/unit1/학생.mp3"
  imagePath    String?   // "/images/unit1/학생.jpg"
  unit         Unit      @relation(fields: [unitId], references: [id])
  examples     Example[]
  srsCard      SrsCard?
}

model Example {
  id        String @id @default(cuid())
  vocabId   String
  korean    String // "저는 학생이에요."
  meaningVn String // "Tôi là học sinh."
  audioPath String?
  vocab     Vocab  @relation(fields: [vocabId], references: [id])
}

model Grammar {
  id            String           @id @default(cuid())
  unitId        String
  orderInUnit   Int              // 1 hoặc 2 (문법과 표현 1/2)
  pattern       String           // "N은/는 N이에요/예요"
  titleVn       String           // "Câu khẳng định: N là N"
  explanationVn String           // giải thích chi tiết
  rule          String           // quy tắc chia: "받침 O + 은/이에요 | 받침 X + 는/예요"
  unit          Unit             @relation(fields: [unitId], references: [id])
  examples      GrammarExample[]
  exercises     Exercise[]
}

model GrammarExample {
  id        String  @id @default(cuid())
  grammarId String
  korean    String
  meaningVn String
  audioPath String?
  grammar   Grammar @relation(fields: [grammarId], references: [id])
}

model Exercise {
  id        String  @id @default(cuid())
  grammarId String
  type      String  // "fill_blank" | "multiple_choice" | "reorder"
  question  String
  answer    String
  options   Json?   // ["옵션1","옵션2","옵션3","옵션4"]
  grammar   Grammar @relation(fields: [grammarId], references: [id])
}

// SRS — Spaced Repetition (không cần user_id vì 1 người dùng)
model SrsCard {
  id           String    @id @default(cuid())
  vocabId      String    @unique
  easeFactor   Float     @default(2.5)  // SM-2: 1.3 → 2.5
  interval     Int       @default(1)    // ngày
  repetitions  Int       @default(0)
  nextReviewAt DateTime  @default(now())
  lastReviewAt DateTime?
  vocab        Vocab     @relation(fields: [vocabId], references: [id])
}

// Tiến độ học
model Progress {
  id          String   @id @default(cuid())
  unitId      String
  lessonType  String   // "vocab" | "grammar" | "review"
  completed   Boolean  @default(false)
  score       Int?     // % đúng
  completedAt DateTime?
  unit        Unit     @relation(fields: [unitId], references: [id])
}

// Streak
model Streak {
  id       String   @id @default(cuid())
  date     DateTime @unique
  reviewed Int      @default(0) // số thẻ đã ôn
}
```

---

## Routes & Pages

```
/                     → Dashboard (tổng quan + cards cần ôn hôm nay)
/hangeul              → Học bảng chữ cái (자음, 모음, 받침)
/vocabulary           → Chọn Unit
/vocabulary/[unit]    → Study mode + Flashcard + Quiz
/grammar              → Chọn Unit
/grammar/[unit]       → Điểm ngữ pháp + Bài tập
/review               → SRS session hàng ngày
/chat                 → AI tutor (Gemini)
/shadowing            → Phát âm theo audio
/glossary             → Tra từ toàn bộ (어휘 색인)
/settings             → Cài đặt (reset, export data)
```

---

## AI Integration — Gemini 2.5

> ⚠️ Gemini 2.0 Flash đã bị tắt 1/6/2026. Dùng model 2.5 trở lên.

| Tính năng | Model | Quota free |
|-----------|-------|------------|
| Extract PDF sách (1 lần) | `gemini-2.5-pro` | 100 req/ngày — đủ cho ~54 req toàn sách |
| AI Chat tutor | `gemini-2.5-flash` | 250 req/ngày |
| Grammar explain | `gemini-2.5-flash` | 250 req/ngày |
| Quiz generate (cache) | `gemini-2.5-flash-lite` | 1.000 req/ngày |
| Writing check | `gemini-2.5-flash-lite` | 1.000 req/ngày |


### Setup

```typescript
// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
// Chat tutor + Grammar explain — 250 req/ngày
export const flashModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

// Quiz generate + Writing check — 1.000 req/ngày
export const liteModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" })

// Extract PDF sách — chỉ dùng 1 lần, 100 req/ngày
export const proModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" })
```

### 1. AI Tutor Chat

```typescript
const SYSTEM_PROMPT = (unit: number, unitTitle: string, learnedGrammar: string[]) => `
Bạn là gia sư tiếng Hàn tên 하늘 선생님.
Đang dạy người Việt theo sách 서울대 한국어 1A.

Bài đang học: Bài ${unit} — "${unitTitle}"
Ngữ pháp đã học: ${learnedGrammar.join(" · ")}

NGUYÊN TẮC:
- Chỉ dùng từ vựng/ngữ pháp trong các bài đã học
- Trả lời xen kẽ tiếng Hàn + giải thích tiếng Việt
- Sửa lỗi nhẹ nhàng: "Gần đúng rồi! Đúng hơn là..."
- Đặt câu hỏi ngược lại để luyện nói

FORMAT trả lời:
🇰🇷 [Tiếng Hàn]
📖 [Giải thích tiếng Việt]
💡 [Mẹo / ghi chú nếu cần]
`
```

### 2. Quiz Generation

```typescript
const quizPrompt = (vocab: Vocab, unitVocab: Vocab[]) => `
Tạo quiz trắc nghiệm cho từ tiếng Hàn. Trả về JSON ONLY, không markdown.

Từ cần hỏi: "${vocab.korean}" — nghĩa: "${vocab.meaningVn}"
Các từ cùng bài: ${unitVocab.map(v => v.korean).join(", ")}

JSON format:
{
  "question": "\"${vocab.korean}\" nghĩa là gì?",
  "correct": "${vocab.meaningVn}",
  "wrong": ["sai1", "sai2", "sai3"]
}
`
// Cache kết quả vào localStorage để không gọi lại
```

### 3. Grammar Explainer

```typescript
const grammarPrompt = (pattern: string, question: string) => `
Giải thích ngữ pháp tiếng Hàn cho người Việt. Trả về markdown.

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
(1-2 lỗi phổ biến)
`
```

### 4. Vision Extract PDF (dùng 1 lần khi nhập liệu)

```typescript
const extractPrompt = `
Đây là trang sách tiếng Hàn 서울대 한국어 1A.
Hãy extract TẤT CẢ từ vựng trên trang thành JSON. Chỉ trả về JSON, không text khác.

[
  {
    "korean": "학생",
    "romanization": "hak-saeng",
    "meaning_vn": "học sinh",
    "meaning_en": "student",
    "pos": "noun",
    "example_kr": "저는 학생이에요.",
    "example_vn": "Tôi là học sinh."
  }
]
`
```

---

## SRS Algorithm (SM-2)

```typescript
// lib/srs.ts
export type Grade = 0 | 1 | 2 | 3 | 4 | 5
// 0-2: Khó (lặp lại sớm)
// 3:   OK
// 4-5: Dễ

export function calcNextReview(card: SrsCard, grade: Grade) {
  let { easeFactor, interval, repetitions } = card

  if (grade < 3) {
    // Quên → reset
    repetitions = 0
    interval = 1
  } else {
    // Nhớ → tăng interval
    if (repetitions === 0)      interval = 1
    else if (repetitions === 1) interval = 6
    else                        interval = Math.round(interval * easeFactor)

    repetitions += 1
  }

  // Cập nhật ease factor
  easeFactor = Math.max(1.3,
    easeFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)
  )

  const nextReviewAt = new Date()
  nextReviewAt.setDate(nextReviewAt.getDate() + interval)

  return { easeFactor, interval, repetitions, nextReviewAt }
}
```

---

## Data Entry — Extract từ PDF

PDF sách bị **scanned** (không có text layer). Pipeline extract:

```bash
# Bước 1: Rasterize từng trang
pdftoppm -jpeg -r 150 -f 54 -l 54 book.pdf /tmp/page
# → /tmp/page-054.jpg

# Bước 2: Gửi ảnh lên Gemini Vision
node scripts/extract-vocab.js --page 54 --unit 1

# Bước 3: Review JSON output + sửa lỗi thủ công

# Bước 4: Seed vào Supabase
node scripts/seed.js --file data/unit1-vocab.json
```

```typescript
// scripts/extract-vocab.ts
import fs from "fs"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" })

async function extractPage(imagePath: string) {
  const imageData = fs.readFileSync(imagePath)
  const base64 = imageData.toString("base64")

  const result = await model.generateContent([
    { inlineData: { mimeType: "image/jpeg", data: base64 } },
    { text: extractPrompt }
  ])

  return JSON.parse(result.response.text())
}
```

### Data JSON Template

```json
{
  "unit": 1,
  "titleKr": "안녕하세요?",
  "titleVn": "Xin chào",
  "vocabulary": [
    {
      "korean": "학생",
      "romanization": "hak-saeng",
      "meaningVn": "học sinh",
      "meaningEn": "student",
      "pos": "noun",
      "audioPath": "/audio/unit1/학생.mp3",
      "examples": [
        { "korean": "저는 학생이에요.", "meaningVn": "Tôi là học sinh." }
      ]
    }
  ],
  "grammar": [
    {
      "orderInUnit": 1,
      "pattern": "N은/는 N이에요/예요",
      "titleVn": "Câu khẳng định: N là N",
      "explanationVn": "Dùng để giới thiệu hoặc định nghĩa. Sau danh từ có âm cuối dùng 은/이에요, không có âm cuối dùng 는/예요.",
      "rule": "받침 O → 은 / 이에요 | 받침 X → 는 / 예요",
      "examples": [
        { "korean": "저는 유진이에요.", "meaningVn": "Tôi là Yujin." },
        { "korean": "나나 씨는 학생이에요.", "meaningVn": "Cô Nana là học sinh." }
      ],
      "exercises": [
        {
          "type": "fill_blank",
          "question": "저___ 학생이에요. (tôi)",
          "answer": "는"
        }
      ]
    }
  ]
}
```

---

## Design System

```css
/* Màu sắc — lấy cảm hứng từ bìa sách màu vàng 서울대 */
--color-primary:   #E8334A;   /* Đỏ Hàn Quốc — CTA, accent chính */
--color-secondary: #1B4FD8;   /* Xanh dương — grammar, link */
--color-accent:    #F5A623;   /* Vàng — màu bìa sách, streak */
--color-navy:      #0D1B4B;   /* Xanh đen — text chính */
--color-cream:     #FFF8F0;   /* Nền kem */
--color-success:   #10B981;   /* Xanh lá — đúng */
--color-gray:      #6B7280;   /* Xám — text phụ */

/* Font */
--font-kr:   'Noto Serif KR', serif;    /* Chữ Hàn */
--font-main: 'Be Vietnam Pro', sans;    /* Tiếng Việt */

/* Breakpoints — mobile first */
--bp-mobile:  375px
--bp-tablet:  768px
--bp-desktop: 1280px
```

### Components cần build

```
<FlashCard />           flip animation, front/back, audio button
<SrsRating />           3 nút: Khó / OK / Dễ
<AudioButton />         phát âm từ/câu
<GrammarCard />         pattern + rule + ví dụ
<ExerciseBlock />       fill_blank / multiple_choice / reorder
<ReviewSession />       full SRS session flow
<ProgressRing />        % hoàn thành từng unit
<StreakBadge />         streak counter
<ChatBubble />          user/AI messages
<HangeulGrid />         bảng tự/mẫu âm interactive
```

---

## Cấu trúc thư mục

```
/
├── app/
│   ├── page.tsx               # Dashboard
│   ├── hangeul/page.tsx
│   ├── vocabulary/
│   │   ├── page.tsx
│   │   └── [unit]/page.tsx
│   ├── grammar/
│   │   ├── page.tsx
│   │   └── [unit]/page.tsx
│   ├── review/page.tsx
│   ├── chat/page.tsx
│   ├── shadowing/page.tsx
│   ├── glossary/page.tsx
│   └── settings/page.tsx
│
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── FlashCard.tsx
│   ├── SrsRating.tsx
│   ├── AudioButton.tsx
│   ├── GrammarCard.tsx
│   ├── ReviewSession.tsx
│   └── ChatBubble.tsx
│
├── lib/
│   ├── gemini.ts              # Gemini AI client
│   ├── srs.ts                 # SM-2 algorithm
│   ├── prisma.ts              # Prisma client
│   └── audio.ts               # Audio utilities
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── data/                      # JSON seed files (từ PDF extract)
│   ├── hangeul.json
│   ├── unit1.json
│   ├── unit2.json
│   └── ...
│
├── scripts/
│   ├── extract-vocab.ts       # Gemini Vision extract PDF
│   └── seed.ts                # Import JSON vào DB
│
├── public/
│   └── audio/                 # MP3 files (hoặc dùng jsDelivr)
│       ├── unit1/
│       └── ...
│
└── .github/
    └── workflows/
        └── keep-alive.yml     # Ping Supabase mỗi 5 ngày
```

---

## Keep-alive Supabase (tránh pause)

```yaml
# .github/workflows/keep-alive.yml
name: Keep Supabase alive
on:
  schedule:
    - cron: '0 0 */5 * *'   # Mỗi 5 ngày
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -s "${{ secrets.SUPABASE_URL }}/rest/v1/books?select=id&limit=1" \
            -H "apikey: ${{ secrets.SUPABASE_ANON_KEY }}" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
DATABASE_URL=postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres
GEMINI_API_KEY=AIza...
```

---

## Nguồn tài nguyên

```
Sách gốc:       서울대 한국어 1A (PDF đã có)
Audio MP3:      twoponds.co.kr/en/snu (free download)
Font chữ Hàn:   fonts.google.com/specimen/Noto+Serif+KR
Font tiếng Việt: fonts.google.com/specimen/Be+Vietnam+Pro
Icons:          lucide.dev
AI:             aistudio.google.com (lấy GEMINI_API_KEY)
DB:             supabase.com hoặc neon.tech
Deploy:         vercel.com
```

---

*Cập nhật: 2026 · Stack: Next.js 14 + Supabase + Gemini 2.5 · Chi phí: $0/tháng*