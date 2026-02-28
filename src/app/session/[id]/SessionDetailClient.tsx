"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { type CommentWithReplies } from "@/entities/comment/model/comment.interface";
import { CommentList } from "@/entities/comment/ui/CommentList";
import { TimelineMarkers } from "@/entities/comment/ui/TimelineMarkers";
import { type Praise } from "@/entities/praise/model/praise.interface";
import { PraiseList } from "@/entities/praise/ui/PraiseList";
import { type Session } from "@/entities/session/model/session.interface";
import {
  VideoPlayer,
  type VideoPlayerRef,
} from "@/entities/session/ui/VideoPlayer";
import { CommentForm } from "@/features/create-comment/ui/CommentForm";
import { PraiseForm } from "@/features/create-praise/ui/PraiseForm";
import { deleteComment } from "@/features/delete-comment/action/delete-comment";
import { deletePraise } from "@/features/delete-praise/action/delete-praise";
import { ProfileProvider } from "@/features/user-profile/ui/ProfileProvider";
import { getProfile } from "@/shared/config/profile";
import { type SessionSongWithName } from "@/entities/song/model/song.interface";
import { SongTimeline } from "@/entities/song/ui/SongTimeline";
import { type Part, PARTS } from "@/shared/config/parts";
import { BottomSheet, Button, ScrollArea } from "@/shared/ui";
import { CarrotClap, PartIcon } from "@/shared/ui/icons";

interface Props {
  session: Session;
  initialComments: CommentWithReplies[];
  initialPraises: Praise[];
  sessionSongs: SessionSongWithName[];
}

