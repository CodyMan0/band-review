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
    <div className="flex overflow-x-auto gap-1.5 no-scrollbar">
      {songs.map((song, index) => (
        <button
          key={song.id}
          onClick={() => onSeek(song.start_time_sec)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            isActive(index)
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {song.song_name} ({formatTimestamp(song.start_time_sec)})
        </button>
      ))}
    </div>
  );
}
