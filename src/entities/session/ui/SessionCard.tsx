import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import Link from 'next/link';

import { type SessionWithCommentCount } from '../model/session.interface';

interface SessionCardProps {
  session: SessionWithCommentCount;
}

export function SessionCard({ session }: SessionCardProps) {
  const sessionDate = new Date(session.date);
  const dateStr = format(sessionDate, 'M월 d일 (EEE)', { locale: ko });

  return (
    <Link href={`/session/${session.id}`} className="group block">
      <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3.5 transition-all duration-150 active:scale-[0.98] active:bg-accent/50">
        {/* Left: info */}
        <div className="flex-1 min-w-0">
          <p className="truncate text-[15px] font-semibold leading-snug">{session.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{dateStr}</p>
        </div>

        {/* Right: comment count + chevron */}
        <div className="flex shrink-0 items-center gap-2">
          {session.comment_count > 0 && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              {session.comment_count}
            </span>
          )}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground/40">
            <path d="M5 2.5L9.5 7L5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
