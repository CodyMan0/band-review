'use server';

import { createClient } from '@/shared/utils/supabase/server';

export interface DashboardStats {
  totalSessions: number;
  totalComments: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  // Total sessions
  const { count: totalSessions } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true });

  // Total comments
  const { count: totalComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true });

  return {
    totalSessions: totalSessions ?? 0,
    totalComments: totalComments ?? 0,
  };
}
