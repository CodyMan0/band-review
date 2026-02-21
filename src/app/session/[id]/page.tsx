import { notFound } from 'next/navigation';

import { getComments } from '@/entities/comment/action/get-comments';
import { getPraises } from '@/entities/praise/action/get-praises';
import { getSession } from '@/entities/session/action/get-session';

import { SessionDetailClient } from './SessionDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SessionDetailPage({ params }: Props) {
  const { id } = await params;
  const [session, comments, praises] = await Promise.all([
    getSession(id),
    getComments(id),
    getPraises(id),
  ]);

  if (!session) notFound();

  return <SessionDetailClient session={session} initialComments={comments} initialPraises={praises} />;
}
