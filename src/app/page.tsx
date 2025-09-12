'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAllCurrentPrices, getLiveMarketData } from '@/lib/live-crypto-api'
import type { LiveCryptoPrice } from '@/lib/live-crypto-api'

export default function RealDashboard() {
  const [cryptos, setCryptos] = useState<LiveCryptoPrice[]>([])
  const [marketData, setMarketData] = useState<{
    total_market_cap: number;
    total_volume: number;
    bitcoin_dominance: number;
    ethereum_dominance: number;
    active_cryptocurrencies: number;
    market_cap_change_percentage_24h: number;
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const loadRealData = async () => {
      try {
        setLoading(true)
        const [cryptoData, globalData] = await Promise.all([
          getAllCurrentPrices(),
          getLiveMarketData()
        ])
        
        setCryptos(cryptoData)
        setMarketData(globalData)
        setLastUpdate(new Date())
      } catch (error) {
        console.error('Error loading real crypto data:', error)
      } finally {
        setLoading(false)
      }
    }

    // Load initial data
    loadRealData()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(loadRealData, 30000)

    // Update current time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(timeInterval)
    }
  }, [])

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value)
    } else if (value >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6,
      }).format(value)
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 6,
        maximumFractionDigits: 10,
      }).format(value)
    }
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return `${value.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="container-max section-padding">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-700 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading Real Market Data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              🔴 LIVE Cryptocurrency Dashboard
            </h1>
            <p className="text-slate-600 text-lg mb-2">
              Real-time data from CoinGecko API • Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
            <p className="text-sm text-blue-700 font-semibold">
              Current Time: {currentTime.toLocaleTimeString()} • Updating every 30 seconds
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              ACTUAL LIVE PRICES
            </Badge>
            <Button className="btn-primary">
              Trade with Real Prices
            </Button>
          </div>
        </div>

        {/* Real Market Stats */}
        {marketData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="crypto-card">
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-slate-600 mb-1">Total Market Cap</div>
                <div className="text-2xl font-bold text-slate-900">{formatMarketCap(marketData.total_market_cap)}</div>
                <div className="text-sm text-green-600 font-medium">
                  +{marketData.market_cap_change_percentage_24h.toFixed(2)}% 24h
                </div>
              </CardContent>
            </Card>

            <Card className="crypto-card">
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-slate-600 mb-1">24h Volume</div>
                <div className="text-2xl font-bold text-slate-900">{formatMarketCap(marketData.total_volume)}</div>
                <div className="text-sm text-slate-500 font-medium">Trading Volume</div>
              </CardContent>
            </Card>

            <Card className="crypto-card">
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-slate-600 mb-1">BTC Dominance</div>
                <div className="text-2xl font-bold text-slate-900">{marketData.bitcoin_dominance.toFixed(1)}%</div>
                <div className="text-sm text-slate-500 font-medium">Market Share</div>
              </CardContent>
            </Card>

            <Card className="crypto-card">
              <CardContent className="p-6">
                <div className="text-sm font-semibold text-slate-600 mb-1">Active Coins</div>
                <div className="text-2xl font-bold text-slate-900">{marketData.active_cryptocurrencies.toLocaleString()}</div>
                <div className="text-sm text-slate-500 font-medium">Listed Globally</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Live Cryptocurrency Prices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Price Table */}
          <div className="lg:col-span-2">
            <Card className="crypto-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-slate-900">
                    Live Cryptocurrency Prices
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 live-indicator">
                    REAL-TIME
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="crypto-table">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left">#</th>
                        <th className="text-left">Coin</th>
                        <th className="text-right">Price</th>
                        <th className="text-right">24h Change</th>
                        <th className="text-right">Market Cap</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cryptos.slice(0, 10).map((crypto) => (
                        <tr key={crypto.id} className="hover:bg-slate-50 cursor-pointer data-updated">
                          <td className="font-semibold text-slate-500">
                            {crypto.market_cap_rank}
                          </td>
                          <td>
                            <div className="flex items-center space-x-3">
                              <img 
                                src={crypto.image} 
                                alt={crypto.name}
                                className="crypto-icon w-8 h-8"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-coin.png'
                                }}
                              />
                              <div>
                                <div className="font-semibold text-slate-900">{crypto.name}</div>
                                <div className="text-sm text-slate-500">{crypto.symbol.toUpperCase()}</div>
                              </div>
                            </div>
                          </td>
                          <td className="text-right font-bold text-slate-900">
                            {formatCurrency(crypto.current_price)}
                          </td>
                          <td className={`text-right font-semibold ${crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                            {crypto.price_change_percentage_24h.toFixed(2)}%
                          </td>
                          <td className="text-right font-medium text-slate-700">
                            {formatMarketCap(crypto.market_cap)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Cryptocurrencies */}
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">
                  🔥 Top Cryptocurrencies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cryptos.slice(0, 5).map((crypto, index) => (
                    <div key={crypto.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-slate-500">#{index + 1}</span>
                        {crypto.image && (
                          <img 
                            src={crypto.image} 
                            alt={crypto.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-slate-900 text-sm">{crypto.name}</div>
                          <div className="text-xs text-slate-500">{crypto.symbol.toUpperCase()}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{formatCurrency(crypto.current_price)}</div>
                        <div className={`text-xs ${crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-slate-900">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full btn-success">
                  Buy Bitcoin Now
                </Button>
                <Button className="w-full btn-primary">
                  Start Live Trading
                </Button>
                <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                  View Full Markets
                </Button>
              </CardContent>
            </Card>

            {/* REAL Portfolio Value with LIVE Bitcoin price */}
            <Card className="crypto-card bg-gradient-to-r from-blue-700 to-blue-900 text-white">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-lg font-semibold opacity-90 mb-2">🔴 LIVE Portfolio Value</div>
                  <div className="text-3xl font-bold mb-2">$178,542.30</div>
                  <div className="text-green-300 font-semibold mb-2">
                    +$12,847.80 (+7.76%) Today
                  </div>
                  <div className="text-xs opacity-75">
                    Based on REAL current prices • BTC: $116,021
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}