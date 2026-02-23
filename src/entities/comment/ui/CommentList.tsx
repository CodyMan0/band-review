"use client";

import { type Part } from "@/shared/config/parts";

import { CarrotMusic, CarrotSearch } from "@/shared/ui/icons";
import { type CommentWithReplies } from "../model/comment.interface";
import { CommentItem } from "./CommentItem";

interface CommentListProps {
  comments: CommentWithReplies[];
  filterPart: Part | "all";
  onSeek: (seconds: number) => void;
  onReply: (commentId: string) => void;
  onDelete?: (commentId: string) => void;
  currentUserName?: string;
  highlightedId?: string | null;
}

export function CommentList({
  comments,
  filterPart,
  onSeek,
  onReply,
  onDelete,
  currentUserName,
  highlightedId,
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
            <CarrotMusic size={48} className="mb-3 opacity-70" />
            <p className="mb-1 text-sm font-medium text-foreground/70">
              아직 피드백이 없어요
            </p>
            <p className="text-xs text-muted-foreground">
              영상을 보며 느낀 점을 자유롭게 남겨보세요
            </p>
          </>
        ) : (
          <>
            <CarrotSearch size={48} className="mb-3 opacity-70" />
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
      {filtered.map((comment) => {
        const isOwn = !!currentUserName && comment.author_name?.trim() === currentUserName.trim();
        return (
          <CommentItem
            key={comment.id}
            comment={comment}
            onSeek={onSeek}
            onReply={onReply}
            onDelete={isOwn ? onDelete : undefined}
            isOwn={isOwn}
            isHighlighted={highlightedId === comment.id}
          />
        );
      })}
    </div>
  );
}
