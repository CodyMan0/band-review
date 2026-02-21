'use server';

import { createClient } from '@/shared/utils/supabase/server';

import { type SessionWithCommentCount } from '../model/session.interface';

export async function getSessions(churchId: string): Promise<SessionWithCommentCount[]> {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('church_id', churchId)
    .order('date', { ascending: false });

  if (error || !sessions) return [];

  const sessionsWithCounts: SessionWithCommentCount[] = await Promise.all(
    sessions.map(async (session) => {
      const [{ count: commentCount }, { count: praiseCount }] = await Promise.all([
        supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', session.id),
        supabase
          .from('praises')
          .select('*', { count: 'exact', head: true })
          .eq('session_id', session.id),
      ]);

      return {
        ...session,
        comment_count: commentCount ?? 0,
        praise_count: praiseCount ?? 0,
      };
    }),
  );

  return sessionsWithCounts;
}
