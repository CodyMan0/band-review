import '@/app/globals.css';

import { GeistSans } from 'geist/font/sans';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Harmony Band - 찬양팀 리뷰',
  description: '찬양팀을 위한 예배 영상 리뷰 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        {/* Mobile app shell — centered, phone-width */}
        <div className="mx-auto flex min-h-dvh w-full min-w-[380px] max-w-[540px] flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
