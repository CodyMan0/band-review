'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getDashboardStats, type DashboardStats } from '@/entities/session/action/get-dashboard-stats';
import { getSessions } from '@/entities/session/action/get-sessions';
import { SessionCard } from '@/entities/session/ui/SessionCard';
import { type SessionWithCommentCount } from '@/entities/session/model/session.interface';
import { deleteSession } from '@/features/delete-session/action/delete-session';
import { SettingsMenu } from '@/features/inquiry/ui/SettingsMenu';
import { getProfile } from '@/shared/config/profile';
import { Button } from '@/shared/ui';
import { CarrotEmpty } from '@/shared/ui/icons';

export function HomeClient() {
  const [sessions, setSessions] = useState<SessionWithCommentCount[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalSessions: 0, totalComments: 0, totalPraises: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const handleDeleteSession = async (sessionId: string) => {
    const result = await deleteSession(sessionId);
    if (result.error) {
      alert(result.error);
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  useEffect(() => {
    const profile = getProfile();
    if (!profile) return;

    Promise.all([
      getSessions(profile.churchId),
      getDashboardStats(profile.churchId),
    ]).then(([sessionsData, statsData]) => {
      setSessions(sessionsData);
      setStats(statsData);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col pb-24 pt-8">
        <div className="px-5">
          <div className="flex items-start justify-between">
            <div className="h-7 w-24 animate-pulse rounded-lg bg-muted" />
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex min-w-[calc(50%-4px)] flex-1 flex-col rounded-xl border border-border bg-card px-4 py-3">
                <div className="h-3 w-12 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-6 w-8 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
        <div className="mx-5 mb-4 mt-6 h-px bg-border" />
        <div className="flex-1 px-5">
          <div className="mb-3 h-5 w-16 animate-pulse rounded bg-muted" />
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col pb-24 pt-8">
      <div className="px-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mt-1 text-[22px] font-bold tracking-tight">대시보드</h1>
          </div>
          <SettingsMenu />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <StatCard label="총 예배" value={stats.totalSessions} unit="회" />
          <StatCard label="총 리뷰" value={stats.totalComments} unit="개" />
          <StatCard label="총 칭찬" value={stats.totalPraises} unit="개" />
        </div>
      </div>

      <div className="mx-5 mb-4 mt-6 h-px bg-border" />

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
              <SessionCard key={session.id} session={session} onDelete={handleDeleteSession} />
            ))}
          </div>
        )}
      </div>

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
      <CarrotEmpty size={56} className="mb-3 opacity-80" />
      <p className="text-sm font-medium text-muted-foreground">아직 등록된 예배가 없어요</p>
      <p className="mt-1 text-xs text-muted-foreground">+ 버튼으로 첫 세션을 만들어보세요</p>
    </div>
  );
}
