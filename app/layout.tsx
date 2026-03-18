import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '图片去背景工具 | Image Background Remover',
  description: 'AI 智能去除图片背景，无需注册，即传即处理',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {children}
      </body>
    </html>
  )
}
