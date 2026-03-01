export interface Session {
  id: string;
  title: string;
  date: string;
  video_url: string;
  video_type: 'youtube' | 'upload';
  audio_url?: string | null;
  created_at: string;
  created_by?: string;
}

export interface SessionWithCommentCount extends Session {
  comment_count: number;
  praise_count: number;
}
