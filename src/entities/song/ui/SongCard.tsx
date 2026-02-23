'use client';

import { animate, motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';

import { type SongWithSessionCount } from '../model/song.interface';

interface SongCardProps {
  song: SongWithSessionCount;
  onDelete?: (songId: string) => void;
}

const SNAP_OPEN = -52;
const TRIGGER_THRESHOLD = -30;

export function SongCard({ song, onDelete }: SongCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const deleteScale = useTransform(x, [0, SNAP_OPEN], [0.6, 1]);
  const deleteOpacity = useTransform(x, [0, SNAP_OPEN * 0.5, SNAP_OPEN], [0, 0.6, 1]);
  const constraintsRef = useRef(null);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDragging(false);
    if (info.offset.x < TRIGGER_THRESHOLD) {
      animate(x, SNAP_OPEN, { type: 'spring', stiffness: 500, damping: 35 });
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 35 });
    }
  };

  const handleDelete = () => {
    animate(x, 0, { type: 'spring', stiffness: 500, damping: 35 });
    onDelete?.(song.id);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isDragging || x.get() < -10) {
      e.preventDefault();
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 35 });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl" ref={constraintsRef}>
      {/* Delete action behind */}
      {onDelete && (
        <motion.div
          className="absolute inset-y-0 right-0 flex w-[52px] items-center justify-center"
          style={{ opacity: deleteOpacity }}
        >
          <button
            onClick={handleDelete}
            className="flex h-full w-full items-center justify-center rounded-r-xl bg-destructive text-white active:bg-destructive/80"
          >
            <motion.div style={{ scale: deleteScale }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 5H15M7 5V3.5C7 3.1 7.3 2.75 7.75 2.75H10.25C10.7 2.75 11 3.1 11 3.5V5M13.5 5V14.5C13.5 14.9 13.2 15.25 12.75 15.25H5.25C4.8 15.25 4.5 14.9 4.5 14.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </button>
        </motion.div>
      )}

      {/* Swipeable card */}
      <motion.div
        drag={onDelete ? 'x' : false}
        dragConstraints={{ left: SNAP_OPEN, right: 0 }}
        dragElastic={0.08}
        style={{ x }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className="relative z-10"
      >
        <Link href={`/song/${song.id}`} onClick={handleClick} className="block">
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 transition-colors duration-150 active:bg-accent/50">
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{song.name}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {song.session_count}회 연주
              </span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-muted-foreground/40">
                <path
                  d="M5 2.5L9.5 7L5 11.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
