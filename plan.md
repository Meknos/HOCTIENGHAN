# PLAN — Web Học Tiếng Hàn 서울대 1A

> **Scope:** 1 người dùng · Nội bộ · Deploy Vercel · $0/tháng  
> **Stack:** Next.js 14 · Supabase · Gemini 2.0 Flash · Tailwind · Prisma

---

## Tổng quan 5 phases

| Phase | Nội dung | Thời gian ước tính |
|-------|----------|-------------------|
| 1 | Setup & Nền tảng | Tuần 1–2 |
| 2 | Nhập liệu từ PDF sách | Tuần 2–3 |
| 3 | Module học cốt lõi | Tuần 3–5 |
| 4 | AI Features (Gemini) | Tuần 5–6 |
| 5 | Tính năng thêm | Tuần 7+ |

---

## Phase 1 — Setup & Nền tảng

### 1.1 Khởi tạo dự án
- [ ] `npx create-next-app@latest --typescript --tailwind --app`
- [ ] Cài shadcn/ui: `npx shadcn-ui@latest init`
- [ ] Cài Prisma: `npm install prisma @prisma/client`
- [ ] Cài Zustand: `npm install zustand`
- [ ] Cài Gemini SDK: `npm install @google/generative-ai`
- [ ] Tạo repo GitHub + push code
- [ ] Connect Vercel với GitHub repo
- [ ] Setup `.env.local` (Supabase URL + anon key + Gemini key)

### 1.2 Database
- [ ] Tạo project Supabase (hoặc Neon.tech nếu ngại pause)
- [ ] Copy `schema.prisma` từ PROJECT.md vào project
- [ ] `npx prisma migrate dev --name init`
- [ ] `npx prisma generate`
- [ ] Test kết nối: `npx prisma studio`

### 1.3 Layout & Navigation
- [ ] Sidebar trái: danh sách unit 1–8 + 한글 배우기
- [ ] Topbar: tên trang hiện tại + streak badge
- [ ] Layout responsive: mobile (375px) + desktop (1280px)
- [ ] Dark mode (CSS variables, Tailwind `dark:`)
- [ ] Font: load `Noto Serif KR` + `Be Vietnam Pro` từ Google Fonts

### 1.4 GitHub Actions keep-alive
- [ ] Tạo `.github/workflows/keep-alive.yml`
- [ ] Add secrets: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- [ ] Test chạy thủ công (`workflow_dispatch`)

**Kết quả Phase 1:** Project chạy được trên localhost + Vercel, DB có schema, sidebar hiện đủ unit.

---

## Phase 2 — Nhập Liệu từ PDF Sách

> Đây là phase quan trọng nhất. Không có data → không có gì để học.

### 2.1 Script extract từ PDF

- [ ] Cài pdftoppm: `sudo apt install poppler-utils` (hoặc dùng môi trường có sẵn)
- [ ] Rasterize tất cả trang cần thiết:
  ```bash
  pdftoppm -jpeg -r 150 -f 25 -l 262 book.pdf /tmp/pages/page
  ```
- [ ] Tạo script `scripts/extract-vocab.ts` dùng Gemini Vision
- [ ] Tạo script `scripts/extract-grammar.ts` dùng Gemini Vision
- [ ] Tạo script `scripts/seed.ts` import JSON → Supabase

### 2.2 Extract & review nội dung

- [ ] **한글 배우기**: 자음 (21) + 모음 (21) + 받침 + quy tắc phát âm
- [ ] **Bài 1** — 안녕하세요?: từ vựng + 3 điểm ngữ pháp + ví dụ
- [ ] **Bài 2** — 이게 뭐예요?: từ vựng + 5 điểm ngữ pháp + ví dụ
- [ ] **Bài 3** — 여기가 어디예요?: từ vựng + 4 điểm ngữ pháp
- [ ] **Bài 4** — 전화번호가 뭐예요?: từ vựng + 4 điểm ngữ pháp
- [ ] **Bài 5** — 주말에 친구를 만났어요: từ vựng + 3 điểm ngữ pháp
- [ ] **Bài 6** — 얼마예요?: từ vựng + 4 điểm ngữ pháp
- [ ] **Bài 7** — 날씨가 어떻습니까?: từ vựng + 4 điểm ngữ pháp
- [ ] **Bài 8** — 영화 볼까요?: từ vựng + 4 điểm ngữ pháp

### 2.3 Audio

