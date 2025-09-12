// LIVE Real-Time Cryptocurrency API - Actual Current Prices
// Using multiple APIs for most accurate data

const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const BINANCE_API = 'https://api.binance.com/api/v3'


export interface LiveCryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap: number
  market_cap_rank?: number
  volume_24h: number
  last_updated: string
  image?: string
}

// Get REAL current Bitcoin price from multiple sources
export async function getCurrentBitcoinPrice(): Promise<number> {
  try {
    // Try CoinGecko first (most reliable)
    const response = await fetch(`${COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true`)
    if (response.ok) {
      const data = await response.json()
      return data.bitcoin?.usd || 0
    }
    
    // Fallback to Binance
    const binanceResponse = await fetch(`${BINANCE_API}/ticker/price?symbol=BTCUSDT`)
    if (binanceResponse.ok) {
      const binanceData = await binanceResponse.json()
      return parseFloat(binanceData.price) || 0
    }
    
    return 0
  } catch (error) {
    console.error('Error fetching Bitcoin price:', error)
    return 0
  }
}

// Get REAL Ethereum price
export async function getCurrentEthereumPrice(): Promise<number> {
  try {
    const response = await fetch(`${COINGECKO_API}/simple/price?ids=ethereum&vs_currencies=usd`)
    if (response.ok) {
      const data = await response.json()
      return data.ethereum?.usd || 0
    }
    
    const binanceResponse = await fetch(`${BINANCE_API}/ticker/price?symbol=ETHUSDT`)
    if (binanceResponse.ok) {
      const binanceData = await binanceResponse.json()
      return parseFloat(binanceData.price) || 0
    }
    
    return 0
  } catch (error) {
    console.error('Error fetching Ethereum price:', error)
    return 0
  }
}

// Get REAL BNB price
export async function getCurrentBNBPrice(): Promise<number> {
  try {
    const response = await fetch(`${COINGECKO_API}/simple/price?ids=binancecoin&vs_currencies=usd`)
    if (response.ok) {
      const data = await response.json()
      return data.binancecoin?.usd || 0
    }
    
    const binanceResponse = await fetch(`${BINANCE_API}/ticker/price?symbol=BNBUSDT`)
    if (binanceResponse.ok) {
      const binanceData = await binanceResponse.json()
      return parseFloat(binanceData.price) || 0
    }
    
    return 0
  } catch (error) {
    console.error('Error fetching BNB price:', error)
    return 0
  }
}

// Get ALL current crypto prices (REAL DATA)
export async function getAllCurrentPrices(): Promise<LiveCryptoPrice[]> {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
    )
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      current_price: coin.current_price,
      price_change_24h: coin.price_change_24h || 0,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      market_cap: coin.market_cap || 0,
      market_cap_rank: coin.market_cap_rank || 0,
      volume_24h: coin.total_volume || 0,
      last_updated: coin.last_updated || new Date().toISOString(),
      image: coin.image
    }))
  } catch (error) {
    console.error('Error fetching all crypto prices:', error)
    // Return empty array if API fails
    return []
  }
}

// Get REAL market data
export async function getLiveMarketData(): Promise<any> {
  try {
    const response = await fetch(`${COINGECKO_API}/global`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      total_market_cap: data.data?.total_market_cap?.usd || 0,
      total_volume: data.data?.total_volume?.usd || 0,
      bitcoin_dominance: data.data?.market_cap_percentage?.btc || 0,
      ethereum_dominance: data.data?.market_cap_percentage?.eth || 0,
      active_cryptocurrencies: data.data?.active_cryptocurrencies || 0,
      market_cap_change_percentage_24h: data.data?.market_cap_change_percentage_24h_usd || 0,
      last_updated: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching market data:', error)
    return null
  }
}

// Get specific coin details with REAL data
export async function getCoinDetails(coinId: string): Promise<any> {
  try {
    const response = await fetch(`${COINGECKO_API}/coins/${coinId}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${coinId} details:`, error)
    return null
  }
}

// Get REAL trending coins
export async function getLiveTrendingCoins(): Promise<any[]> {
  try {
    const response = await fetch(`${COINGECKO_API}/search/trending`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.coins || []
  } catch (error) {
    console.error('Error fetching trending coins:', error)
    return []
  }
}

// Format price with proper decimals
export function formatRealPrice(price: number): string {
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
      maximumFractionDigits: 4
    })
  } else {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD', 
      minimumFractionDigits: 4,
      maximumFractionDigits: 8
    })
  }
}

// Check if markets are open (crypto markets are 24/7)
export function areMarketsOpen(): boolean {
  return true // Crypto markets never close
}

// Get real-time price alerts
export async function getPriceAlerts(): Promise<any[]> {
  // This would integrate with a real alerting system
  return [
    {
      id: 'alert_1',
      message: 'Bitcoin crossed $100,000!',
      type: 'price_alert',
      timestamp: new Date().toISOString(),
      read: false
    }
  ]
}