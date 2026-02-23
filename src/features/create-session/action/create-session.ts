'use server';

import { redirect } from 'next/navigation';

import { saveSessionSongs } from '@/features/create-session-songs/action/save-session-songs';
import { createClient } from '@/shared/utils/supabase/server';

interface CreateSessionState {
  error?: string;
}

function isValidYoutubeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(?:www\.)?youtube\.com\/watch\?v=[^&\s]+/,
    /^https?:\/\/youtu\.be\/[^?\s]+/,
    /^https?:\/\/(?:www\.)?youtube\.com\/embed\/[^?\s]+/,
    /^https?:\/\/(?:www\.)?youtube\.com\/shorts\/[^?\s]+/,
  ];
  return patterns.some((pattern) => pattern.test(url));
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
  const created_by = formData.get('created_by') as string;

  if (!title || !date || !videoUrl || !videoType || !churchId) {
    return { error: '모든 필드를 입력해주세요.' };
  }

  if (videoType === 'youtube' && !isValidYoutubeUrl(videoUrl)) {
    return { error: '올바른 YouTube 링크를 입력해주세요. (예: https://youtube.com/watch?v=...)' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('sessions')
    .insert({ title, date, video_url: videoUrl, video_type: videoType, church_id: churchId, created_by })
    .select('id')
    .single();

  if (error) {
    return { error: '세션 생성에 실패했습니다.' };
  }

  // Save session songs (optional)
  const songsJson = formData.get('songs_json') as string | null;
  if (songsJson) {
    try {
      const songs = JSON.parse(songsJson) as { name: string; startTimeSec: number }[];
      if (Array.isArray(songs) && songs.length > 0) {
        await saveSessionSongs(data.id, churchId, songs);
      }
    } catch {
      // Ignore malformed songs_json - session was created successfully
    }
  }

  redirect(`/session/${data.id}`);
}
