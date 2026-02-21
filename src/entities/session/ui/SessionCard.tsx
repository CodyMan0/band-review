'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { type SessionWithCommentCount } from '../model/session.interface';

interface SessionCardProps {
  session: SessionWithCommentCount;
  onDelete?: (sessionId: string) => void;
}

const DELETE_THRESHOLD = -80;

export function SessionCard({ session, onDelete }: SessionCardProps) {
  const sessionDate = new Date(session.date);
  const dateStr = format(sessionDate, 'M월 d일 (EEE)', { locale: ko });
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const deleteOpacity = useTransform(x, [-100, -60, 0], [1, 0.5, 0]);
  const constraintsRef = useRef(null);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.x < DELETE_THRESHOLD) {
      // Snap to show delete button
      x.set(-80);
    } else {
      x.set(0);
    }
  };

  const handleDelete = () => {
    onDelete?.(session.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || x.get() < -10) {
      e.preventDefault();
      x.set(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl" ref={constraintsRef}>
      {/* Delete button behind */}
      <motion.div
        className="absolute inset-y-0 right-0 flex w-20 items-center justify-center rounded-r-xl bg-destructive"
        style={{ opacity: deleteOpacity }}
      >
        <button
          onClick={handleDelete}
          className="flex h-full w-full items-center justify-center text-white"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5H17M8 5V3C8 2.45 8.45 2 9 2H11C11.55 2 12 2.45 12 3V5M15 5V17C15 17.55 14.55 18 14 18H6C5.45 18 5 17.55 5 17V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </motion.div>

      {/* Swipeable card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={0.1}
        style={{ x }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        <Link href={`/session/${session.id}`} onClick={handleClick} className="group block">
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3.5 transition-all duration-150 active:scale-[0.98] active:bg-accent/50">
            {/* Left: info */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-[15px] font-semibold leading-snug">{session.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {dateStr}
                {session.created_by && <span> · {session.created_by}</span>}
              </p>
            </div>

            {/* Right: counts + chevron */}
            <div className="flex shrink-0 items-center gap-1.5">
              {session.comment_count > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  피드백 {session.comment_count}
                </span>
              )}
              {session.praise_count > 0 && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-600">
                  칭찬 {session.praise_count}
                </span>
              )}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground/40">
                <path d="M5 2.5L9.5 7L5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
