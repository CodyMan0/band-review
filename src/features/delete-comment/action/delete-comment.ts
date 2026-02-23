'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/shared/utils/supabase/server';

interface DeleteCommentResult {
  success?: boolean;
  error?: string;
}

export async function deleteComment(commentId: string): Promise<DeleteCommentResult> {
  const supabase = await createClient();

  // Get session_id for revalidation
  const { data: comment } = await supabase
    .from('comments')
    .select('session_id')
    .eq('id', commentId)
    .single();

  // Delete replies first, then the comment
  await supabase
    .from('comments')
    .delete()
    .eq('parent_id', commentId);

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) {
    return { error: '피드백 삭제에 실패했습니다.' };
  }

  if (comment?.session_id) {
    revalidatePath(`/session/${comment.session_id}`);
  }

  return { success: true };
}
