'use client';

import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

export interface AudioPlayerRef {
  getAudioElement: () => HTMLAudioElement | null;
}

interface AudioPlayerProps {
  audioUrl: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(
  function AudioPlayer({ audioUrl, onTimeUpdate: onTimeUpdateProp }, ref) {
    const audioRef = useRef<HTMLAudioElement>(null);

    useImperativeHandle(ref, () => ({
      getAudioElement: () => audioRef.current,
    }));

    const handleTimeUpdate = useCallback(() => {
      const audio = audioRef.current;
      if (!audio) return;
      onTimeUpdateProp?.(Math.floor(audio.currentTime), Math.floor(audio.duration || 0));
    }, [onTimeUpdateProp]);

    return (
      <audio
        ref={audioRef}
        src={audioUrl}
        controls
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        crossOrigin="anonymous"
        className="w-full"
      />
    );
  },
);
