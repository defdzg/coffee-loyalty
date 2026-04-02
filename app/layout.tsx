import type { Metadata } from 'next'
import { Doto, Space_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'
import Providers from './providers'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const doto = Doto({
  variable: '--font-doto',
  subsets: ['latin'],
  weight: '400',
})

export const metadata: Metadata = {
  title: 'Coffee Loyalty',
  description: 'Nothing-inspired loyalty interface',
  manifest: '/manifest.json',
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Coffee Loyalty',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${spaceMono.variable} ${doto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--black)] text-[var(--text-primary)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
