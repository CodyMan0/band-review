'use client';

import { useActionState } from 'react';

import { createSession } from '@/features/create-session/action/create-session';
import { SongListInput } from '@/features/create-session-songs/ui/SongListInput';
import { getProfile } from '@/shared/config/profile';
import { Button, Input } from '@/shared/ui';

export function CreateSessionForm() {
  const [state, formAction, isPending] = useActionState(createSession, {});
  const profile = getProfile();

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          예배 이름
        </label>
        <Input
          id="title"
          name="title"
          placeholder="예: 2월 3주차 주일예배"
          required
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
          name="date"
          type="date"
          defaultValue={new Date().toISOString().split('T')[0]}
          required
          className="h-11 rounded-xl text-sm"
        />
      </div>

      {/* YouTube URL */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="video_url" className="text-sm font-medium">
          YouTube 링크
        </label>
        <p className="text-xs text-muted-foreground">일부 공개(Unlisted) 영상도 사용 가능해요</p>
        <Input
          id="video_url"
          name="video_url"
          placeholder="https://youtube.com/watch?v=..."
          required
          className="h-11 rounded-xl font-mono text-sm"
        />
      </div>

      {/* Songs (optional) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">
          곡 목록 <span className="text-xs text-muted-foreground font-normal">(선택)</span>
        </label>
        <SongListInput />
      </div>

      <input type="hidden" name="video_type" value="youtube" />
      <input type="hidden" name="church_id" value={profile?.churchId ?? ''} />
      <input type="hidden" name="created_by" value={profile?.name ?? ''} />

      {/* Error */}
      {state.error && (
        <p className="rounded-xl bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="h-12 w-full rounded-xl text-sm font-semibold active:scale-[0.98]"
      >
        {isPending ? '만드는 중...' : '세션 만들기'}
      </Button>
    </form>
  );
}