export function SessionDetailClient({
  session,
  initialComments,
  initialPraises,
  sessionSongs,
}: Props) {
  const searchParams = useSearchParams();
  const playerRef = useRef<VideoPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [filterPart, setFilterPart] = useState<Part | "all">("all");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"feedback" | "praise">("feedback");
  const [isPraiseMode, setIsPraiseMode] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [videoFlash, setVideoFlash] = useState(false);
  const [currentUserName, setCurrentUserName] = useState('');
  const [comments, setComments] = useState(initialComments);
  const [deleteCommentTarget, setDeleteCommentTarget] = useState<CommentWithReplies | null>(null);
  const [isCommentDeleting, setIsCommentDeleting] = useState(false);
  const [praises, setPraises] = useState(initialPraises);
  const [deletePraiseTarget, setDeletePraiseTarget] = useState<Praise | null>(null);
  const [isPraiseDeleting, setIsPraiseDeleting] = useState(false);

  const handleCommentDeleteRequest = useCallback((commentId: string) => {
    const target = comments.find((c) => c.id === commentId);
    if (target) setDeleteCommentTarget(target);
  }, [comments]);

  const handleCommentDeleteConfirm = async () => {
    if (!deleteCommentTarget) return;
    setIsCommentDeleting(true);
    const result = await deleteComment(deleteCommentTarget.id);
    setIsCommentDeleting(false);

    if (result.error) {
      setDeleteCommentTarget(null);
      return;
    }
    setComments((prev) => prev.filter((c) => c.id !== deleteCommentTarget.id));
    setDeleteCommentTarget(null);
  };

  const handlePraiseDeleteRequest = useCallback((praiseId: string) => {
    const target = praises.find((p) => p.id === praiseId);
    if (target) setDeletePraiseTarget(target);
  }, [praises]);

  const handlePraiseDeleteConfirm = async () => {
    if (!deletePraiseTarget) return;
    setIsPraiseDeleting(true);
    const result = await deletePraise(deletePraiseTarget.id);
    setIsPraiseDeleting(false);

    if (result.error) {
      setDeletePraiseTarget(null);
      return;
    }
    setPraises((prev) => prev.filter((p) => p.id !== deletePraiseTarget.id));
    setDeletePraiseTarget(null);
  };

  useEffect(() => {
    const t = searchParams.get('t');
    if (t) {
      const seconds = parseInt(t, 10);
      if (!isNaN(seconds)) {
        setTimeout(() => playerRef.current?.seekTo(seconds), 1000);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    const profile = getProfile();
    if (profile) setCurrentUserName(profile.name);
  }, []);

  const handleSeek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds);
    setVideoFlash(true);
    setTimeout(() => setVideoFlash(false), 800);
  }, []);

  const handleMarkerClick = useCallback(
    (id: string, type: "comment" | "praise") => {
      // Switch tab if needed
      if (type === "comment" && activeTab !== "feedback") {
        setActiveTab("feedback");
        setFilterPart("all");
      } else if (type === "praise" && activeTab !== "praise") {
        setActiveTab("praise");
      }

      // Set highlight, then scroll after tab switch renders
      setHighlightedId(id);
      setTimeout(() => {
        const el = document.getElementById(`item-${id}`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);

      // Clear highlight after animation
      setTimeout(() => setHighlightedId(null), 1500);
    },
    [activeTab],
  );

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
    // Update duration periodically
    const dur = playerRef.current?.getDuration() ?? 0;
    if (dur > 0) setDuration(dur);
  }, []);

  const handleReply = useCallback((commentId: string) => {
    setReplyTo(commentId);
    setIsPraiseMode(false);
  }, []);

  const handleCommentSubmitted = useCallback((data?: Record<string, unknown>) => {
    if (data && !replyTo) {
      // Top-level comment: add to list
      setComments((prev) => [{ ...data, replies: [] } as unknown as CommentWithReplies, ...prev]);
    } else if (data && replyTo) {
      // Reply: add to parent's replies
      setComments((prev) => prev.map((c) =>
        c.id === replyTo
          ? { ...c, replies: [...c.replies, data as unknown as CommentWithReplies['replies'][number]] }
          : c
      ));
    }
    setReplyTo(null);
  }, [replyTo]);

  const handlePraiseSubmitted = useCallback((data?: Record<string, unknown>) => {
    if (data) {
      setPraises((prev) => [data as unknown as Praise, ...prev]);
    }
    setIsPraiseMode(false);
  }, []);

  const visibleCount =
    filterPart === "all"
      ? comments.length
      : comments.filter((c) => c.author_part === filterPart).length;

  return (
    <ProfileProvider>
      <div className="flex h-dvh flex-col overflow-x-hidden">
        {/* Back button */}
        <div className="shrink-0 px-2 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground active:opacity-60"
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
            목록
          </Link>
        </div>

        {/* Video — edge to edge, no border */}
        <div className="relative shrink-0">
          <VideoPlayer
            ref={playerRef}
            videoUrl={session.video_url}
            videoType={session.video_type}
            onTimeUpdate={handleTimeUpdate}
          />
          {videoFlash && (
            <div className="pointer-events-none absolute inset-0 animate-[flash_0.8s_cubic-bezier(0.25,0.46,0.45,0.94)] bg-white/25 backdrop-blur-[2px]" />
          )}
        </div>

        {/* Timeline markers */}
        <div className="shrink-0">
          <TimelineMarkers
            comments={comments}
            praises={praises}
            duration={duration}
            currentTime={currentTime}
            onSeek={handleSeek}
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {/* Sync hint banner */}
        <div className="flex shrink-0 items-center justify-center gap-1.5 bg-muted/50 px-4 py-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-muted-foreground">
            <path d="M1.5 6A4.5 4.5 0 0 1 9.17 3M10.5 6A4.5 4.5 0 0 1 2.83 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M8 1.5L9.17 3 7.5 3.8M4 10.5L2.83 9l1.67-.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[11px] text-muted-foreground">시간이 안 맞나요? 새로고침해보세요</span>
        </div>

        {/* Session info */}
        <div className="shrink-0 px-5 pt-3 pb-2">
          <h1 className="text-base font-bold leading-snug">{session.title}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{session.date}</p>
        </div>

        {/* Song timeline chips */}
        {sessionSongs.length > 0 && (
          <div className="shrink-0 px-5 pb-3">
            <SongTimeline songs={sessionSongs} onSeek={handleSeek} currentTime={currentTime} />
          </div>
        )}

        {/* Tab switcher — full width, 50/50 */}
        <div className="flex shrink-0 w-full border-b border-border/40">
          <button
            onClick={() => setActiveTab("feedback")}
            className={`relative flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === "feedback"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            피드백 {comments.length}
            {activeTab === "feedback" && (
              <div className="absolute bottom-0 left-1/2 h-[3px] w-16 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("praise")}
            className={`relative flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === "praise" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            칭찬 {praises.length}
            {activeTab === "praise" && (
              <div className="absolute bottom-0 left-1/2 h-[3px] w-16 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </button>
        </div>

        {/* Scrollable tab content */}
        <ScrollArea className="flex-1">
          {/* Part filter — horizontal scroll (feedback tab only) */}
          {activeTab === "feedback" && (
            <div className="px-5 py-3">
              <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
                <button
                  onClick={() => setFilterPart("all")}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                    filterPart === "all"
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  전체 {comments.length}
                </button>
                {PARTS.map((p) => {
                  const count = comments.filter(
                    (c) => c.author_part === p.value,
                  ).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={p.value}
                      onClick={() => setFilterPart(p.value)}
                      className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
                        filterPart === p.value
                          ? `${p.color} border`
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <PartIcon part={p.value} size={12} className="inline-block" /> {count}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-5 pb-20">
            {activeTab === "feedback" ? (
              <CommentList
                comments={comments}
                filterPart={filterPart}
                onSeek={handleSeek}
                onReply={handleReply}
                onDelete={handleCommentDeleteRequest}
                currentUserName={currentUserName}
                highlightedId={highlightedId}
              />
            ) : (
              <PraiseList praises={praises} onSeek={handleSeek} onDelete={handlePraiseDeleteRequest} currentUserName={currentUserName} highlightedId={highlightedId} />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Fixed bottom comment input */}
      {!replyTo && !isPraiseMode && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-[540px] items-center gap-2 px-4 py-2.5">
            <div className="flex-1">
              <CommentForm
                sessionId={session.id}
                currentTime={currentTime}
                onSubmitted={handleCommentSubmitted}
              />
            </div>
            <button
              onClick={() => setIsPraiseMode(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-amber-600 transition-all hover:bg-amber-100 active:scale-95"
              aria-label="칭찬하기"
              title="칭찬하기"
            >
              <CarrotClap size={18} />
            </button>
          </div>
        </div>
      )}

      {isPraiseMode && !replyTo && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-amber-200/60 bg-amber-50/95 backdrop-blur-md"
          style={{ animation: "slideUp 0.18s ease-out" }}
        >
          <div className="mx-auto w-full max-w-[540px] px-4 py-2.5">
            <PraiseForm
              sessionId={session.id}
              currentTime={currentTime}
              onSubmitted={handlePraiseSubmitted}
              onCancel={() => setIsPraiseMode(false)}
            />
          </div>
        </div>
      )}

      {/* Comment delete confirmation */}
      <BottomSheet open={!!deleteCommentTarget} onOpenChange={(open) => { if (!open) setDeleteCommentTarget(null); }}>
        <div className="flex flex-col items-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7H24M10 7V5C10 4.2 10.6 3.5 11.5 3.5H16.5C17.4 3.5 18 4.2 18 5V7M21 7V23C21 23.8 20.4 24.5 19.5 24.5H8.5C7.6 24.5 7 23.8 7 23V7" />
            </svg>
          </div>
          <p className="mt-3 text-base font-semibold">피드백을 삭제할까요?</p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            삭제하면 복구할 수 없어요
          </p>
          <div className="mt-5 flex w-full gap-2">
            <Button
              onClick={() => setDeleteCommentTarget(null)}
              variant="outline"
              className="h-11 flex-1 rounded-xl text-sm"
            >
              취소
            </Button>
            <Button
              onClick={handleCommentDeleteConfirm}
              variant="destructive"
              disabled={isCommentDeleting}
              className="h-11 flex-1 rounded-xl text-sm font-semibold"
            >
              {isCommentDeleting ? '삭제 중...' : '삭제하기'}
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Praise delete confirmation */}
      <BottomSheet open={!!deletePraiseTarget} onOpenChange={(open) => { if (!open) setDeletePraiseTarget(null); }}>
        <div className="flex flex-col items-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7H24M10 7V5C10 4.2 10.6 3.5 11.5 3.5H16.5C17.4 3.5 18 4.2 18 5V7M21 7V23C21 23.8 20.4 24.5 19.5 24.5H8.5C7.6 24.5 7 23.8 7 23V7" />
            </svg>
          </div>
          <p className="mt-3 text-base font-semibold">칭찬을 삭제할까요?</p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            삭제하면 복구할 수 없어요
          </p>
          <div className="mt-5 flex w-full gap-2">
            <Button
              onClick={() => setDeletePraiseTarget(null)}
              variant="outline"
              className="h-11 flex-1 rounded-xl text-sm"
            >
              취소
            </Button>
            <Button
              onClick={handlePraiseDeleteConfirm}
              variant="destructive"
              disabled={isPraiseDeleting}
              className="h-11 flex-1 rounded-xl text-sm font-semibold"
            >
              {isPraiseDeleting ? '삭제 중...' : '삭제하기'}
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Reply bottom sheet */}
      {replyTo && (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 shadow-lg backdrop-blur-md"
          style={{ animation: "slideUp 0.18s ease-out" }}
        >
          <div className="mx-auto w-full max-w-[540px] px-4 py-2.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                답글 달기
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="rounded-full p-1 text-muted-foreground active:bg-muted"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4L12 12M12 4L4 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <CommentForm
              sessionId={session.id}
              currentTime={currentTime}
              parentId={replyTo}
              onSubmitted={handleCommentSubmitted}
              onCancel={() => setReplyTo(null)}
            />
          </div>
        </div>
      )}
    </ProfileProvider>
  );
}
