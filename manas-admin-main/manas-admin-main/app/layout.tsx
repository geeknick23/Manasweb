import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Manas-admin',
  description: 'Only authorized users',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