- [ ] Download MP3 gốc từ twoponds.co.kr/en/snu
- [ ] Đặt vào `public/audio/unit{N}/` hoặc GitHub repo riêng + jsDelivr
- [ ] Map `audioPath` trong JSON seed data

**Kết quả Phase 2:** DB có đầy đủ từ vựng + ngữ pháp 8 bài, audio đã có.

---

## Phase 3 — Module Học Cốt Lõi

### 3.1 Module Từ Vựng (`/vocabulary/[unit]`)

- [ ] Trang chọn unit — grid 8 bài + tiến độ %
- [ ] **Study mode**: danh sách từ — Korean · phiên âm · nghĩa VN · nút audio
- [ ] **Flashcard mode**: lật card CSS 3D flip (mặt trước KR → mặt sau VN + ví dụ)
- [ ] **Quiz mode**: 4 lựa chọn (3 sai lấy random trong unit)
- [ ] Component `<AudioButton />`: click → play MP3
- [ ] Đánh dấu từ "đã biết" → lưu localStorage

### 3.2 Module Ngữ Pháp (`/grammar/[unit]`)

- [ ] Trang chọn unit — hiển thị các điểm ngữ pháp
- [ ] `<GrammarCard />`: pattern lớn + bảng chia + ví dụ câu
- [ ] Bài tập `fill_blank`: hiển thị câu hỏi → input → check đáp án
- [ ] Bài tập `multiple_choice`: 4 lựa chọn + hiển thị giải thích
- [ ] Nút "Hỏi AI" → gọi Gemini giải thích → modal

### 3.3 Module SRS — Ôn Tập (`/review`)

- [ ] Load `SrsCard` có `nextReviewAt <= now()` từ Supabase
- [ ] Hiển thị flashcard → user bấm "Lật"
- [ ] `<SrsRating />`: 3 nút — **Khó** (grade 1) · **OK** (grade 3) · **Dễ** (grade 5)
- [ ] Tính `calcNextReview()` → cập nhật DB
- [ ] Màn hình kết quả: số đúng/sai + ngày ôn tiếp
- [ ] Khi học từ mới → tự động tạo `SrsCard` với `nextReviewAt = now()`

### 3.4 Dashboard (`/`)

- [ ] Widget: số thẻ cần ôn hôm nay (query `SrsCard` due)
- [ ] Grid tiến độ 8 bài: `<ProgressRing />` (% từ đã học)
- [ ] `<StreakBadge />`: đếm ngày ôn liên tiếp từ bảng `Streak`
- [ ] Button "Bắt đầu ôn tập" → `/review`
- [ ] Gợi ý bài học tiếp theo

### 3.5 한글 배우기 (`/hangeul`)

- [ ] Bảng 자음 (phụ âm): click ô → nghe âm + xem từ ví dụ
- [ ] Bảng 모음 (nguyên âm): tương tự
- [ ] Phần 받침: quy tắc + ví dụ
- [ ] Mini quiz: nghe âm → chọn ký tự đúng

**Kết quả Phase 3:** Học được từ vựng, ngữ pháp, ôn tập SRS đầy đủ.

---

## Phase 4 — AI Features (Gemini 2.0 Flash)

### 4.1 AI Chat Tutor (`/chat`)

- [ ] Server action `chatWithAI(messages, currentUnit)`
- [ ] System prompt inject unit đang học + ngữ pháp đã qua
- [ ] Chat UI: bubble messages, markdown render, streaming response
- [ ] Lưu lịch sử chat vào localStorage (20 tin gần nhất)
- [ ] Nút "Hỏi về bài [N]" từ trang vocabulary/grammar → mở chat với context

### 4.2 AI Quiz Generator

- [ ] Server action `generateQuiz(vocab, unitVocabList)`
- [ ] Gọi Gemini tạo 3 đáp án sai cùng chủ đề
- [ ] Cache kết quả vào localStorage theo `vocab.id`
- [ ] Fallback: nếu cache miss → tạo random từ unit (không cần AI)

### 4.3 AI Grammar Explainer

- [ ] Server action `explainGrammar(pattern, question)`
- [ ] Nút "Hỏi AI" trong mỗi `<GrammarCard />`
- [ ] Modal hiển thị giải thích markdown từ Gemini
- [ ] Cache vào localStorage theo `grammar.id + question`

### 4.4 AI Writing Checker

- [ ] Input box trong trang grammar: "Viết câu với ngữ pháp này"
- [ ] Server action `checkWriting(sentence, grammar)`
- [ ] Gemini phân tích: đúng/sai + giải thích + câu đúng
- [ ] Highlight lỗi màu đỏ, phần đúng màu xanh

