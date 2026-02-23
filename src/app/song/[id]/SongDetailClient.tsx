'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';

import { type SongSessionInfo } from '@/entities/song/model/song.interface';
import { formatTimestamp } from '@/shared/lib/format-time';

interface Props {
  song: { id: string; name: string };
  sessions: SongSessionInfo[];
}

export function SongDetailClient({ song, sessions }: Props) {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden pb-20">
      {/* Back button */}
      <div className="px-2 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground active:opacity-60"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8L10 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          목록
        </Link>
      </div>

      {/* Song header */}
      <div className="px-5 pb-3">
        <h1 className="text-[22px] font-bold leading-snug">{song.name}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          총 {sessions.length}회 연주
        </p>
      </div>

      {/* Divider */}
      <div className="mx-5 my-4 h-px bg-border" />

      {/* Section header */}
      <p className="px-5 text-base font-bold">이 곡을 연주한 예배</p>

      {/* Session list */}
      <div className="mt-3 flex flex-col gap-2 px-5">
        {sessions.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            아직 이 곡을 연주한 예배가 없어요
          </p>
        ) : (
          sessions.map((s) => (
            <Link
              key={s.session_id}
              href={`/session/${s.session_id}?t=${s.start_time_sec}`}
              className="flex items-center justify-between rounded-xl border px-4 py-3 active:opacity-70"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{s.session_title}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(s.session_date), 'M월 d일 (EEE)', { locale: ko })}
                </span>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {formatTimestamp(s.start_time_sec)}부터
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
