"use client";

import { useState } from "react";

import { createInquiry } from "@/features/inquiry/action/create-inquiry";
import { resetOnboarding } from "@/shared/config/onboarding";
import { getProfile } from "@/shared/config/profile";
import { BottomSheet, Button, Input } from "@/shared/ui";
import { CarrotCheck } from "@/shared/ui/icons";

type View = "closed" | "menu" | "inquiry";

export function SettingsMenu() {
  const [view, setView] = useState<View>("closed");
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleOpenMenu = () => setView("menu");

  const handleOpenInquiry = () => {
    const profile = getProfile();
    if (profile) setName(profile.name);
    setSubmitted(false);
    setError("");
    setContent("");
    setView("inquiry");
  };

  const handleClose = () => {
    setView("closed");
    setShowLogoutConfirm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('harmony-band-profile');
    window.location.reload();
  };

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
        data-tour="settings"
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

      {/* Bottom sheet */}
      <BottomSheet open={view !== "closed"} onOpenChange={(open) => { if (!open) handleClose(); }}>
            {/* Menu view */}
            {view === "menu" && !showLogoutConfirm && (
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
                <button
                  onClick={() => {
                    resetOnboarding();
                    window.location.reload();
                  }}
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
                      <circle cx="9" cy="9" r="7" />
                      <path d="M9 6v1.5" />
                      <circle cx="9" cy="9" r="0.5" fill="currentColor" stroke="none" />
                      <path d="M9 12v-1" />
                      <path d="M7 12h4" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium">사용법 다시 보기</p>
                    <p className="text-xs text-muted-foreground">
                      온보딩 가이드를 다시 확인해요
                    </p>
                  </div>
                </button>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted active:bg-muted/70"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
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
                      <path d="M6.75 15.75H3.75C3.35 15.75 3 15.4 3 15V3C3 2.6 3.35 2.25 3.75 2.25H6.75" />
                      <path d="M12 12.75L15.75 9L12 5.25" />
                      <path d="M15.75 9H6.75" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-destructive">로그아웃</p>
                    <p className="text-xs text-muted-foreground">프로필 정보가 초기화돼요</p>
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
                <CarrotCheck size={48} />
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

            {/* Logout confirm dialog */}
            {showLogoutConfirm && (
              <div className="flex flex-col items-center py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.5 24.5H5.83C5.18 24.5 4.67 23.99 4.67 23.33V4.67C4.67 4.01 5.18 3.5 5.83 3.5H10.5" />
                    <path d="M18.67 19.83L24.5 14L18.67 8.17" />
                    <path d="M24.5 14H10.5" />
                  </svg>
                </div>
                <p className="mt-3 text-base font-semibold">정말 로그아웃하시겠어요?</p>
                <p className="mt-1 text-sm text-muted-foreground">프로필 정보가 삭제되고 처음 화면으로 돌아가요</p>
                <div className="mt-5 flex gap-2">
                  <Button
                    onClick={() => setShowLogoutConfirm(false)}
                    variant="outline"
                    className="rounded-full px-6"
                    size="sm"
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="rounded-full px-6"
                    size="sm"
                  >
                    로그아웃
                  </Button>
                </div>
              </div>
            )}
      </BottomSheet>
    </>
  );
}
