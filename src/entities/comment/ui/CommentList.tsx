"use client";

import { type Part } from "@/shared/config/parts";

import { type CommentWithReplies } from "../model/comment.interface";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: CommentWithReplies[];
  filterPart: Part | "all";
  onSeek: (seconds: number) => void;
  onReply: (commentId: string) => void;
}

export function CommentList({
  comments,
  filterPart,
  onSeek,
  onReply,
}: CommentListProps) {
  const filtered =
    filterPart === "all"
      ? comments
      : comments.filter((c) => c.author_part === filterPart);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 text-center">
        {filterPart === "all" ? (
          <>
            <div className="mb-3 text-3xl opacity-60">🎵</div>
            <p className="mb-1 text-sm font-medium text-foreground/70">
              아직 피드백이 없어요
            </p>
            <p className="text-xs text-muted-foreground">
              영상을 보며 느낀 점을 자유롭게 남겨보세요
            </p>
          </>
        ) : (
          <>
            <div className="mb-3 text-3xl opacity-60">🔍</div>
            <p className="mb-1 text-sm font-medium text-foreground/70">
              해당 파트의 피드백이 없어요
            </p>
            <p className="text-xs text-muted-foreground">
              다른 파트를 선택하거나 전체 보기로 돌아가세요
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {filtered.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onSeek={onSeek}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
