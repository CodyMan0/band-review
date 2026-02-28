"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/shared/ui";
import { CarrotClap, CarrotMusic } from "@/shared/ui/icons";

interface OnboardingTourProps {
  onComplete: () => void;
}

const STEPS = [
  {
    icon: (
      <svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* YouTube play button */}
        <rect
          x="2"
          y="9"
          width="36"
          height="22"
          rx="6"
          fill="currentColor"
          opacity="0.15"
        />
        <rect
          x="2"
          y="9"
          width="36"
          height="22"
          rx="6"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M16 15.5L27 20L16 24.5V15.5Z" fill="currentColor" />
      </svg>
    ),
    title: "예배 기록",
    description: "예배 영상 링크로 등록하고 팀원들과 공유하세요",
  },
  {
    icon: (
      <svg
        width={40}
        height={40}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Clock with timestamp marker */}
        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2" />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
        {/* Hour hand */}
        <line
          x1="20"
          y1="20"
          x2="20"
          y2="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Minute hand */}
        <line
          x1="20"
          y1="20"
          x2="27"
          y2="24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Timestamp marker at 2 o'clock */}
        <circle cx="29" cy="11" r="5" fill="currentColor" />
        <line
          x1="29"
          y1="8.5"
          x2="29"
          y2="13.5"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="26.5"
          y1="11"
          x2="31.5"
          y2="11"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "타임스탬프 피드백",
    description: "영상의 특정 시간에 피드백을 남겨 정확한 소통을 하세요",
  },
  {
    icon: <CarrotClap size={40} />,
    title: "칭찬하기",
    description: "팀원의 좋은 연주에 칭찬을 남겨 서로 격려하세요",
  },
  {
    icon: <CarrotMusic size={48} />,
    title: "곡 관리",
    description: "연주한 곡을 등록하면 곡별로 예배를 모아볼 수 있어요",
  },
];

const DRAG_THRESHOLD = 60;

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const isLast = step === STEPS.length - 1;

  function goNext() {
    if (isLast) {
      onComplete();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  }

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x < -DRAG_THRESHOLD && !isLast) {
      setDirection(1);
      setStep((s) => s + 1);
    } else if (info.offset.x > DRAG_THRESHOLD && step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-background px-6 pb-10 pt-14">
      {/* Skip button */}
      <div className="flex w-full justify-end">
        <button
          onClick={onComplete}
          className="text-sm text-muted-foreground transition-transform active:scale-95"
        >
          건너뛰기
        </button>
      </div>

      {/* Card area */}
      <div className="flex w-full flex-1 items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="flex w-full max-w-sm cursor-grab select-none flex-col items-center gap-8 active:cursor-grabbing"
          >
            {/* Icon circle */}
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              {STEPS[step].icon}
            </div>

            {/* Text */}
            <div className="flex flex-col items-center gap-3 text-center">
              <h2 className="text-xl font-bold text-foreground">
                {STEPS[step].title}
              </h2>
              <p className="max-w-[260px] text-sm leading-relaxed text-muted-foreground">
                {STEPS[step].description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > step ? 1 : -1);
                setStep(i);
              }}
              className="transition-all duration-200"
              aria-label={`${i + 1}번째 슬라이드`}
            >
              <span
                className={`block rounded-full transition-all duration-200 ${
                  i === step
                    ? "h-2 w-5 bg-primary"
                    : "h-2 w-2 bg-muted-foreground/30"
                }`}
              />
            </button>
          ))}
        </div>

        {/* CTA button */}
        <Button
          onClick={goNext}
          size="lg"
          className="w-full transition-transform active:scale-[0.98]"
        >
          {isLast ? "시작하기" : "다음"}
        </Button>
      </div>
    </div>
  );
}