**Kết quả Phase 4:** Có AI tutor, AI quiz, AI giải thích ngữ pháp.

---

## Phase 5 — Tính Năng Thêm

> Làm sau khi Phase 1–4 ổn định. Thứ tự tùy nhu cầu.

### 5.1 Shadowing (`/shadowing`)
- [ ] Upload audio track + transcript JSON (timestamp từng câu)
- [ ] Player: highlight câu theo thời gian thực
- [ ] Speed control: 0.75× / 1× / 1.25×
- [ ] Ghi âm giọng người dùng (Web Audio API) để so sánh

### 5.2 Glossary (`/glossary`)
- [ ] Search toàn bộ từ vựng (debounced input)
- [ ] Filter theo unit, part of speech
- [ ] Link đến bài học chứa từ đó

### 5.3 PWA
- [ ] `next-pwa` config
- [ ] Service worker cache từ vựng + grammar đã load
- [ ] Manifest: icon, theme color, `display: standalone`
- [ ] Swipe gesture cho flashcard (mobile)

### 5.4 Mở rộng nội dung
- [ ] Nhập phụ lục: `어휘 색인` (bảng tra từ toàn bộ)
- [ ] Nhập `문법 해설` (Grammar Extension chi tiết)
- [ ] Mở rộng sang **서울대 한국어 1B**

### 5.5 Settings (`/settings`)
- [ ] Reset tiến độ SRS (1 unit hoặc toàn bộ)
- [ ] Export data (JSON backup)
- [ ] Xem thống kê: tổng từ đã học, tổng thẻ đã ôn, accuracy %

---

## Checklist Components

### UI Components
- [ ] `<FlashCard />` — CSS 3D flip, front/back, audio
- [ ] `<SrsRating />` — 3 nút Khó/OK/Dễ
- [ ] `<AudioButton />` — icon speaker, click play
- [ ] `<GrammarCard />` — pattern + rule + examples
- [ ] `<ExerciseBlock />` — fill_blank / multiple_choice
- [ ] `<ReviewSession />` — full SRS flow wrapper
- [ ] `<ProgressRing />` — SVG circle progress
- [ ] `<StreakBadge />` — ngọn lửa + số ngày
- [ ] `<ChatBubble />` — user/AI message
- [ ] `<HangeulGrid />` — bảng tự/mẫu âm
- [ ] `<Skeleton />` — loading states

### Server Actions / API
- [ ] `getVocabByUnit(unitId)` — lấy từ vựng
- [ ] `getGrammarByUnit(unitId)` — lấy ngữ pháp
- [ ] `getDueCards()` — thẻ SRS cần ôn hôm nay
- [ ] `gradeCard(cardId, grade)` — cập nhật SRS
- [ ] `markVocabLearned(vocabId)` — tạo SrsCard mới
- [ ] `getProgress()` — tiến độ toàn bộ
- [ ] `updateStreak()` — cập nhật streak hàng ngày
- [ ] `chatWithAI(messages, unit)` — AI chat
- [ ] `generateQuiz(vocabId)` — AI quiz
- [ ] `explainGrammar(grammarId, question)` — AI explain
- [ ] `checkWriting(sentence, grammarId)` — AI check

---

## Môi trường & Deploy

### Lần đầu setup
```bash
# 1. Clone + install
git clone https://github.com/[user]/korean-web
cd korean-web
npm install

# 2. Setup env
cp .env.example .env.local
# Điền SUPABASE_URL, SUPABASE_ANON_KEY, DATABASE_URL, GEMINI_API_KEY

# 3. DB migration
npx prisma migrate dev
npx prisma generate

# 4. Seed data (sau khi extract PDF xong)
npx tsx scripts/seed.ts

# 5. Dev
npm run dev
```

### Deploy Vercel
```bash
# Kết nối repo GitHub với Vercel
# Add environment variables trong Vercel dashboard
# Auto deploy mỗi khi push lên main
```

### Lấy API key Gemini (free)
```
1. Vào aistudio.google.com
2. "Get API key" → "Create API key"
3. Copy vào GEMINI_API_KEY
4. Không cần thẻ ngân hàng
```

---

*Stack: Next.js 14 · Supabase · Gemini 2.0 Flash · Tailwind · Prisma · GitHub · Vercel*  
*Chi phí: $0/tháng · 1 người dùng · Nội bộ*