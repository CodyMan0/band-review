'use server';

import { createClient } from '@/shared/utils/supabase/server';
import { type Praise } from '../model/praise.interface';

export async function getPraises(sessionId: string): Promise<Praise[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('praises')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];

  return data as Praise[];
}
