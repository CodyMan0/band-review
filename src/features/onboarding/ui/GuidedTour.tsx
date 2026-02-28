'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/shared/ui';

interface GuidedTourProps {
  onComplete: () => void;
}

interface StepConfig {
  tourId: string;
  title: string;
  description: string;
  tooltipPosition: 'above' | 'below';
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const STEPS: StepConfig[] = [
  {
    tourId: 'stats',
    title: '활동 요약',
    description: '팀의 예배, 리뷰, 칭찬 활동을 한눈에 확인하세요',
    tooltipPosition: 'below',
  },
  {
    tourId: 'tabs',
    title: '예배 · 곡 탭',
    description: '예배 목록과 곡 목록을 탭으로 전환할 수 있어요',
    tooltipPosition: 'below',
  },
  {
    tourId: 'fab',
    title: '새 예배 등록',
    description: '이 버튼을 눌러 예배 영상을 등록하세요',
    tooltipPosition: 'above',
  },
  {
    tourId: 'settings',
    title: '설정',
    description: '문의하기와 사용법 다시 보기를 여기서 찾을 수 있어요',
    tooltipPosition: 'below',
  },
];

const TOOLTIP_GAP = 12;
const VIEWPORT_PADDING = 16;
const SPOTLIGHT_PADDING = 8;

function getElementRect(tourId: string): SpotlightRect | null {
  const el = document.querySelector(`[data-tour="${tourId}"]`) as HTMLElement | null;
  if (!el) return null;

  const rect = el.getBoundingClientRect();
  return {
    top: rect.top - SPOTLIGHT_PADDING,
    left: rect.left - SPOTLIGHT_PADDING,
    width: rect.width + SPOTLIGHT_PADDING * 2,
    height: rect.height + SPOTLIGHT_PADDING * 2,
  };
}

export function GuidedTour({ onComplete }: GuidedTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  const currentStep = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  const updateRect = useCallback(() => {
    // Skip steps where target element doesn't exist
    let idx = stepIndex;
    let rect = getElementRect(STEPS[idx].tourId);

    if (!rect) {
      // Try to advance past missing steps
      const nextIdx = STEPS.findIndex((s, i) => i > idx && getElementRect(s.tourId) !== null);
      if (nextIdx !== -1) {
        setStepIndex(nextIdx);
        return;
      } else {
        onComplete();
        return;
      }
    }

    setSpotlightRect(rect);
  }, [stepIndex, onComplete]);

  useEffect(() => {
    updateRect();

    observerRef.current = new ResizeObserver(updateRect);
    observerRef.current.observe(document.body);

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [updateRect]);

  function advance() {
    if (isLast) {
      onComplete();
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    // Only advance if clicking directly on the overlay (not bubbled from tooltip)
    if (e.target === e.currentTarget) {
      advance();
    }
  }

  // Compute tooltip position
  function computeTooltipStyle(): React.CSSProperties {
    if (!spotlightRect) return { opacity: 0 };

    const viewportWidth = window.innerWidth;
    const tooltipWidth = Math.min(280, viewportWidth - VIEWPORT_PADDING * 2);

    let left = spotlightRect.left + spotlightRect.width / 2 - tooltipWidth / 2;
    // Clamp horizontally
    left = Math.max(VIEWPORT_PADDING, Math.min(left, viewportWidth - tooltipWidth - VIEWPORT_PADDING));

    if (currentStep.tooltipPosition === 'below') {
      return {
        position: 'fixed',
        top: spotlightRect.top + spotlightRect.height + TOOLTIP_GAP,
        left,
        width: tooltipWidth,
      };
    } else {
      return {
        position: 'fixed',
        bottom: window.innerHeight - (spotlightRect.top - TOOLTIP_GAP),
        left,
        width: tooltipWidth,
      };
    }
  }

  // Arrow direction is opposite to tooltip position (arrow points toward the target)
  const arrowPointsUp = currentStep.tooltipPosition === 'below'; // tooltip is below, arrow points up toward element
  const arrowPointsDown = currentStep.tooltipPosition === 'above'; // tooltip is above, arrow points down toward element

  // Compute arrow horizontal offset (center of spotlight minus left of tooltip)
  function computeArrowOffset(): number {
    if (!spotlightRect) return 0;
    const viewportWidth = window.innerWidth;
    const tooltipWidth = Math.min(280, viewportWidth - VIEWPORT_PADDING * 2);
    let tooltipLeft = spotlightRect.left + spotlightRect.width / 2 - tooltipWidth / 2;
    tooltipLeft = Math.max(VIEWPORT_PADDING, Math.min(tooltipLeft, viewportWidth - tooltipWidth - VIEWPORT_PADDING));
    const spotlightCenter = spotlightRect.left + spotlightRect.width / 2;
    const offset = spotlightCenter - tooltipLeft;
    return Math.max(16, Math.min(offset, tooltipWidth - 16));
  }

  const arrowOffset = computeArrowOffset();

  return (
    <>
      {/* Dark overlay — covers entire screen, clicking advances tour */}
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: 'transparent' }}
        onClick={handleOverlayClick}
        aria-label="다음 단계로 이동"
      />

      {/* Spotlight cutout element */}
      {spotlightRect && (
        <div
          className="pointer-events-none fixed z-40"
          style={{
            top: spotlightRect.top,
            left: spotlightRect.left,
            width: spotlightRect.width,
            height: spotlightRect.height,
            borderRadius: 12,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.65)',
            transition: 'top 0.35s cubic-bezier(0.4, 0, 0.2, 1), left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      )}

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        {spotlightRect && (
          <motion.div
            key={stepIndex}
            style={computeTooltipStyle()}
            initial={{ opacity: 0, y: arrowPointsUp ? -8 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: arrowPointsUp ? -8 : 8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto fixed z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow pointing up (tooltip is below element) */}
            {arrowPointsUp && (
              <div
                className="absolute -top-2"
                style={{
                  left: arrowOffset - 8,
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: '8px solid hsl(var(--border))',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 1,
                    left: -8,
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '8px solid hsl(var(--card))',
                  }}
                />
              </div>
            )}

            {/* Card body */}
            <div className="bg-card rounded-xl p-4 shadow-lg border border-border">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">{currentStep.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {stepIndex + 1}/{STEPS.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {currentStep.description}
                </p>
                <div className="flex justify-end pt-1">
                  <Button size="sm" onClick={advance}>
                    {isLast ? '완료' : '다음'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Arrow pointing down (tooltip is above element) */}
            {arrowPointsDown && (
              <div
                className="absolute -bottom-2"
                style={{
                  left: arrowOffset - 8,
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid hsl(var(--border))',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: 1,
                    left: -8,
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderTop: '8px solid hsl(var(--card))',
                  }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
