import type { Metadata } from 'next';
import './globals.css';
import Header from './header';
import { pretendard, notoSans } from '@/fonts/font';
import clsx from 'clsx';

export const metadata: Metadata = {
  title: 'LangChain Chatbot',
  description: 'Langchain Chatbot 예제 프로젝트입니다.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={clsx(pretendard.variable, notoSans.variable, 'antialiased')}>
        <div className="flex flex-col">
          <Header />
          <main className="grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
