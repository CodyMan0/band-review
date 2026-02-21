import Link from 'next/link';

import { getDashboardStats } from '@/entities/session/action/get-dashboard-stats';
import { getSessions } from '@/entities/session/action/get-sessions';
import { SessionCard } from '@/entities/session/ui/SessionCard';
import { Button } from '@/shared/ui';

export default async function HomePage() {
  const [sessions, stats] = await Promise.all([
    getSessions(),
    getDashboardStats(),
  ]);

  return (
    <div className="flex flex-1 flex-col pb-24 pt-8">
      {/* Dashboard section */}
      <div className="px-5">
        <p className="text-xs font-medium text-muted-foreground">🎵 Harmony Band</p>
        <h1 className="mt-1 text-[22px] font-bold tracking-tight">대시보드</h1>

        {/* Stats cards */}
        <div className="mt-4 flex flex-wrap gap-2">
          <StatCard label="총 예배" value={stats.totalSessions} unit="회" />
          <StatCard label="총 리뷰" value={stats.totalComments} unit="개" />
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 mt-6 mb-4 h-px bg-border" />

      {/* Session list section */}
      <div className="flex-1 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold">예배 목록</h2>
          <span className="text-xs text-muted-foreground">{sessions.length}개</span>
        </div>

        {sessions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-2">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      {/* FAB — 새 세션 추가 (우측) */}
      <Link
        href="/session/new"
        className="fixed bottom-6 right-1/2 z-30 translate-x-[calc(min(270px,50vw)-8px)]"
      >
        <Button className="h-12 w-12 rounded-full p-0 shadow-lg active:scale-95">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Button>
      </Link>
    </div>
  );
}

function StatCard({ label, value, unit }: { label: string; value: number | string; unit?: string }) {
  return (
    <div className="flex min-w-[calc(50%-4px)] flex-1 flex-col rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-baseline gap-0.5">
        <span className="text-xl font-bold tracking-tight text-foreground">{value}</span>
        {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center py-12">
      <p className="text-sm font-medium text-muted-foreground">아직 등록된 예배가 없어요</p>
      <p className="mt-1 text-xs text-muted-foreground">+ 버튼으로 첫 세션을 만들어보세요</p>
    </div>
  );
}

