'use client';

import Link from 'next/link';

import { type SongWithSessionCount } from '../model/song.interface';

interface SongCardProps {
  song: SongWithSessionCount;
}

export function SongCard({ song }: SongCardProps) {
  return (
    <Link href={`/song/${song.id}`} className="block">
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-all duration-150 active:scale-[0.98] active:bg-accent/50">
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-medium">{song.name}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {song.session_count}회 연주
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground/40">
            <path
              d="M5 2.5L9.5 7L5 11.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
