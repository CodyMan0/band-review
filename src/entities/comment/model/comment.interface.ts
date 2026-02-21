import { type Part } from '@/shared/config/parts';

export interface Comment {
  id: string;
  session_id: string;
  parent_id: string | null;
  timestamp_sec: number;
  author_name: string;
  author_part: Part;
  content: string;
  created_at: string;
}

export interface CommentWithReplies extends Comment {
  replies: Comment[];
}
