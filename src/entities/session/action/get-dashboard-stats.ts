'use server';

import { createClient } from '@/shared/utils/supabase/server';

export interface DashboardStats {
  totalSessions: number;
  totalComments: number;
  totalPraises: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [{ count: totalSessions }, { count: totalComments }, { count: totalPraises }] =
    await Promise.all([
      supabase.from('sessions').select('*', { count: 'exact', head: true }),
      supabase.from('comments').select('*', { count: 'exact', head: true }),
      supabase.from('praises').select('*', { count: 'exact', head: true }),
    ]);

  return {
    totalSessions: totalSessions ?? 0,
    totalComments: totalComments ?? 0,
    totalPraises: totalPraises ?? 0,
  };
}
