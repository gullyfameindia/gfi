import type { Metadata } from 'next'
import './globals.css'
import AuthGuard from '@/components/AuthGuard'

export const metadata: Metadata = {
  title: 'Gully Fame Admin',
  description: 'Admin and sponsor dashboard for Gully Fame competition and content management',
  openGraph: {
    title: 'Gully Fame Admin',
    description: 'Admin and sponsor dashboard for Gully Fame competition and content management',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  )
}

