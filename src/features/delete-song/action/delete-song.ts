'use server';

import { createClient } from '@/shared/utils/supabase/server';

interface DeleteSongResult {
  success?: boolean;
  error?: string;
}

export async function deleteSong(songId: string): Promise<DeleteSongResult> {
  const supabase = await createClient();

  // Check if song is used in any session
  const { count } = await supabase
    .from('session_songs')
    .select('*', { count: 'exact', head: true })
    .eq('song_id', songId);

  if ((count ?? 0) > 0) {
    return { error: `이 곡은 ${count}개의 예배에서 사용 중이에요. 예배에서 먼저 제거해주세요.` };
  }

  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', songId);

  if (error) {
    return { error: '곡 삭제에 실패했습니다.' };
  }

  return { success: true };
}
