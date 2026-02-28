'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { getDashboardStats, type DashboardStats } from '@/entities/session/action/get-dashboard-stats';
import { getSessions } from '@/entities/session/action/get-sessions';
import { SessionCard } from '@/entities/session/ui/SessionCard';
import { type SessionWithCommentCount } from '@/entities/session/model/session.interface';
import { getSongs } from '@/entities/song/action/get-songs';
import { type SongWithSessionCount } from '@/entities/song/model/song.interface';
import { SongCard } from '@/entities/song/ui/SongCard';
import { deleteSession } from '@/features/delete-session/action/delete-session';
import { deleteSong } from '@/features/delete-song/action/delete-song';
import { SettingsMenu } from '@/features/inquiry/ui/SettingsMenu';
import { getProfile } from '@/shared/config/profile';
import { BottomSheet, Button, Input, ScrollArea } from '@/shared/ui';
import { CarrotEmpty } from '@/shared/ui/icons';

export function HomeClient() {
  const [sessions, setSessions] = useState<SessionWithCommentCount[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalSessions: 0, totalComments: 0, totalPraises: 0 });
  const [songs, setSongs] = useState<SongWithSessionCount[]>([]);
  const [activeTab, setActiveTab] = useState<'sessions' | 'songs'>('sessions');
  const [songSearch, setSongSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<SessionWithCommentCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [songDeleteTarget, setSongDeleteTarget] = useState<SongWithSessionCount | null>(null);
  const [isSongDeleting, setIsSongDeleting] = useState(false);
  const [songDeleteError, setSongDeleteError] = useState('');

  // Song stats
  const songStats = useMemo(() => {
    if (songs.length === 0) return { total: 0, mostPlayed: '-', leastPlayed: '-' };
    const sorted = [...songs].sort((a, b) => b.session_count - a.session_count);
    return {
      total: songs.length,
      mostPlayed: sorted[0]?.name ?? '-',
      leastPlayed: sorted[sorted.length - 1]?.name ?? '-',
    };
  }, [songs]);

  const handleDeleteRequest = (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      setDeleteTarget(target);
      setDeleteError('');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const result = await deleteSession(deleteTarget.id);
    setIsDeleting(false);

    if (result.error) {
      setDeleteError(result.error);
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleDeleteClose = () => {
    setDeleteTarget(null);
    setDeleteError('');
  };

  const handleSongDeleteRequest = (songId: string) => {
    const target = songs.find((s) => s.id === songId);
    if (target) {
      setSongDeleteTarget(target);
      setSongDeleteError('');
    }
  };

  const handleSongDeleteConfirm = async () => {
    if (!songDeleteTarget) return;
    setIsSongDeleting(true);
    const result = await deleteSong(songDeleteTarget.id);
    setIsSongDeleting(false);

    if (result.error) {
      setSongDeleteError(result.error);
      return;
    }
    setSongs((prev) => prev.filter((s) => s.id !== songDeleteTarget.id));
    setSongDeleteTarget(null);
  };

  const handleSongDeleteClose = () => {
    setSongDeleteTarget(null);
    setSongDeleteError('');
  };

  useEffect(() => {
    const profile = getProfile();
    if (!profile) return;

    Promise.all([
      getSessions(profile.churchId),
      getDashboardStats(profile.churchId),
      getSongs(profile.churchId),
    ]).then(([sessionsData, statsData, songsData]) => {
      setSessions(sessionsData);
      setStats(statsData);
      setSongs(songsData);
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
          <div className="mb-3 flex gap-4">
            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredSongs = songs.filter((s) =>
    s.name.toLowerCase().includes(songSearch.toLowerCase()),
  );

  return (
    <div className="flex h-dvh flex-col pt-8">
      <div className="shrink-0 px-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mt-1 text-[22px] font-bold tracking-tight">대시보드</h1>
          </div>
          <SettingsMenu />
        </div>

        {/* Dashboard stats — crossfade by tab, no layout shift */}
        <div className="relative mt-4">
          {/* Invisible spacer to hold height */}
          <div className="invisible flex flex-wrap gap-2" aria-hidden="true">
            <StatCard label="—" value={0} unit="—" />
            <StatCard label="—" value={0} unit="—" />
            <StatCard label="—" value={0} unit="—" />
          </div>
          <AnimatePresence initial={false}>
            {activeTab === 'sessions' ? (
              <motion.div
                key="session-stats"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 flex flex-wrap gap-2"
              >
                <StatCard label="총 예배" value={stats.totalSessions} unit="회" />
                <StatCard label="총 리뷰" value={stats.totalComments} unit="개" />
                <StatCard label="총 칭찬" value={stats.totalPraises} unit="개" />
              </motion.div>
            ) : (
              <motion.div
                key="song-stats"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0 flex flex-wrap gap-2"
              >
                <StatCard label="총 곡 수" value={songStats.total} unit="곡" />
                <StatCardText label="자주 연주한 곡" value={songStats.mostPlayed} />
                <StatCardText label="적게 연주한 곡" value={songStats.leastPlayed} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mx-5 mb-4 mt-6 shrink-0 h-px bg-border" />

      <div className="flex min-h-0 flex-1 flex-col pb-24">
        {/* Tab switcher */}
        <div className="mb-3 flex w-full border-b border-border/40 px-5">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`relative flex-1 py-2.5 text-center text-sm font-medium transition-colors ${
              activeTab === 'sessions' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            예배 {sessions.length}
            {activeTab === 'sessions' && (
              <div className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('songs')}
            className={`relative flex-1 py-2.5 text-center text-sm font-medium transition-colors ${
              activeTab === 'songs' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            곡 {songs.length}
            {activeTab === 'songs' && (
              <div className="absolute bottom-0 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-primary" />
            )}
          </button>
        </div>

        {/* Tab content with ScrollArea + crossfade */}
        <ScrollArea className="flex-1">
          <div className="px-4 pt-1">
            <AnimatePresence mode="wait" initial={false}>
              {activeTab === 'sessions' ? (
                <motion.div
                  key="sessions-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="pb-2"
                >
                  {sessions.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div className="flex flex-col gap-2">
                      {sessions.map((session) => (
                        <SessionCard key={session.id} session={session} onDelete={handleDeleteRequest} />
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="songs-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="pb-2"
                >
                  <Input
                    placeholder="곡 검색..."
                    value={songSearch}
                    onChange={(e) => setSongSearch(e.target.value)}
                    className="mb-3 h-10 rounded-xl text-sm"
                  />
                  {filteredSongs.length === 0 ? (
                    <div className="flex flex-col items-center py-12">
                      <CarrotEmpty size={56} className="mb-3 opacity-80" />
                      <p className="text-sm font-medium text-muted-foreground">아직 등록된 곡이 없어요</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {filteredSongs.map((song) => (
                        <SongCard key={song.id} song={song} onDelete={handleSongDeleteRequest} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </div>

      <Link
        href="/session/new"
        className="fixed bottom-6 right-4 z-30 sm:right-1/2 sm:translate-x-[calc(min(270px,50vw)-8px)]"
      >
        <Button className="h-12 w-12 rounded-full p-0 shadow-lg active:scale-95">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Button>
      </Link>

      {/* Delete confirmation bottom sheet */}
      <BottomSheet open={!!deleteTarget && !deleteError} onOpenChange={(open) => { if (!open) handleDeleteClose(); }}>
        <div className="flex flex-col items-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7H24M10 7V5C10 4.2 10.6 3.5 11.5 3.5H16.5C17.4 3.5 18 4.2 18 5V7M21 7V23C21 23.8 20.4 24.5 19.5 24.5H8.5C7.6 24.5 7 23.8 7 23V7" />
            </svg>
          </div>
          <p className="mt-3 text-base font-semibold">세션을 삭제할까요?</p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            &quot;{deleteTarget?.title}&quot;을(를) 삭제하면 복구할 수 없어요
          </p>
          <div className="mt-5 flex w-full gap-2">
            <Button
              onClick={handleDeleteClose}
              variant="outline"
              className="h-11 flex-1 rounded-xl text-sm"
            >
              취소
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="destructive"
              disabled={isDeleting}
              className="h-11 flex-1 rounded-xl text-sm font-semibold"
            >
              {isDeleting ? '삭제 중...' : '삭제하기'}
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Delete error modal */}
      <BottomSheet open={!!deleteTarget && !!deleteError} onOpenChange={(open) => { if (!open) handleDeleteClose(); }}>
        <div className="flex flex-col items-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 10V16M14 20H14.01M3.5 22.5H24.5L14 4L3.5 22.5Z" />
            </svg>
          </div>
          <p className="mt-3 text-base font-semibold">삭제할 수 없어요</p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {deleteError}
          </p>
          <Button
            onClick={handleDeleteClose}
            className="mt-5 h-11 w-full rounded-xl text-sm font-semibold"
          >
            확인
          </Button>
        </div>
      </BottomSheet>

      {/* Song delete confirmation */}
      <BottomSheet open={!!songDeleteTarget && !songDeleteError} onOpenChange={(open) => { if (!open) handleSongDeleteClose(); }}>
        <div className="flex flex-col items-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 7H24M10 7V5C10 4.2 10.6 3.5 11.5 3.5H16.5C17.4 3.5 18 4.2 18 5V7M21 7V23C21 23.8 20.4 24.5 19.5 24.5H8.5C7.6 24.5 7 23.8 7 23V7" />
            </svg>
          </div>
          <p className="mt-3 text-base font-semibold">곡을 삭제할까요?</p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            &quot;{songDeleteTarget?.name}&quot;을(를) 삭제하면 복구할 수 없어요
          </p>
          <div className="mt-5 flex w-full gap-2">
            <Button
              onClick={handleSongDeleteClose}
              variant="outline"
              className="h-11 flex-1 rounded-xl text-sm"
            >
              취소
            </Button>
            <Button
              onClick={handleSongDeleteConfirm}
              variant="destructive"
              disabled={isSongDeleting}
              className="h-11 flex-1 rounded-xl text-sm font-semibold"
            >
              {isSongDeleting ? '삭제 중...' : '삭제하기'}
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Song delete error */}
      <BottomSheet open={!!songDeleteTarget && !!songDeleteError} onOpenChange={(open) => { if (!open) handleSongDeleteClose(); }}>
        <div className="flex flex-col items-center py-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 10V16M14 20H14.01M3.5 22.5H24.5L14 4L3.5 22.5Z" />
            </svg>
          </div>
          <p className="mt-3 text-base font-semibold">삭제할 수 없어요</p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            {songDeleteError}
          </p>
          <Button
            onClick={handleSongDeleteClose}
            className="mt-5 h-11 w-full rounded-xl text-sm font-semibold"
          >
            확인
          </Button>
        </div>
      </BottomSheet>
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

function StatCardText({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-[calc(50%-4px)] flex-1 flex-col rounded-xl border border-border bg-card px-4 py-3">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <p className="mt-1 truncate text-sm font-bold tracking-tight text-foreground">{value}</p>
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
