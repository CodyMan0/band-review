'use server';

import { createClient } from '@/shared/utils/supabase/server';

export async function getPraiseCount(sessionId: string): Promise<number> {
  const supabase = await createClient();

  const { count } = await supabase
    .from('praises')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId);

  return count ?? 0;
}
