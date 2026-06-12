"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Play, Mic, Square, Volume2 } from "lucide-react";
import { getSentences } from "@/lib/actions";
import { playAudio } from "@/lib/audio";
import { UNITS, UNITS_BY_SLUG } from "@/lib/units";

interface Sentence {
  korean: string;
  meaningVn: string;
  audioPath?: string | null;
}
const SPEEDS = [0.75, 1, 1.25];

export function ShadowingClient() {
  const searchParams = useSearchParams();
  const bookSlug = searchParams.get("book") ?? "snu-1a";
  const bookUnits = UNITS_BY_SLUG[bookSlug] ?? UNITS;
  const [unit, setUnit] = useState(1);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [speed, setSpeed] = useState(1);
  const [active, setActive] = useState<number | null>(null);

  // Ghi âm
  const [recording, setRecording] = useState(false);
  const [recordUrl, setRecordUrl] = useState<string | null>(null);
  const [recError, setRecError] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    getSentences(unit, bookSlug).then(setSentences);
  }, [unit]);

  const startRecording = async () => {
    setRecError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        if (recordUrl) URL.revokeObjectURL(recordUrl);
        setRecordUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      setRecError("Không truy cập được micro. Hãy cho phép quyền micro trong trình duyệt.");
    }
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    setRecording(false);
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) {
      setActive(null);
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    u.rate = speed;
    u.onend = () => setActive(null);
    window.speechSynthesis.speak(u);
  };

  const play = async (s: Sentence, i: number) => {
    setActive(i);
    // Thử MP3 trước; không phát được → TTS (áp dụng tốc độ đã chọn).
    const played = s.audioPath ? await playAudio(s.audioPath) : false;
    if (played) {
      // playAudio không báo khi kết thúc → bỏ trạng thái active sau 1 nhịp ngắn
      setTimeout(() => setActive(null), 400);
    } else {
      speak(s.korean);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={unit}
          onChange={(e) => setUnit(Number(e.target.value))}
          className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm"
        >
          {bookUnits.map((u) => (
            <option key={u.number} value={u.number}>
              Bài {u.number} — {u.titleKr}
            </option>
          ))}
        </select>
        <div className="flex gap-1">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                speed === s ? "bg-secondary text-white" : "bg-muted text-fg/70"
              }`}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Nghe và lặp lại theo từng câu. Tốc độ áp dụng cho giọng đọc TTS.
      </p>

      {/* Bộ ghi âm — luyện rồi nghe lại để tự so sánh */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
          >
            <Mic size={16} /> Ghi âm
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-white"
          >
            <Square size={16} className="fill-white" /> Dừng (đang ghi…)
          </button>
        )}

        {recordUrl && !recording && (
          <>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Volume2 size={15} /> Giọng của bạn:
            </span>
            <audio src={recordUrl} controls className="h-9" />
          </>
        )}
        {recError && <span className="text-sm text-danger">{recError}</span>}
        {!recordUrl && !recError && !recording && (
          <span className="text-sm text-gray-400">
            Nghe mẫu → bấm Ghi âm đọc theo → nghe lại để so sánh.
          </span>
        )}
      </div>

      <div className="space-y-2">
        {sentences.map((s, i) => (
          <button
            key={i}
            onClick={() => play(s, i)}
            className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
              active === i ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary"
            }`}
          >
            <Play size={18} className="shrink-0 text-primary" />
            <div>
              <p className="font-kr text-lg">{s.korean}</p>
              <p className="text-sm text-gray-500">{s.meaningVn}</p>
            </div>
          </button>
        ))}
        {sentences.length === 0 && (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-gray-500">
            Chưa có câu ví dụ cho bài này.
          </p>
        )}
      </div>
    </div>
  );
}
