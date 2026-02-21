'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/shared/utils/supabase/server';

interface CreatePraiseInput {
  session_id: string;
  timestamp_sec: number;
  author_name: string;
  author_part: string;
  target_part: string;
  content: string;
}

export async function createPraise(input: CreatePraiseInput): Promise<{ error?: string }> {
  const { session_id, timestamp_sec, author_name, author_part, target_part, content } = input;

  if (!content.trim()) {
    return { error: '내용을 입력해주세요.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('praises').insert({
    session_id,
    timestamp_sec,
    author_name,
    author_part,
    target_part,
    content: content.trim(),
  });

  if (error) {
    return { error: '칭찬 등록에 실패했습니다.' };
  }

  revalidatePath(`/session/${session_id}`);
  return {};
}
