import { notFound } from 'next/navigation';

import { getSongSessions } from '@/entities/song/action/get-song-sessions';
import { createClient } from '@/shared/utils/supabase/server';

import { SongDetailClient } from './SongDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SongDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: song } = await supabase
    .from('songs')
    .select('*')
    .eq('id', id)
    .single();

  if (!song) notFound();

  const sessions = await getSongSessions(id);

  return <SongDetailClient song={song} sessions={sessions} />;
}
