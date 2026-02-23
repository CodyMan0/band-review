'use client';

import Link from 'next/link';
import { useCallback, useRef } from 'react';

import { SwipeToDelete } from '@/shared/ui';

import { type SongWithSessionCount } from '../model/song.interface';

interface SongCardProps {
  song: SongWithSessionCount;
  onDelete?: (songId: string) => void;
}

export function SongCard({ song, onDelete }: SongCardProps) {
  const isDraggingRef = useRef(false);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
    }
  }, []);

  const card = (
    <Link
      href={`/song/${song.id}`}
      onClick={handleClick}
      className="block"
      onPointerDown={() => { isDraggingRef.current = false; }}
      onPointerMove={() => { isDraggingRef.current = true; }}
    >
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-colors duration-150 active:bg-accent/50">
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium">{song.name}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {song.session_count}회 연주
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground/40">
            <path d="M5 2.5L9.5 7L5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );

  if (!onDelete) return <div className="rounded-xl">{card}</div>;

  return (
    <SwipeToDelete onDelete={() => onDelete(song.id)} className="rounded-xl">
      {card}
    </SwipeToDelete>
  );
}
