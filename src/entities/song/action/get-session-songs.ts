'use server';

import { createClient } from '@/shared/utils/supabase/server';

import { type SessionSongWithName } from '../model/song.interface';

export async function getSessionSongs(sessionId: string): Promise<SessionSongWithName[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('session_songs')
    .select(
      `
      id,
      session_id,
      song_id,
      start_time_sec,
      song_order,
      songs (
        name
      )
    `,
    )
    .eq('session_id', sessionId)
    .order('song_order', { ascending: true });

  if (error || !data) return [];

  const results: SessionSongWithName[] = data
    .map((row) => {
      const song = Array.isArray(row.songs) ? row.songs[0] : row.songs;
      if (!song) return null;

      return {
        id: row.id,
        session_id: row.session_id,
        song_id: row.song_id,
        start_time_sec: row.start_time_sec,
        song_order: row.song_order,
        song_name: song.name,
      };
    })
    .filter((item): item is SessionSongWithName => item !== null);

  return results;
}
