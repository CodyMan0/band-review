import Link from "next/link";

import { getSessions } from "@/entities/session/action/get-sessions";
import { SessionCard } from "@/entities/session/ui/SessionCard";
import { Button } from "@/shared/ui";

export default async function HomePage() {
  const sessions = await getSessions();

  return (
    <div className="flex flex-1 flex-col px-5 pb-6 pt-10">
      {/* App title area — like a native app screen title */}
      <div className="mb-6">
        <h1 className="mt-1 text-[22px] font-bold tracking-tight">예배 리뷰</h1>
      </div>

      {/* Session list */}
      {sessions.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-1 flex-col gap-2">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}

      {/* FAB — fixed bottom right like a mobile app */}
      <Link
        href="/session/new"
        className="fixed bottom-6 right-1/2 z-30 translate-x-[calc(min(270px,50vw)-8px)]"
      >
        <Button className="h-12 w-12 rounded-full p-0 shadow-lg active:scale-95">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 3V17M3 10H17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Button>
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-16">
      <p className="mt-5 text-base font-semibold">아직 등록된 예배가 없어요</p>
      <p className="mt-2 max-w-[200px] text-center text-[13px] leading-relaxed text-muted-foreground">
        첫 번째 예배 영상을 올려보세요
      </p>
    </div>
  );
}
