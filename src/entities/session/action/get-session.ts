'use server';

import { createClient } from '@/shared/utils/supabase/server';

import { type Session } from '../model/session.interface';

export async function getSession(id: string): Promise<Session | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;

  return data;
}
