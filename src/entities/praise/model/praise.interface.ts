import { type Part } from '@/shared/config/parts';

export interface Praise {
  id: string;
  session_id: string;
  timestamp_sec: number;
  author_name: string;
  author_part: Part;
  content: string;
  created_at: string;
}
