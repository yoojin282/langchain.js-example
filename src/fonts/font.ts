import { Noto_Sans_KR } from 'next/font/google';
import localFont from 'next/font/local';

const pretendard = localFont({
  src: './PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});

const notoSans = Noto_Sans_KR({
  variable: '--font-noto-sans',
  display: 'swap',
  subsets: ['latin'],
});

export { pretendard, notoSans };
