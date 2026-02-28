'use client';

import { formatTimestamp } from '@/shared/lib/format-time';

import { type SessionSongWithName } from '../model/song.interface';

interface SongTimelineProps {
  songs: SessionSongWithName[];
  onSeek: (seconds: number) => void;
  currentTime: number;
}

export function SongTimeline({ songs, onSeek, currentTime }: SongTimelineProps) {
  if (songs.length === 0) return null;

  const isActive = (index: number): boolean => {
    const song = songs[index];
    const nextSong = songs[index + 1];

    if (currentTime < song.start_time_sec) return false;
    if (!nextSong) return true;
    return currentTime < nextSong.start_time_sec;
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {songs.map((song, index) => (
        <button
          key={song.id}
          onClick={() => onSeek(song.start_time_sec)}
          className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-medium transition-all active:scale-95 ${
            isActive(index)
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted-foreground/15'
          }`}
        >
          {song.song_name}
          <span className="ml-1 opacity-70">{formatTimestamp(song.start_time_sec)}</span>
        </button>
      ))}
    </div>
  );
}
