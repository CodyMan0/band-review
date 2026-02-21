'use client';

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface YTPlayer {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  destroy?: () => void;
}

interface YTEvent {
  target: YTPlayer;
}

interface YTWindow {
  YT?: {
    Player: new (
      elementId: string,
      config: {
        videoId: string;
        playerVars: Record<string, number>;
        events: { onReady: (event: YTEvent) => void };
      },
    ) => YTPlayer;
  };
  onYouTubeIframeAPIReady?: () => void;
}

export interface VideoPlayerRef {
  getCurrentTime: () => number;
  getDuration: () => number;
  seekTo: (seconds: number) => void;
}

interface VideoPlayerProps {
  videoUrl: string;
  videoType: 'youtube' | 'upload';
  onTimeUpdate?: (currentTime: number) => void;
}

function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^?\s]+)/,
    /(?:youtube\.com\/embed\/)([^?\s]+)/,
    /(?:youtube\.com\/shorts\/)([^?\s]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function getYTWindow(): YTWindow {
  return window as unknown as YTWindow;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  function VideoPlayer({ videoUrl, videoType, onTimeUpdate }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [ytPlayer, setYtPlayer] = useState<YTPlayer | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // YouTube API setup
    useEffect(() => {
      if (videoType !== 'youtube') return;

      const videoId = extractYoutubeId(videoUrl);
      if (!videoId) return;

      const ytWin = getYTWindow();

      // Load YouTube IFrame API
      if (!ytWin.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }

      const initPlayer = () => {
        const yt = getYTWindow().YT;
        if (!yt) return;
        new yt.Player('yt-player', {
          videoId,
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event: YTEvent) => setYtPlayer(event.target),
          },
        });
      };

      if (ytWin.YT?.Player) {
        initPlayer();
      } else {
        ytWin.onYouTubeIframeAPIReady = initPlayer;
      }

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [videoUrl, videoType]);

    // YouTube time tracking
    useEffect(() => {
      if (!ytPlayer || !onTimeUpdate) return;

      intervalRef.current = setInterval(() => {
        try {
          const time = ytPlayer.getCurrentTime?.();
          if (typeof time === 'number') onTimeUpdate(Math.floor(time));
        } catch {
          // player not ready
        }
      }, 500);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [ytPlayer, onTimeUpdate]);

    // HTML5 video time tracking
    const handleTimeUpdate = useCallback(() => {
      if (videoRef.current && onTimeUpdate) {
        onTimeUpdate(Math.floor(videoRef.current.currentTime));
      }
    }, [onTimeUpdate]);

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => {
        if (videoType === 'youtube' && ytPlayer) {
          try {
            return Math.floor(ytPlayer.getCurrentTime() || 0);
          } catch {
            return 0;
          }
        }
        return Math.floor(videoRef.current?.currentTime || 0);
      },
      getDuration: () => {
        if (videoType === 'youtube' && ytPlayer) {
          try {
            return Math.floor(ytPlayer.getDuration() || 0);
          } catch {
            return 0;
          }
        }
        return Math.floor(videoRef.current?.duration || 0);
      },
      seekTo: (seconds: number) => {
        if (videoType === 'youtube' && ytPlayer) {
          try {
            ytPlayer.seekTo(seconds, true);
          } catch {
            // player not ready
          }
        } else if (videoRef.current) {
          videoRef.current.currentTime = seconds;
        }
      },
    }));

    if (videoType === 'youtube') {
      return (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
          <div id="yt-player" className="h-full w-full" />
        </div>
      );
    }

    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          onTimeUpdate={handleTimeUpdate}
          className="h-full w-full"
        />
      </div>
    );
  },
);
