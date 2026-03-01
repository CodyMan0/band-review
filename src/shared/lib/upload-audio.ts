import { createClient } from '@/shared/utils/supabase/client';

const BUCKET = 'session-audio';

export async function uploadAudio(
  sessionId: string,
  blob: Blob,
): Promise<string> {
  const supabase = createClient();
  const fileName = `${sessionId}-${Date.now()}.m4a`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, blob, {
      contentType: 'audio/mp4',
      upsert: false,
    });

  if (error) throw new Error(`오디오 업로드 실패: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function saveAudioUrl(
  sessionId: string,
  audioUrl: string,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from('sessions')
    .update({ audio_url: audioUrl })
    .eq('id', sessionId);

  if (error) throw new Error(`오디오 URL 저장 실패: ${error.message}`);
}
