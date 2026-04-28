import type { Metadata } from 'next';
import React from 'react';
import { Noto_Sans_KR } from 'next/font/google';
import '@/styles/global.css';
import Providers from './Providers';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'], //폰트 언어범주 설정해서 특정언어만 다움받기
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap', //swap 기본폰트사용후 폰트다운받으면 변경
  variable: '--font-noto-sans-kr', //css 변수
});

export const metadata: Metadata = {
  title: 'Better Me',
  description: 'Better Me - 자기개발 사이트',
  icons: {
    icon: '/assets/favicon.ico',
    apple: [{ url: '/assets/favicon.png', sizes: '180x180' }],
    other: [
      { url: '/assets/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  other: {
    'msapplication-TileColor': '#ffffff',
    'msapplication-TileImage': '/ms-icon-144x144.png',
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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
