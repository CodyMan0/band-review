export interface Session {
  id: string;
  title: string;
  date: string;
  video_url: string;
  video_type: 'youtube' | 'upload';
  created_at: string;
}

export interface SessionWithCommentCount extends Session {
  comment_count: number;
}
