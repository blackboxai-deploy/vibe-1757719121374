import { NextResponse } from 'next/server'
import { 
  getAllCurrentPrices,
  getCurrentBitcoinPrice,
  getCurrentEthereumPrice,
  getCurrentBNBPrice,
  getLiveMarketData
} from '@/lib/live-crypto-api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const symbol = searchParams.get('symbol')

  try {
    // Return specific coin price
    if (type === 'single' && symbol) {
      let price = 0
      
      switch (symbol.toLowerCase()) {
        case 'btc':
        case 'bitcoin':
          price = await getCurrentBitcoinPrice()
          break
        case 'eth':
        case 'ethereum':
          price = await getCurrentEthereumPrice()
          break
        case 'bnb':
        case 'binancecoin':
          price = await getCurrentBNBPrice()
          break
      }
      
      return NextResponse.json({
        symbol: symbol.toUpperCase(),
        price,
        timestamp: new Date().toISOString(),
        source: 'live_api'
      })
    }

    // Return market overview
    if (type === 'market') {
      const marketData = await getLiveMarketData()
      return NextResponse.json({
        market_data: marketData,
        timestamp: new Date().toISOString(),
        source: 'live_api'
      })
    }

    // Return all crypto prices (default)
    const allPrices = await getAllCurrentPrices()
    
    return NextResponse.json({
      cryptocurrencies: allPrices,
      total_count: allPrices.length,
      timestamp: new Date().toISOString(),
      source: 'live_api',
      update_frequency: '30_seconds'
    })

  } catch (error) {
    console.error('Live Prices API Error:', error)
    
    return NextResponse.json({
      error: 'Failed to fetch live cryptocurrency data',
      message: 'Please check your internet connection or try again later',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// POST endpoint for price alerts and subscriptions
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, symbol, target_price } = body

    switch (action) {
      case 'create_alert':
        return NextResponse.json({
          success: true,
          alert_id: `alert_${Date.now()}`,
          message: `Price alert created for ${symbol} at ${target_price}`,
          timestamp: new Date().toISOString()
        })

      case 'subscribe_updates':
        return NextResponse.json({
          success: true,
          subscription_id: `sub_${Date.now()}`,
          message: `Subscribed to real-time updates for ${symbol}`,
          update_frequency: '30_seconds',
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          error: 'Invalid action specified',
          valid_actions: ['create_alert', 'subscribe_updates']
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Live Prices POST Error:', error)
    
    return NextResponse.json({
      error: 'Failed to process request',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}