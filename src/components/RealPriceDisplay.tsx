'use client'

import React, { useState, useEffect } from 'react'
import { getAllCurrentPrices, getLiveMarketData } from '@/lib/live-crypto-api'
import type { LiveCryptoPrice } from '@/lib/live-crypto-api'

export function RealPriceDisplay() {
  const [prices, setPrices] = useState<LiveCryptoPrice[]>([])
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
  const [error, setError] = useState<string | null>(null)

  const fetchLiveData = async () => {
    try {
      setError(null)
      const [priceData, globalData] = await Promise.all([
        getAllCurrentPrices(),
        getLiveMarketData()
      ])
      
      if (priceData.length > 0) {
        setPrices(priceData)
        setLastUpdate(new Date())
      }
      
      if (globalData) {
        setMarketData(globalData)
      }
      
    } catch (err) {
      console.error('Error fetching live data:', err)
      setError('Failed to fetch live prices. Showing last known data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch initial data
    fetchLiveData()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchLiveData, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    } else if (price >= 1) {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
      })
    } else {
      return price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 6,
        maximumFractionDigits: 10
      })
    }
  }

  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-700 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600">Fetching REAL cryptocurrency prices...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status and Last Update */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 border shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-semibold text-slate-900">LIVE DATA</span>
          <span className="text-sm text-slate-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        {error && (
          <div className="text-red-600 text-sm font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Market Overview */}
      {marketData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="text-sm text-slate-600">Market Cap</div>
            <div className="text-xl font-bold text-slate-900">
              {formatMarketCap(marketData.total_market_cap)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="text-sm text-slate-600">24h Volume</div>
            <div className="text-xl font-bold text-slate-900">
              {formatMarketCap(marketData.total_volume)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="text-sm text-slate-600">BTC Dominance</div>
            <div className="text-xl font-bold text-slate-900">
              {marketData.bitcoin_dominance.toFixed(1)}%
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border shadow-sm">
            <div className="text-sm text-slate-600">Active Coins</div>
            <div className="text-xl font-bold text-slate-900">
              {marketData.active_cryptocurrencies.toLocaleString()}
            </div>
          </div>
        </div>
      )}

      {/* Live Price Table */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Real-Time Cryptocurrency Prices</h3>
          <p className="text-sm text-slate-600">Updated every 30 seconds from CoinGecko API</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">#</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Coin</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Current Price</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">24h Change</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-700">Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {prices.slice(0, 20).map((crypto, index) => (
                <tr key={crypto.id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-medium">{index + 1}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      {crypto.image && (
                        <img 
                          src={crypto.image} 
                          alt={crypto.name}
                          className="w-8 h-8 rounded-full"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                      <div>
                        <div className="font-semibold text-slate-900">{crypto.name}</div>
                        <div className="text-sm text-slate-500">{crypto.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900">
                    {formatPrice(crypto.current_price)}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    crypto.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}
                    {crypto.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-right text-slate-700 font-medium">
                    {formatMarketCap(crypto.market_cap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {prices.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-slate-500">Unable to fetch live prices. Please check your connection.</p>
            <button 
              onClick={fetchLiveData}
              className="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}