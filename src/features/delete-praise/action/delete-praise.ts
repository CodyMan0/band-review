'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/shared/utils/supabase/server';

interface DeletePraiseResult {
  success?: boolean;
  error?: string;
}

export async function deletePraise(praiseId: string): Promise<DeletePraiseResult> {
  const supabase = await createClient();

  // Get session_id for revalidation
  const { data: praise } = await supabase
    .from('praises')
    .select('session_id')
    .eq('id', praiseId)
    .single();

  const { error } = await supabase
    .from('praises')
    .delete()
    .eq('id', praiseId);

  if (error) {
    return { error: '칭찬 삭제에 실패했습니다.' };
  }

  if (praise?.session_id) {
    revalidatePath(`/session/${praise.session_id}`);
  }

  return { success: true };
}
