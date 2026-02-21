'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/shared/utils/supabase/server';

interface CreateSessionState {
  error?: string;
}

export async function createSession(
  _prevState: CreateSessionState,
  formData: FormData,
): Promise<CreateSessionState> {
  const title = formData.get('title') as string;
  const date = formData.get('date') as string;
  const videoUrl = formData.get('video_url') as string;
  const videoType = formData.get('video_type') as string;
  const churchId = formData.get('church_id') as string;

  if (!title || !date || !videoUrl || !videoType || !churchId) {
    return { error: '모든 필드를 입력해주세요.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sessions')
    .insert({ title, date, video_url: videoUrl, video_type: videoType, church_id: churchId })
    .select('id')
    .single();

  if (error) {
    return { error: '세션 생성에 실패했습니다.' };
  }

  redirect(`/session/${data.id}`);
}
