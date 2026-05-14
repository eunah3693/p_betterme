import type { Metadata } from 'next';
import React from 'react';
import { Noto_Sans_KR } from 'next/font/google';
import '@/styles/global.css';
import Providers from './Providers';
import WebVitals from './WebVitals';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'], //폰트 언어범주 설정해서 특정언어만 다움받기
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap', //swap 기본폰트사용후 폰트다운받으면 변경
  variable: '--font-noto-sans-kr', //css 변수
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.better-me.site'),
  title: 'Better Me',
  description: 'Better Me - 자기개발 사이트',
  icons: {
    icon: '/assets/favicon.ico',
    apple: [{ url: '/assets/favicon.png', sizes: '180x180' }],
    other: [
      { url: '/assets/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Better Me',
    description: '나를 발전시키는 자기개발 서비스',
    url: 'https://www.better-me.site',
    siteName: 'Better Me',
    locale: 'ko_KR',
    type: 'website',
  },
  verification: {
    google:
      'google-site-verification=_NFGyCLXNUPZT1BNPB_Bz7Ag7PLM9urKHDsOdlZ2xl4',
  },
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/assets/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className={notoSansKR.className}>
        <WebVitals />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
