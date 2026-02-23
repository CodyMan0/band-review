'use client';

import { useActionState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';

import { createSession } from '@/features/create-session/action/create-session';
import { SongListInput } from '@/features/create-session-songs/ui/SongListInput';
import { getProfile } from '@/shared/config/profile';
import { Button, Input } from '@/shared/ui';

interface SongField {
  name: string;
  startTime: string;
}

interface FormValues {
  title: string;
  date: string;
  video_url: string;
  songs: SongField[];
}

const DEFAULT_SONGS: SongField[] = Array.from({ length: 6 }, () => ({ name: '', startTime: '' }));

function parseTimeToSeconds(time: string): number {
  const parts = time.split(':');
  if (parts.length !== 2) return 0;
  return (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
}

export function CreateSessionForm() {
  const [state, formAction, isPending] = useActionState(createSession, {});
  const profile = getProfile();

  const { register, control, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      title: '',
      date: new Date().toISOString().split('T')[0],
      video_url: '',
      songs: DEFAULT_SONGS,
    },
    mode: 'onChange',
  });

  const fieldArray = useFieldArray({ control, name: 'songs' });

  // Watch all fields for submit button state
  const watchTitle = useWatch({ control, name: 'title' });
  const watchUrl = useWatch({ control, name: 'video_url' });
  const watchSongs = useWatch({ control, name: 'songs' });

  // Check if at least one song row is fully filled
  const hasValidSong = watchSongs.some((s) => s.name.trim() && s.startTime.trim());
  // Check no partial rows (one filled, other empty)
  const hasPartialRow = watchSongs.some((s) => {
    const hasName = !!s.name.trim();
    const hasTime = !!s.startTime.trim();
    return (hasName && !hasTime) || (!hasName && hasTime);
  });

  const isFormReady = !!watchTitle?.trim() && !!watchUrl?.trim() && hasValidSong && !hasPartialRow;

  // Build songs JSON for the hidden input
  const songsJson = JSON.stringify(
    watchSongs
      .filter((s) => s.name.trim() && s.startTime.trim())
      .map((s) => ({ name: s.name.trim(), startTimeSec: parseTimeToSeconds(s.startTime) }))
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">예배 이름</label>
        <Input
          id="title"
          {...register('title', { required: true })}
          placeholder="예: 2월 3주차 주일예배"
          className="h-11 rounded-xl text-sm"
        />
      </div>

      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="date" className="text-sm font-medium">예배 날짜</label>
        <Input
          id="date"
          {...register('date', { required: true })}
          type="date"
          className="h-11 rounded-xl text-sm"
        />
      </div>

      {/* YouTube URL */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="video_url" className="text-sm font-medium">YouTube 링크</label>
        <p className="text-xs text-muted-foreground">일부 공개(Unlisted) 영상도 사용 가능해요</p>
        <Input
          id="video_url"
          {...register('video_url', { required: true })}
          placeholder="https://youtube.com/watch?v=..."
          className="h-11 rounded-xl font-mono text-sm"
        />
      </div>

      {/* Songs */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">곡 목록</label>
        <p className="text-xs text-muted-foreground">곡명과 시작 시간을 입력해주세요</p>
        <p className="info-banner">띄어쓰기는 자동 제거돼요 — 같은 곡이 다르게 분류되지 않아요</p>
        <SongListInput
          control={control}
          register={register}
          fieldArray={fieldArray}
          watchSongs={watchSongs}
        />
      </div>

      {/* Hidden fields for server action */}
      <input type="hidden" name="video_type" value="youtube" />
      <input type="hidden" name="church_id" value={profile?.churchId ?? ''} />
      <input type="hidden" name="created_by" value={profile?.name ?? ''} />
      <input type="hidden" name="songs_json" value={songsJson} />

      {/* Error */}
      {state.error && (
        <p className="rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending || !isFormReady}
        className="h-12 w-full rounded-xl text-sm font-semibold active:scale-[0.98]"
      >
        {isPending ? '만드는 중...' : '세션 만들기'}
      </Button>
    </form>
  );
}
