'use server';

import { createClient } from '@/shared/utils/supabase/server';

import { type SessionWithCommentCount } from '../model/session.interface';

export async function getSessions(): Promise<SessionWithCommentCount[]> {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .order('date', { ascending: false });

  if (error || !sessions) return [];

  const sessionsWithCounts: SessionWithCommentCount[] = await Promise.all(
    sessions.map(async (session) => {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', session.id);

      return {
        ...session,
        comment_count: count ?? 0,
      };
    }),
  );

  return sessionsWithCounts;
}
