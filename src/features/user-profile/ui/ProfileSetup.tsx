"use client";

import { useState } from "react";

import { validateChurchCode } from "@/features/user-profile/action/validate-church-code";
import { type Part, PARTS } from "@/shared/config/parts";
import { saveProfile, type UserProfile } from "@/shared/config/profile";
import { Input } from "@/shared/ui";
import { CarrotWave, PartIcon } from "@/shared/ui/icons";

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
}

type Step = "church" | "splash" | "profile";

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [step, setStep] = useState<Step>("church");
  const [churchCode, setChurchCode] = useState("");
  const [churchId, setChurchId] = useState("");
  const [churchName, setChurchName] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [name, setName] = useState("");
  const [part, setPart] = useState<Part>("vocal");

  const handleChurchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!churchCode.trim()) return;

    setIsValidating(true);
    setError("");

    const result = await validateChurchCode(churchCode.trim());

    setIsValidating(false);

    if (!result.success) {
      setError(result.error || "존재하지 않는 교회 코드입니다.");
      return;
    }

    setChurchId(result.churchId!);
    setChurchName(result.churchName!);
    setStep("splash");

    // 2-second splash then move to profile
    setTimeout(() => setStep("profile"), 2000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const profile: UserProfile = {
      name: name.trim(),
      part,
      churchId,
      churchName,
    };
    saveProfile(profile);
    onComplete(profile);
  };

  const selectedPart = PARTS.find((p) => p.value === part)!;

  // Step 1: Church code
  if (step === "church") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background px-4">
        <form
          onSubmit={handleChurchSubmit}
          className="flex w-full max-w-sm flex-col items-center gap-6"
          style={{ animation: "modalIn 0.3s ease-out" }}
        >
          {/* Logo + Carrot */}
          <div className="flex flex-col items-center gap-4">
            <svg
              width="64"
              height="80"
              viewBox="0 0 80 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="34" cy="18" rx="8" ry="18" transform="rotate(-15 34 18)" fill="#4CAF50" />
              <ellipse cx="40" cy="15" rx="7" ry="20" fill="#66BB6A" />
              <ellipse cx="46" cy="18" rx="8" ry="18" transform="rotate(15 46 18)" fill="#4CAF50" />
              <path d="M25 30 C25 30, 20 70, 40 95 C60 70, 55 30, 55 30 Z" fill="#FF8A00" />
              <path d="M30 30 C30 30, 27 65, 40 88 C53 65, 50 30, 50 30 Z" fill="#FFA040" opacity="0.6" />
              <ellipse cx="40" cy="30" rx="16" ry="6" fill="#FF8A00" />
              <circle cx="34" cy="48" r="2.5" fill="#D35400" />
              <circle cx="46" cy="48" r="2.5" fill="#D35400" />
              <path d="M36 56 Q40 60 44 56" stroke="#D35400" strokeWidth="2" strokeLinecap="round" fill="none" />
              <circle cx="30" cy="54" r="3" fill="#FFB74D" opacity="0.5" />
              <circle cx="50" cy="54" r="3" fill="#FFB74D" opacity="0.5" />
            </svg>
            <h1 className="text-xl font-bold tracking-tight">Harmony Band</h1>
            <p className="text-center text-sm text-muted-foreground">
              찬양팀 리뷰 플랫폼에 오신 것을 환영합니다
            </p>
          </div>

          {/* Church code input */}
          <div className="flex w-full flex-col gap-2">
            <label className="text-xs font-medium uppercase tracking-wide text-foreground/70">
              교회 코드
            </label>
            <Input
              placeholder="찬양팀"
              value={churchCode}
              onChange={(e) => setChurchCode(e.target.value)}
              required
              autoFocus
              className="h-12 rounded-xl border-border/70 bg-card text-center text-lg font-semibold focus-visible:border-primary/50 focus-visible:ring-primary/20"
            />
            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isValidating || !churchCode.trim()}
            className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
          >
            {isValidating ? "확인 중..." : "입장하기"}
          </button>

          <p className="text-center text-xs text-muted-foreground">
            교회 코드는 찬양팀 리더 혹은 담당자에게 문의해주세요
          </p>
        </form>
      </div>
    );
  }

  // Step 2: Splash loading — cute carrot style
  if (step === "splash") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-4">
        <div
          className="flex flex-col items-center gap-5"
          style={{ animation: "modalIn 0.4s ease-out" }}
        >
          {/* Cute carrot illustration */}
          <div
            className="relative"
            style={{ animation: "carrotBounce 1.2s ease-in-out infinite" }}
          >
            <svg
              width="80"
              height="100"
              viewBox="0 0 80 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Carrot leaves */}
              <ellipse
                cx="34"
                cy="18"
                rx="8"
                ry="18"
                transform="rotate(-15 34 18)"
                fill="#4CAF50"
              />
              <ellipse cx="40" cy="15" rx="7" ry="20" fill="#66BB6A" />
              <ellipse
                cx="46"
                cy="18"
                rx="8"
                ry="18"
                transform="rotate(15 46 18)"
                fill="#4CAF50"
              />
              {/* Carrot body */}
              <path
                d="M25 30 C25 30, 20 70, 40 95 C60 70, 55 30, 55 30 Z"
                fill="#FF8A00"
              />
              <path
                d="M30 30 C30 30, 27 65, 40 88 C53 65, 50 30, 50 30 Z"
                fill="#FFA040"
                opacity="0.6"
              />
              {/* Carrot top */}
              <ellipse cx="40" cy="30" rx="16" ry="6" fill="#FF8A00" />
              {/* Cute face */}
              <circle cx="34" cy="48" r="2.5" fill="#D35400" />
              <circle cx="46" cy="48" r="2.5" fill="#D35400" />
              <path
                d="M36 56 Q40 60 44 56"
                stroke="#D35400"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Cheek blush */}
              <circle cx="30" cy="54" r="3" fill="#FFB74D" opacity="0.5" />
              <circle cx="50" cy="54" r="3" fill="#FFB74D" opacity="0.5" />
            </svg>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              {churchName}
            </h1>
            <p className="text-sm text-gray-400">Harmony Band</p>
          </div>

          {/* Animated loading dots */}
          <div className="mt-2 flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-orange-400"
                style={{
                  animation: "dotPulse 1.2s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Profile setup
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <form
        onSubmit={handleProfileSubmit}
        className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-border/60 bg-card p-6 shadow-2xl"
        style={{ animation: "modalIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <CarrotWave size={28} />
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              {churchName}
            </span>
          </div>
          <h2 className="text-lg font-bold text-foreground">프로필 설정</h2>
          <p className="text-sm text-muted-foreground">
            닉네임과 파트를 알려주세요
          </p>
        </div>

        {/* Name input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium uppercase tracking-wide text-foreground/70">
            닉네임
          </label>
          <Input
            placeholder="예: 김찬양"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            className="h-10 rounded-xl border-border/70 bg-background focus-visible:border-primary/50 focus-visible:ring-primary/20"
          />
        </div>

        {/* Part selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase tracking-wide text-foreground/70">
            파트
          </label>
          <div className="flex flex-wrap gap-2">
            {PARTS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPart(p.value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all duration-150 active:scale-95 ${
                  part === p.value
                    ? `${p.color} scale-105 shadow-sm`
                    : "border-border/60 bg-background text-foreground/60 hover:border-border hover:text-foreground/80"
                } `}
              >
                <PartIcon part={p.value} size={14} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        {name.trim() && (
          <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/60 px-3 py-2.5">
            <span className="text-xs text-muted-foreground">미리보기</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${selectedPart.color}`}
            >
              <PartIcon part={part} size={12} />
              <span>{name.trim()}</span>
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!name.trim()}
          className="h-11 w-full rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary/90 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40"
        >
          시작하기
        </button>
      </form>
    </div>
  );
}
