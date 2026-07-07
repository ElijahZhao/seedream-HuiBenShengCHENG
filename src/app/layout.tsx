import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Navigation } from '@/components/navigation';

export const metadata: Metadata = {
  title: {
    default: '绘本自由创作 | AI 绘本创作平台',
    template: '%s | 绘本自由创作',
  },
  description:
    'Seedream 绘本是一款 AI 驱动的智能绘本创作平台。通过智能分镜、角色一致性和多风格生成，轻松创作精美绘本。',
  keywords: [
    'AI绘本',
    'Seedream',
    '绘本生成',
    '儿童绘本',
    '智能创作',
    '故事生成',
    '插画生成',
    '分镜设计',
  ],
  authors: [{ name: 'Seedream Team' }],
  generator: 'Seedream Picturebook',
  icons: {
    icon: '/icon.png',
  },
  openGraph: {
    title: 'Seedream 绘本 | 让想象力成为绘本',
    description:
      'AI 驱动的智能绘本创作平台，轻松创作精美儿童绘本。',
    url: 'https://seedream-picturebook.com',
    siteName: 'Seedream 绘本',
    locale: 'zh_CN',
    type: 'website',
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`antialiased font-body`}>
        <Navigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
