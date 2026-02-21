"use client";

import { getPartConfig } from "@/shared/config/parts";
import { formatTimestamp } from "@/shared/lib/format-time";

import { type Praise } from "../model/praise.interface";

interface PraiseListProps {
  praises: Praise[];
  onSeek: (seconds: number) => void;
  highlightedId?: string | null;
}

export function PraiseList({ praises, onSeek, highlightedId }: PraiseListProps) {
  if (praises.length === 0) {
    return (
      <div className="flex flex-col items-center py-8">
        <p className="text-sm text-muted-foreground">아직 칭찬이 없어요</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          👏 버튼으로 잘한 부분을 칭찬해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {praises.map((praise) => {
        const authorConfig = getPartConfig(praise.author_part);
        const targetConfig = getPartConfig(praise.target_part);
        return (
          <div
            key={praise.id}
            id={`item-${praise.id}`}
            className={`flex items-start gap-3 border-b border-border/60 py-3 last:border-b-0 rounded-lg ${highlightedId === praise.id ? "flash-highlight" : ""}`}
          >
            <div className="flex shrink-0 flex-col items-center pt-0.5">
              <span className="text-base">👏</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                {/* Author */}
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${authorConfig.color}`}
                >
                  <span>{authorConfig.emoji}</span>
                  <span>{praise.author_name}</span>
                </span>
                {/* Arrow */}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="text-muted-foreground/50"
                >
                  <path d="M4 6H8M8 6L6 4M8 6L6 8" />
                </svg>
                {/* Target part */}
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${targetConfig.color}`}
                >
                  <span>{targetConfig.emoji}</span>
                  <span>{targetConfig.label}</span>
                </span>
                {/* Timestamp */}
                <button
                  onClick={() => onSeek(praise.timestamp_sec)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/8 border border-primary/20 px-2.5 py-0.5 font-mono text-xs font-medium text-primary hover:bg-primary/15 active:scale-95 transition-all"
                  title="이 시점으로 이동"
                >
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 9 9"
                    fill="currentColor"
                    className="opacity-70"
                  >
                    <polygon points="1,0.5 8,4.5 1,8.5" />
                  </svg>
                  {formatTimestamp(praise.timestamp_sec)}
                </button>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">
                {praise.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
