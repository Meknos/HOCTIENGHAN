"use client";

let current: HTMLAudioElement | null = null;

/**
 * Phát 1 file audio. Dừng audio đang phát trước đó.
 * Trả về `true` nếu phát được, `false` nếu lỗi/404 (để caller fallback TTS).
 */
export function playAudio(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (!src) return resolve(false);
    let done = false;
    const finish = (ok: boolean) => {
      if (!done) {
        done = true;
        resolve(ok);
      }
    };
    try {
      current?.pause();
      const audio = new Audio(src);
      current = audio;
      audio.onplaying = () => finish(true); // bắt đầu phát được
      audio.onerror = () => finish(false); // 404 / không tải được
      audio.play().catch(() => finish(false));
    } catch {
      finish(false);
    }
  });
}

/** Text-to-speech tiếng Hàn fallback khi chưa có file MP3. */
export function speakKorean(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ko-KR";
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}
