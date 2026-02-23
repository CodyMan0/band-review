'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { type SongSessionInfo } from '@/entities/song/model/song.interface';
import { deleteSong } from '@/features/delete-song/action/delete-song';
import { formatTimestamp } from '@/shared/lib/format-time';
import { BottomSheet, Button } from '@/shared/ui';

interface Props {
  song: { id: string; name: string };
  sessions: SongSessionInfo[];
}

export function SongDetailClient({ song, sessions }: Props) {
  const router = useRouter();
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const result = await deleteSong(song.id);
    setIsDeleting(false);

    if (result.error) {
      setDeleteError(result.error);
      return;
    }
    router.push('/');
  };

  const handleDeleteClose = () => {
    setShowDelete(false);
    setDeleteError('');
  };

  return (
    <div className="flex flex-1 flex-col overflow-x-hidden pb-20">
      {/* Back button */}
      <div className="flex items-center justify-between px-2 py-3">
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
        <button
          onClick={() => { setDeleteError(''); setShowDelete(true); }}
          className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive active:scale-95"
          aria-label="곡 삭제"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 5H15M7 5V3.5C7 3.1 7.3 2.75 7.75 2.75H10.25C10.7 2.75 11 3.1 11 3.5V5M13.5 5V14.5C13.5 14.9 13.2 15.25 12.75 15.25H5.25C4.8 15.25 4.5 14.9 4.5 14.5V5" />
          </svg>
        </button>
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

      {/* Delete confirmation */}
      <BottomSheet open={showDelete && !deleteError} onOpenChange={(open) => { if (!open) handleDeleteClose(); }}>
        <div className="flex flex-col items-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7H24M10 7V5C10 4.2 10.6 3.5 11.5 3.5H16.5C17.4 3.5 18 4.2 18 5V7M21 7V23C21 23.8 20.4 24.5 19.5 24.5H8.5C7.6 24.5 7 23.8 7 23V7" />
            </svg>
          </div>
          <p className="mt-3 text-base font-semibold">곡을 삭제할까요?</p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            &quot;{song.name}&quot;을(를) 삭제하면 복구할 수 없어요
          </p>
          <div className="mt-5 flex w-full gap-2">
            <Button
              onClick={handleDeleteClose}
              variant="outline"
              className="h-11 flex-1 rounded-xl text-sm"
            >
              취소
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="destructive"
              disabled={isDeleting}
              className="h-11 flex-1 rounded-xl text-sm font-semibold"
            >
              {isDeleting ? '삭제 중...' : '삭제하기'}
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Delete error */}
      <BottomSheet open={showDelete && !!deleteError} onOpenChange={(open) => { if (!open) handleDeleteClose(); }}>
        <div className="flex flex-col items-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 10V16M14 20H14.01M3.5 22.5H24.5L14 4L3.5 22.5Z" />
            </svg>
          </div>
          <p className="mt-3 text-base font-semibold">삭제할 수 없어요</p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {deleteError}
          </p>
          <Button
            onClick={handleDeleteClose}
            className="mt-5 h-11 w-full rounded-xl text-sm font-semibold"
          >
            확인
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
