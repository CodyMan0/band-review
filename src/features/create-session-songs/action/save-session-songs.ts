'use server';

import { createClient } from '@/shared/utils/supabase/server';

interface SongInput {
  name: string;
  startTimeSec: number;
}

interface SaveSessionSongsResult {
  error?: string;
}

export async function saveSessionSongs(
  sessionId: string,
  churchId: string,
  songs: SongInput[],
): Promise<SaveSessionSongsResult> {
  if (!songs || songs.length === 0) return {};

  const supabase = await createClient();

  const sessionSongsToInsert: {
    session_id: string;
    song_id: string;
    start_time_sec: number;
    song_order: number;
  }[] = [];

  for (let i = 0; i < songs.length; i++) {
    const { name: songName, startTimeSec } = songs[i];

    if (!songName.trim()) continue;

    // Try to find existing song
    const { data: existing } = await supabase
      .from('songs')
      .select('id')
      .eq('church_id', churchId)
      .eq('name', songName)
      .single();

    let songId: string;

    if (existing?.id) {
      songId = existing.id;
    } else {
      // Insert new song
      const { data: newSong, error: insertError } = await supabase
        .from('songs')
        .insert({ name: songName, church_id: churchId })
        .select('id')
        .single();

      if (insertError || !newSong) {
        return { error: `곡 "${songName}" 저장에 실패했습니다.` };
      }

      songId = newSong.id;
    }

    sessionSongsToInsert.push({
      session_id: sessionId,
      song_id: songId,
      start_time_sec: startTimeSec,
      song_order: i,
    });
  }

  if (sessionSongsToInsert.length === 0) return {};

  const { error: batchError } = await supabase.from('session_songs').insert(sessionSongsToInsert);

  if (batchError) {
    return { error: '곡 목록 저장에 실패했습니다.' };
  }

  return {};
}
