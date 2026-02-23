'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/shared/utils/supabase/server';

interface DeleteSongResult {
  success?: boolean;
  error?: string;
}

export async function deleteSong(songId: string): Promise<DeleteSongResult> {
  const supabase = await createClient();

  // Delete related session_songs first
  await supabase
    .from('session_songs')
    .delete()
    .eq('song_id', songId);

  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', songId);

  if (error) {
    return { error: '곡 삭제에 실패했습니다.' };
  }

  revalidatePath('/');
  return { success: true };
}
