'use server';

import { createClient } from '@/shared/utils/supabase/server';

import { type SongWithSessionCount } from '../model/song.interface';

export async function getSongs(churchId: string): Promise<SongWithSessionCount[]> {
  const supabase = await createClient();

  const { data: songs, error } = await supabase
    .from('songs')
    .select('*, session_songs(count)')
    .eq('church_id', churchId)
    .order('name', { ascending: true });

  if (error || !songs) return [];

  return songs.map((song) => ({
    ...song,
    session_count: (song.session_songs as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));
}
