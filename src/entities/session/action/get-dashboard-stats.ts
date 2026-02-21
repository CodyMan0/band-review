'use server';

import { createClient } from '@/shared/utils/supabase/server';

export interface DashboardStats {
  totalSessions: number;
  totalComments: number;
  totalPraises: number;
}

export async function getDashboardStats(churchId: string): Promise<DashboardStats> {
  const supabase = await createClient();

  // Get session IDs for this church first
  const { data: churchSessions } = await supabase
    .from('sessions')
    .select('id')
    .eq('church_id', churchId);

  const sessionIds = churchSessions?.map((s) => s.id) ?? [];

  if (sessionIds.length === 0) {
    return { totalSessions: 0, totalComments: 0, totalPraises: 0 };
  }

  const [{ count: totalComments }, { count: totalPraises }] = await Promise.all([
    supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .in('session_id', sessionIds),
    supabase
      .from('praises')
      .select('*', { count: 'exact', head: true })
      .in('session_id', sessionIds),
  ]);

  return {
    totalSessions: sessionIds.length,
    totalComments: totalComments ?? 0,
    totalPraises: totalPraises ?? 0,
  };
}
