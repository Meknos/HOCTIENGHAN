// SM-2 Spaced Repetition algorithm.

export type Grade = 0 | 1 | 2 | 3 | 4 | 5;
// 0-2: Khó (lặp lại sớm) · 3: OK · 4-5: Dễ

export interface SrsState {
  easeFactor: number;
  interval: number;
  repetitions: number;
}

export interface SrsResult extends SrsState {
  nextReviewAt: Date;
}

export function calcNextReview(card: SrsState, grade: Grade): SrsResult {
  let { easeFactor, interval, repetitions } = card;

  if (grade < 3) {
    // Quên → reset
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  }

  // Cập nhật ease factor (kẹp sàn 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)
  );

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return { easeFactor, interval, repetitions, nextReviewAt };
}

/** Map 3 nút UI (Khó/OK/Dễ) → grade SM-2. */
export const RATING_TO_GRADE = { hard: 1, ok: 3, easy: 5 } as const;
export type Rating = keyof typeof RATING_TO_GRADE;
