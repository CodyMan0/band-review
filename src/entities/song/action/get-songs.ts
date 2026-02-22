'use server';

import { createClient } from '@/shared/utils/supabase/server';

import { type SongWithSessionCount } from '../model/song.interface';

export async function getSongs(churchId: string): Promise<SongWithSessionCount[]> {
  const supabase = await createClient();

  const { data: songs, error } = await supabase
    .from('songs')
    .select('*')
    .eq('church_id', churchId)
    .order('name', { ascending: true });

  if (error || !songs) return [];

  const songsWithCounts: SongWithSessionCount[] = await Promise.all(
    songs.map(async (song) => {
      const { count: sessionCount } = await supabase
        .from('session_songs')
        .select('*', { count: 'exact', head: true })
        .eq('song_id', song.id);

      return {
        ...song,
        session_count: sessionCount ?? 0,
      };
    }),
  );

  return songsWithCounts;
}
