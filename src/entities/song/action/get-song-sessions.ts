'use server';

import { createClient } from '@/shared/utils/supabase/server';

import { type SongSessionInfo } from '../model/song.interface';

export async function getSongSessions(songId: string): Promise<SongSessionInfo[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('session_songs')
    .select(
      `
      session_id,
      start_time_sec,
      sessions (
        title,
        date
      )
    `,
    )
    .eq('song_id', songId)
    .order('session_id', { ascending: false });

  if (error || !data) return [];

  const results: SongSessionInfo[] = data
    .map((row) => {
      const session = Array.isArray(row.sessions) ? row.sessions[0] : row.sessions;
      if (!session) return null;

      return {
        session_id: row.session_id,
        session_title: session.title,
        session_date: session.date,
        start_time_sec: row.start_time_sec,
      };
    })
    .filter((item): item is SongSessionInfo => item !== null)
    .sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime());

  return results;
}
