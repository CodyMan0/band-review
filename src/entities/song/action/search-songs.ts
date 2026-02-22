'use server';

import { createClient } from '@/shared/utils/supabase/server';

import { type Song } from '../model/song.interface';

export async function searchSongs(keyword: string, churchId: string): Promise<Song[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('church_id', churchId)
    .ilike('name', `%${keyword}%`)
    .order('name', { ascending: true })
    .limit(10);

  if (error || !data) return [];

  return data;
}
