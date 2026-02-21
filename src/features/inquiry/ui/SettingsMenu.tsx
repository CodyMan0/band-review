"use client";

import { useState } from "react";

import { createInquiry } from "@/features/inquiry/action/create-inquiry";
import { getProfile } from "@/shared/config/profile";
import { Button, Input } from "@/shared/ui";

type View = "closed" | "menu" | "inquiry";

export function SettingsMenu() {
  const [view, setView] = useState<View>("closed");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleOpenMenu = () => setView("menu");

  const handleOpenInquiry = () => {
    const profile = getProfile();
    if (profile) setName(profile.name);
    setSubmitted(false);
    setError("");
    setContent("");
    setView("inquiry");
  };

  const handleClose = () => setView("closed");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    setIsSubmitting(true);
    setError("");

    const result = await createInquiry({
      author_name: name.trim(),
      content: content.trim(),
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setSubmitted(true);
  };

  return (
    <>
      {/* Settings gear icon */}
      <button
        onClick={handleOpenMenu}
        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
        aria-label="설정"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="10" cy="10" r="2.5" />
          <path d="M16.17 10a6.17 6.17 0 0 0-.12-1.25l1.72-1.35-1.5-2.6-2.04.68a6.2 6.2 0 0 0-2.16-1.25L11.7 2h-3l-.37 2.23a6.2 6.2 0 0 0-2.16 1.25l-2.04-.68-1.5 2.6 1.72 1.35a6.17 6.17 0 0 0 0 2.5l-1.72 1.35 1.5 2.6 2.04-.68a6.2 6.2 0 0 0 2.16 1.25L8.7 18h3l.37-2.23a6.2 6.2 0 0 0 2.16-1.25l2.04.68 1.5-2.6-1.72-1.35a6.17 6.17 0 0 0 .12-1.25Z" />
        </svg>
      </button>

      {/* Bottom sheet overlay */}
      {view !== "closed" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

          <div
            className="relative w-full min-w-[380px] max-w-[540px] rounded-t-2xl bg-background px-5 pb-8 pt-5 shadow-xl"
            style={{ animation: "slideUp 0.2s ease-out" }}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

            {/* Menu view */}
            {view === "menu" && (
              <div className="flex flex-col gap-1">
                <h2 className="mb-2 text-lg font-bold">설정</h2>
                <button
                  onClick={handleOpenInquiry}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted active:bg-muted/70"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 9.5C15 13.09 12.31 16 9 16C7.93 16 6.93 15.72 6.06 15.22L3 16L3.78 13.06C3.28 12.16 3 11.12 3 10C3 6.41 5.69 3.5 9 3.5C12.31 3.5 15 6.41 15 9.5Z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium">문의하기</p>
                    <p className="text-xs text-muted-foreground">
                      건의사항이나 궁금한 점을 남겨주세요
                    </p>
                  </div>
                </button>
              </div>
            )}

            {/* Inquiry form view */}
            {view === "inquiry" && !submitted && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setView("menu")}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M10 3L5 8L10 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <h2 className="text-lg font-bold">문의하기</h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="inquiry-name" className="text-sm font-medium">
                    이름
                  </label>
                  <Input
                    id="inquiry-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름"
                    required
                    className="h-10 rounded-xl text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="inquiry-content"
                    className="text-sm font-medium"
                  >
                    내용
                  </label>
                  <textarea
                    id="inquiry-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="문의 내용을 입력해주세요"
                    required
                    rows={3}
                    className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !content.trim()}
                  className="h-11 w-full rounded-xl text-sm font-semibold active:scale-[0.98]"
                >
                  {isSubmitting ? "보내는 중..." : "보내기"}
                </Button>
              </form>
            )}

            {/* Success view */}
            {view === "inquiry" && submitted && (
              <div className="flex flex-col items-center py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-xl">
                  ✓
                </div>
                <p className="mt-3 text-base font-semibold">
                  문의가 접수되었어요
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  감사합니다!
                </p>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="mt-5 rounded-full px-6"
                  size="sm"
                >
                  닫기
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
