'use client';

import { getPartConfig } from '@/shared/config/parts';
import { formatTimestamp } from '@/shared/lib/format-time';

import { type Praise } from '../model/praise.interface';

interface PraiseListProps {
  praises: Praise[];
  onSeek: (seconds: number) => void;
}

export function PraiseList({ praises, onSeek }: PraiseListProps) {
  if (praises.length === 0) {
    return (
      <div className="flex flex-col items-center py-8">
        <p className="text-sm text-muted-foreground">아직 칭찬이 없어요</p>
        <p className="mt-0.5 text-xs text-muted-foreground">👏 버튼으로 잘한 부분을 칭찬해보세요</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {praises.map((praise) => {
        const partConfig = getPartConfig(praise.author_part);
        return (
          <div key={praise.id} className="flex items-start gap-3 border-b border-border/60 py-3 last:border-b-0">
            <div className="flex flex-col items-center pt-0.5 shrink-0">
              <span className="text-base">👏</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${partConfig.color}`}>
                  <span>{partConfig.emoji}</span>
                  <span>{praise.author_name}</span>
                </span>
                <button
                  onClick={() => onSeek(praise.timestamp_sec)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/8 border border-primary/20 px-2.5 py-0.5 font-mono text-xs font-medium text-primary hover:bg-primary/15 active:scale-95 transition-all"
                  title="이 시점으로 이동"
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor" className="opacity-70">
                    <polygon points="1,0.5 8,4.5 1,8.5" />
                  </svg>
                  {formatTimestamp(praise.timestamp_sec)}
                </button>
              </div>
              <p className="text-sm leading-relaxed text-foreground/90">{praise.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
