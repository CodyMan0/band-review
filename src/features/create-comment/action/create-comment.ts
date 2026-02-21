'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/shared/utils/supabase/server';

interface CreateCommentInput {
  session_id: string;
  parent_id?: string | null;
  timestamp_sec: number;
  author_name: string;
  author_part: string;
  content: string;
}

export async function createComment(input: CreateCommentInput): Promise<{ error?: string }> {
  const { session_id, parent_id, timestamp_sec, author_name, author_part, content } = input;

  if (!content.trim()) {
    return { error: '내용을 입력해주세요.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('comments').insert({
    session_id,
    parent_id: parent_id || null,
    timestamp_sec,
    author_name,
    author_part,
    content,
  });

  if (error) {
    return { error: '코멘트 작성에 실패했습니다.' };
  }

  revalidatePath(`/session/${session_id}`);
  return {};
}
