"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { SongListInput } from "@/features/create-session-songs/ui/SongListInput";
import { createSession } from "@/features/create-session/action/create-session";
import { getProfile } from "@/shared/config/profile";
import { convertToAac, needsConversion } from "@/shared/lib/convert-audio";
import { saveAudioUrl, uploadAudio } from "@/shared/lib/upload-audio";
import { Button, Input } from "@/shared/ui";

interface SongField {
  name: string;
  startTime: string;
}

interface FormValues {
  title: string;
  date: string;
  songs: SongField[];
}

const DEFAULT_SONGS: SongField[] = Array.from({ length: 6 }, () => ({
  name: "",
  startTime: "",
}));

function parseTimeToSeconds(time: string): number {
  const parts = time.split(":");
  if (parts.length !== 2) return 0;
  return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
}

export function CreateSessionForm() {
  const profile = getProfile();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioProgress, setAudioProgress] = useState<number | null>(null);
  const [audioStatus, setAudioStatus] = useState("");
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      title: "",
      date: new Date().toISOString().split("T")[0],
      songs: DEFAULT_SONGS,
    },
    mode: "onChange",
  });

  const fieldArray = useFieldArray({ control, name: "songs" });

  const watchTitle = useWatch({ control, name: "title" });
  const watchSongs = useWatch({ control, name: "songs" });

  const hasValidSong = watchSongs.some(
    (s) => s.name.trim() && s.startTime.trim(),
  );
  const hasPartialRow = watchSongs.some((s) => {
    const hasName = !!s.name.trim();
    const hasTime = !!s.startTime.trim();
    return (hasName && !hasTime) || (!hasName && hasTime);
  });

  const isFormReady = !!watchTitle?.trim() && hasValidSong && !hasPartialRow;

  const handleAudioFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setAudioFile(file);
      setAudioProgress(null);
      setAudioStatus(file ? `${file.name} 선택됨` : "");
    },
    [],
  );

  const onSubmit = handleSubmit((data) => {
    setError("");
    const formData = new FormData();
    formData.set("title", data.title);
    formData.set("date", data.date);
    formData.set("church_id", profile?.churchId ?? "");
    formData.set("created_by", profile?.name ?? "");
    // Flag to return session ID instead of redirect when audio needs uploading
    if (audioFile) formData.set("return_id", "true");
    formData.set(
      "songs_json",
      JSON.stringify(
        data.songs
          .filter((s) => s.name.trim() && s.startTime.trim())
          .map((s) => ({
            name: s.name.trim(),
            startTimeSec: parseTimeToSeconds(s.startTime),
          })),
      ),
    );

    startTransition(async () => {
      const result = await createSession({}, formData);
      if (result.error) {
        setError(result.error);
        return;
      }

      // If audio file exists and session was created, upload audio
      if (audioFile && result.sessionId) {
        try {
          let audioBlob: Blob;
          if (needsConversion(audioFile)) {
            setAudioStatus("경량화된 오디오 변환 중...");
            setAudioProgress(0);
            audioBlob = await convertToAac(audioFile, (ratio) =>
              setAudioProgress(ratio),
            );
          } else {
            audioBlob = audioFile;
          }

          setAudioStatus("업로드 중...");
          setAudioProgress(null);
          const audioUrl = await uploadAudio(result.sessionId, audioBlob);
          await saveAudioUrl(result.sessionId, audioUrl);

          // Navigate after upload complete
          window.location.href = `/session/${result.sessionId}`;
        } catch (e) {
          console.error("Audio upload error:", e);
          setError(
            `오디오 업로드에 실패했습니다: ${e instanceof Error ? e.message : String(e)}`,
          );
        }
      }
      // If no audio, createSession already called redirect()
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          예배 이름
        </label>
        <Input
          id="title"
          {...register("title", { required: true })}
          placeholder="예: 2월 3주차 주일예배"
          className="h-11 rounded-xl text-sm"
        />
      </div>

      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="date" className="text-sm font-medium">
          예배 날짜
        </label>
        <Input
          id="date"
          {...register("date", { required: true })}
          type="date"
          className="h-11 rounded-xl text-sm"
        />
      </div>

      {/* Audio file */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="audio_file" className="text-sm font-medium">
          오디오 파일
        </label>
        <p className="text-xs text-muted-foreground">
          악기별 EQ로 들으려면 오디오 파일을 첨부하세요
        </p>
        <input
          ref={audioInputRef}
          id="audio_file"
          type="file"
          accept=".wav,.mp3,.aac,.m4a,.mp4"
          onChange={handleAudioFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => audioInputRef.current?.click()}
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 text-sm text-muted-foreground transition-colors hover:bg-muted/50 active:scale-[0.98]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M8 3v10M3 8h10" />
          </svg>
          {audioFile ? audioFile.name : "오디오 파일 선택"}
        </button>
        {audioStatus && (
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{audioStatus}</p>
            {audioProgress !== null && (
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-foreground transition-all"
                  style={{ width: `${Math.round(audioProgress * 100)}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Songs */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">곡 목록</label>
        <p className="text-xs text-muted-foreground">
          곡명과 시작 시간을 입력해주세요
        </p>
        <p className="info-banner">
          띄어쓰기는 자동 제거돼요 — 같은 곡이 다르게 분류되지 않아요
        </p>
        <SongListInput
          control={control}
          register={register}
          fieldArray={fieldArray}
          watchSongs={watchSongs}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending || !isFormReady}
        className="h-12 w-full rounded-xl text-sm font-semibold active:scale-[0.98]"
      >
        {isPending ? "만드는 중..." : "세션 만들기"}
      </Button>
    </form>
  );
}
