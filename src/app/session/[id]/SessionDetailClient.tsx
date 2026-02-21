"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

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
import { ProfileProvider } from "@/features/user-profile/ui/ProfileProvider";
import { type Part, PARTS } from "@/shared/config/parts";
import { CarrotClap, PartIcon } from "@/shared/ui/icons";

interface Props {
  session: Session;
  initialComments: CommentWithReplies[];
  initialPraises: Praise[];
}

export function SessionDetailClient({
  session,
  initialComments,
  initialPraises,
}: Props) {
  const playerRef = useRef<VideoPlayerRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [filterPart, setFilterPart] = useState<Part | "all">("all");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"feedback" | "praise">("feedback");
  const [isPraiseMode, setIsPraiseMode] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const handleSeek = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds);
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

  const handleCommentSubmitted = useCallback(() => {
    setReplyTo(null);
  }, []);

  const visibleCount =
    filterPart === "all"
      ? initialComments.length
      : initialComments.filter((c) => c.author_part === filterPart).length;

  return (
    <ProfileProvider>
      <div className="flex flex-1 flex-col overflow-x-hidden pb-20">
        {/* Back button */}
        <div className="px-2 py-3">
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
        <VideoPlayer
          ref={playerRef}
          videoUrl={session.video_url}
          videoType={session.video_type}
          onTimeUpdate={handleTimeUpdate}
        />

        {/* Timeline markers */}
        <TimelineMarkers
          comments={initialComments}
          praises={initialPraises}
          duration={duration}
          currentTime={currentTime}
          onSeek={handleSeek}
          onMarkerClick={handleMarkerClick}
        />

        {/* Session info */}
        <div className="px-5 pb-3">
          <h1 className="text-base font-bold leading-snug">{session.title}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">{session.date}</p>
        </div>

        {/* Tab switcher — full width, 50/50 */}
        <div className="flex w-full border-b border-border/40">
          <button
            onClick={() => setActiveTab("feedback")}
            className={`relative flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === "feedback"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            피드백 {initialComments.length}
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
            칭찬 {initialPraises.length}
            {activeTab === "praise" && (
              <div className="absolute bottom-0 left-1/2 h-[3px] w-16 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </button>
        </div>

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
                전체 {initialComments.length}
              </button>
              {PARTS.map((p) => {
                const count = initialComments.filter(
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
        <div className="flex-1 px-5">
          {activeTab === "feedback" ? (
            <CommentList
              comments={initialComments}
              filterPart={filterPart}
              onSeek={handleSeek}
              onReply={handleReply}
              highlightedId={highlightedId}
            />
          ) : (
            <PraiseList praises={initialPraises} onSeek={handleSeek} highlightedId={highlightedId} />
          )}
        </div>
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
              onSubmitted={() => setIsPraiseMode(false)}
              onCancel={() => setIsPraiseMode(false)}
            />
          </div>
        </div>
      )}

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
