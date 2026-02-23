'use client';

import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion';
import { useCallback, useRef, useState } from 'react';

interface SwipeToDeleteProps {
  onDelete: () => void;
  children: React.ReactNode;
  className?: string;
  enabled?: boolean;
}

const DELETE_WIDTH = 72;
const VELOCITY_THRESHOLD = 300;
const OFFSET_THRESHOLD = -40;

export function SwipeToDelete({ onDelete, children, className, enabled = true }: SwipeToDeleteProps) {
  const x = useMotionValue(0);
  const [swiped, setSwiped] = useState(false);
  const iconScale = useTransform(x, [0, -DELETE_WIDTH], [0.5, 1]);
  const iconOpacity = useTransform(x, [0, -DELETE_WIDTH * 0.4, -DELETE_WIDTH], [0, 0.7, 1]);
  const containerRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(x, 'change', (latest) => {
    setSwiped(latest < -10);
  });

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const shouldOpen =
        info.offset.x < OFFSET_THRESHOLD || info.velocity.x < -VELOCITY_THRESHOLD;

      if (shouldOpen) {
        animate(x, -DELETE_WIDTH, { type: 'spring', stiffness: 400, damping: 30 });
      } else {
        animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
      }
    },
    [x],
  );

  const handleDeleteClick = useCallback(() => {
    animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    onDelete();
  }, [x, onDelete]);

  const close = useCallback(() => {
    animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
  }, [x]);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className ?? ''}`}>
      {/* Delete action area — right side behind content, z-[6] above overlay */}
      <motion.button
        onClick={handleDeleteClick}
        className="absolute inset-y-0 right-0 z-[6] flex w-[72px] items-center justify-center bg-red-500 text-white active:bg-red-600"
        style={{ opacity: iconOpacity }}
        aria-label="삭제"
      >
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{ scale: iconScale }}
        >
          <path
            d="M4 6H16M8 6V4.5C8 4.1 8.3 3.75 8.75 3.75H11.25C11.7 3.75 12 4.1 12 4.5V6M14 6V16C14 16.4 13.7 16.75 13.25 16.75H6.75C6.3 16.75 6 16.4 6 16V6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.button>

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -DELETE_WIDTH, right: 0 }}
        dragElastic={0.1}
        style={{ x, touchAction: 'pan-y' }}
        onDragEnd={handleDragEnd}
        className="relative z-10 bg-background"
      >
        {children}
      </motion.div>

      {/* Invisible overlay to close swipe when tapped elsewhere */}
      {swiped && (
        <div
          className="fixed inset-0 z-[5]"
          onPointerDown={close}
        />
      )}
    </div>
  );
}
