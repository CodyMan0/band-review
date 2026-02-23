'use server';

import { createClient } from '@/shared/utils/supabase/server';

import { type Comment, type CommentWithReplies } from '../model/comment.interface';

export async function getComments(sessionId: string): Promise<CommentWithReplies[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  const parentComments = data.filter((c: Comment) => !c.parent_id);
  const replies = data.filter((c: Comment) => c.parent_id);

  return parentComments.map((parent: Comment) => ({
    ...parent,
    replies: replies.filter((r: Comment) => r.parent_id === parent.id),
  }));
}
