'use server';

import { createClient } from '@/shared/utils/supabase/server';

interface DeleteSessionResult {
  success?: boolean;
  error?: string;
}

export async function deleteSession(sessionId: string): Promise<DeleteSessionResult> {
  const supabase = await createClient();

  // Check if session has comments or praises
  const [{ count: commentCount }, { count: praiseCount }] = await Promise.all([
    supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId),
    supabase
      .from('praises')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId),
  ]);

  if ((commentCount ?? 0) > 0 || (praiseCount ?? 0) > 0) {
    return { error: '피드백이나 칭찬이 있는 세션은 삭제할 수 없습니다. 담당자에게 문의해주세요.' };
  }

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    return { error: '세션 삭제에 실패했습니다.' };
  }

  return { success: true };
}
