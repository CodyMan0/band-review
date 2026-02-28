'use server';

import { createClient } from '@/shared/utils/supabase/server';

import { type SessionWithCommentCount } from '../model/session.interface';

export async function getSessions(churchId: string): Promise<SessionWithCommentCount[]> {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*, comments(count), praises(count)')
    .eq('church_id', churchId)
    .order('date', { ascending: false });

  if (error || !sessions) return [];

  return sessions.map((session) => ({
    ...session,
    comment_count: (session.comments as unknown as { count: number }[])?.[0]?.count ?? 0,
    praise_count: (session.praises as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));
}
