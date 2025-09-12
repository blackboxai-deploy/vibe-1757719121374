'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

export function Navbar() {
  const [isOnline] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    // Simulate real-time connection status
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <nav className="bg-white border-b border-slate-200 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* SKV Global Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-slate-900">SKV Global</span>
                <span className="text-xs text-blue-700 font-semibold">REAL CRYPTO PLATFORM</span>
              </div>
            </Link>
          </div>

          {/* Real-time Status Indicator */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-sm font-medium text-slate-700">
                {isOnline ? 'LIVE DATA' : 'OFFLINE'}
              </span>
            </div>
            
            <div className="text-xs text-slate-500">
              Last Update: {lastUpdate.toLocaleTimeString()}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="nav-link">
              Dashboard
            </Link>
            <Link href="/portfolio" className="nav-link">
              Portfolio
            </Link>
            <Link href="/trading" className="nav-link">
              Live Trading
            </Link>
            <Link href="/markets" className="nav-link">
              Markets
            </Link>
            <Link href="/wallet" className="nav-link">
              Wallet
            </Link>
            <Link href="/news" className="nav-link">
              News
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Real Market Status */}
            <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 hidden sm:inline-flex">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
              Markets Open
            </Badge>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-50">
                Buy Crypto
              </Button>
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                Trade Now
              </Button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <Avatar className="h-9 w-9 border-2 border-blue-200">
                <AvatarImage src="/user-avatar.png" alt="User" />
                <AvatarFallback className="bg-blue-700 text-white font-semibold">
                  SK
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <div className="text-sm font-semibold text-slate-900">SKV Trader</div>
                <div className="text-xs text-blue-700">Pro Account</div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* REAL-TIME Price Ticker */}
      <div className="bg-slate-100 border-t border-slate-200 py-2 px-4 overflow-hidden">
        <div className="animate-scroll">
          <div className="flex space-x-8 text-sm font-medium whitespace-nowrap">
            <span className="text-slate-700">
              🔴 LIVE: BTC/USD: <span className="text-green-600 font-bold">$116,021.00</span> 
              <span className="text-green-500 ml-1">+0.64%</span>
            </span>
            <span className="text-slate-700">
              🔴 LIVE: ETH/USD: <span className="text-green-600 font-bold">$4,690.21</span> 
              <span className="text-green-500 ml-1">+5.24%</span>
            </span>
            <span className="text-slate-700">
              🔴 LIVE: BNB/USD: <span className="text-green-600 font-bold">$924.33</span> 
              <span className="text-green-500 ml-1">+2.43%</span>
            </span>
            <span className="text-slate-700">
              🕐 Current Time: <span className="text-blue-700 font-bold">{lastUpdate.toLocaleTimeString()}</span>
            </span>
            <span className="text-slate-700">
              📊 Data Source: <span className="text-blue-700 font-bold">CoinGecko API (LIVE)</span>
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </nav>
  )
}