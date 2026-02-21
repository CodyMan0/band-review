import '@/app/globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Harmony Band — 찬양팀 리뷰 플랫폼',
  description:
    '예배 영상에 타임스탬프 기반 피드백과 칭찬을 남기고, 함께 성장하는 찬양팀 리뷰 플랫폼',
  keywords: ['찬양팀', '예배', '리뷰', '피드백', '칭찬', '워십밴드'],
  openGraph: {
    title: 'Harmony Band — 찬양팀 리뷰 플랫폼',
    description:
      '예배 영상에 타임스탬프 기반 피드백과 칭찬을 남기고, 함께 성장하는 찬양팀 리뷰 플랫폼',
    siteName: 'Harmony Band',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="bg-background text-foreground">
        {/* Mobile app shell — centered, phone-width */}
        <div className="mx-auto flex min-h-dvh w-full max-w-[540px] flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
