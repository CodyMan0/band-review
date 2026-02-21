import Link from 'next/link';

import { CreateSessionForm } from '@/features/create-session/ui/CreateSessionForm';

export default function NewSessionPage() {
  return (
    <div className="flex flex-1 flex-col px-5 pb-8 pt-4">
      {/* Back button — mobile pattern */}
      <Link
        href="/"
        className="mb-6 inline-flex w-fit items-center gap-1 text-sm text-muted-foreground active:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        돌아가기
      </Link>

      <div className="mb-8">
        <h1 className="text-xl font-bold">새 예배 기록</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          영상을 등록하면 팀원들과 피드백을 나눌 수 있어요
        </p>
      </div>

      <CreateSessionForm />
    </div>
  );
}
