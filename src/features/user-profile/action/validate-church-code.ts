'use server';

import { createClient } from '@/shared/utils/supabase/server';

interface ValidateResult {
  success: boolean;
  churchId?: string;
  churchName?: string;
  error?: string;
}

export async function validateChurchCode(code: string): Promise<ValidateResult> {
  if (!code.trim()) {
    return { success: false, error: '교회 코드를 입력해주세요.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('churches')
    .select('id, name')
    .eq('code', code.trim())
    .single();

  if (error || !data) {
    return { success: false, error: '존재하지 않는 교회 코드입니다.' };
  }

  return {
    success: true,
    churchId: data.id,
    churchName: data.name,
  };
}
