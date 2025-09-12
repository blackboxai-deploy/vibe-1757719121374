'use client'

import React from 'react'
import { RealPriceDisplay } from '@/components/RealPriceDisplay'

export default function LivePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            🔴 LIVE Cryptocurrency Prices
          </h1>
          <p className="text-xl text-slate-600 mb-2">
            Real-time data from CoinGecko API - Updated every 30 seconds
          </p>
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">ACTUAL CURRENT PRICES</span>
          </div>
        </div>

        {/* Real Price Display Component */}
        <RealPriceDisplay />

        {/* API Information */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-3">🔗 Live Data Sources:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-4 border">
              <div className="font-semibold text-slate-900">CoinGecko API</div>
              <div className="text-slate-600">Primary source for crypto prices</div>
              <div className="text-green-600 font-medium">✅ Active</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="font-semibold text-slate-900">Binance API</div>
              <div className="text-slate-600">Backup for major cryptocurrencies</div>
              <div className="text-green-600 font-medium">✅ Active</div>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <div className="font-semibold text-slate-900">Real-Time Updates</div>
              <div className="text-slate-600">Automatic refresh every 30 seconds</div>
              <div className="text-blue-600 font-medium">🔄 Running</div>
            </div>
          </div>
        </div>

        {/* Current Time Display */}
        <div className="mt-4 text-center">
          <div className="text-sm text-slate-500">
            Current Time: {new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZoneName: 'short'
            })}
          </div>
        </div>
      </div>
    </div>
  )
}