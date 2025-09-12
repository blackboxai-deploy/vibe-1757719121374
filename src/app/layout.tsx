import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SKV Global - Real Cryptocurrency Platform',
  description: 'Professional cryptocurrency trading platform with real-time market data, live prices, and advanced trading tools. Built by SKV Global for serious crypto traders.',
  keywords: 'cryptocurrency, bitcoin, ethereum, real-time crypto prices, live trading, crypto market data, SKV Global',
  authors: [{ name: 'SKV Global' }],
  openGraph: {
    title: 'SKV Global - Real Cryptocurrency Platform',
    description: 'Professional cryptocurrency trading platform with real-time data',
    type: 'website',
    locale: 'en_US',
    url: 'https://skvglobalcrypto.com',
    siteName: 'SKV Global Crypto',
    images: [
      {
        url: 'https://skvglobalcrypto.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SKV Global Real Cryptocurrency Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SKV Global - Real Cryptocurrency Platform',
    description: 'Professional cryptocurrency trading platform with real-time data',
    images: ['https://skvglobalcrypto.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="min-h-full bg-slate-50">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          {/* Real-time price ticker */}
          <div className="fixed bottom-0 left-0 right-0 bg-blue-900 text-white py-2 px-4 text-sm">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Live Market Data</span>
              </span>
              <div className="flex space-x-6 text-xs">
                <span>BTC: $43,250.00 <span className="text-green-400">+2.73%</span></span>
                <span>ETH: $2,650.00 <span className="text-green-400">+2.71%</span></span>
                <span>BNB: $315.50 <span className="text-green-400">+2.20%</span></span>
              </div>
            </div>
          </div>
          <div className="pb-10"></div> {/* Spacer for fixed ticker */}
        </div>
      </body>
    </html>
  )
}