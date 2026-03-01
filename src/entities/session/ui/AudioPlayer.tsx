'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { formatTimestamp } from '@/shared/lib/format-time';

export interface AudioPlayerRef {
  getAudioElement: () => HTMLAudioElement | null;
}

interface AudioPlayerProps {
  audioUrl: string;
}

export const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  function AudioPlayer({ audioUrl }, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useImperativeHandle(ref, () => ({
      getAudioElement: () => audioRef.current,
    }));

    const togglePlay = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }, []);

    const handleTimeUpdate = useCallback(() => {
      const audio = audioRef.current;
      if (audio) setCurrentTime(audio.currentTime);
    }, []);

    const handleLoadedMetadata = useCallback(() => {
      const audio = audioRef.current;
      if (audio) setDuration(audio.duration);
    }, []);

    const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = Number(e.target.value);
      }
    }, []);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      const onEnded = () => setIsPlaying(false);

      audio.addEventListener('play', onPlay);
      audio.addEventListener('pause', onPause);
      audio.addEventListener('ended', onEnded);

      return () => {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPause);
        audio.removeEventListener('ended', onEnded);
      };
    }, []);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-all active:scale-95"
          aria-label={isPlaying ? '일시정지' : '재생'}
        >
          {isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <rect x="2" y="1" width="3.5" height="12" rx="1" />
              <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <path d="M3 1.5v11l9.5-5.5z" />
            </svg>
          )}
        </button>

        {/* Time + Seekbar */}
        <div className="flex flex-1 flex-col gap-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-border [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground"
            style={{
              background: `linear-gradient(to right, hsl(var(--foreground)) ${progress}%, hsl(var(--border)) ${progress}%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{formatTimestamp(Math.floor(currentTime))}</span>
            <span>{formatTimestamp(Math.floor(duration))}</span>
          </div>
        </div>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          crossOrigin="anonymous"
        />
      </div>
    );
  },
);
