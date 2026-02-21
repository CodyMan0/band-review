'use server';

import { createClient } from '@/shared/utils/supabase/server';

interface CreateInquiryInput {
  author_name: string;
  content: string;
}

export async function createInquiry(input: CreateInquiryInput): Promise<{ error?: string }> {
  const { author_name, content } = input;

  if (!author_name.trim() || !content.trim()) {
    return { error: '이름과 내용을 모두 입력해주세요.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.from('inquiries').insert({
    author_name: author_name.trim(),
    content: content.trim(),
  });

  if (error) {
    return { error: '문의 등록에 실패했습니다.' };
  }

  return {};
}
