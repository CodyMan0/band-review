"use client";

import { type CommentWithReplies } from "@/entities/comment/model/comment.interface";
import { getPartConfig } from "@/shared/config/parts";

interface TimelineMarkersProps {
  comments: CommentWithReplies[];
  duration: number;
  currentTime: number;
  onSeek: (seconds: number) => void;
}

export function TimelineMarkers({
  comments,
  duration,
  currentTime,
  onSeek,
}: TimelineMarkersProps) {
  if (duration <= 0 || comments.length === 0) return null;

  const progressPct = Math.min((currentTime / duration) * 100, 100);

  return (
    <div className="flex flex-col gap-1.5 px-5 py-3">
      {/* Timeline bar */}
      <div className="relative h-8 w-full">
        {/* Track background */}
        <div className="absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-muted" />

        {/* Progress */}
        <div
          className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-primary/30 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />

        {/* Comment markers */}
        {comments.map((comment) => {
          const pct = Math.min((comment.timestamp_sec / duration) * 100, 100);
          const partConfig = getPartConfig(comment.author_part);
          const replyCount = comment.replies.length;

          return (
            <button
              key={comment.id}
              onClick={() => onSeek(comment.timestamp_sec)}
              className="group absolute top-1/2 -translate-x-1/2 active:scale-110"
              style={{ left: `${pct}%` }}
              title={`${formatSec(comment.timestamp_sec)} - ${comment.author_name}: ${comment.content.slice(0, 30)}`}
            >
              {/* Dot — vertically centered on track */}
              <div
                className={`h-3 w-3 -translate-y-1/2 rounded-full border-2 border-background shadow-sm transition-transform group-hover:scale-125 ${partConfig.dot}`}
              />
              {/* Cluster badge — floats above the dot */}
              {replyCount > 0 && (
                <span className="absolute bottom-full left-1/2 mb-0.5 flex h-4 min-w-4 -translate-x-1/2 items-center justify-center rounded-full bg-foreground px-1 text-[9px] font-bold text-background">
                  {replyCount + 1}
                </span>
              )}
            </button>
          );
        })}

        {/* Playhead */}
        <div
          className="absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow transition-all duration-300"
          style={{ left: `${progressPct}%` }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground/60">
        <span>0:00</span>
        <span>{formatSec(duration)}</span>
      </div>
    </div>
  );
}

function formatSec(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
