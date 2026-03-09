import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCoin } from '../hooks/useCoinData'
import PriceChart from '../components/PriceChart'
import Loader from '../components/Loader'
import { addToWatchlist, removeFromWatchlist } from '../utils/api'
import { useAuth } from '../context/AuthContext'

const CoinDetail = () => {
  const { id } = useParams()
  const { coin, loading, error } = useCoin(id)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [watchlistMsg, setWatchlistMsg] = useState('')

  const priceChange = coin?.price_change_percentage_24h
  const isPositive = priceChange >= 0

  const handleAddWatchlist = async () => {
    if (!user) return navigate('/login')
    try {
      await addToWatchlist({
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image?.small,
      })
      setWatchlistMsg('✅ Added to Watchlist!')
    } catch (err) {
      setWatchlistMsg('Already in Watchlist!')
    }
    setTimeout(() => setWatchlistMsg(''), 3000)
  }

  if (loading) return <Loader text="Fetching coin details..." />
  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-400 text-lg">⚠️ {error}</p>
    </div>
  )
  if (!coin) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2 transition-colors"
      >
        ← Back
      </button>

      {/* Coin Header */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={coin.image?.large} alt={coin.name} className="w-16 h-16 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
                <span className="text-gray-400 text-sm uppercase bg-gray-800 px-2 py-1 rounded">
                  {coin.symbol}
                </span>
                <span className="text-gray-500 text-sm">#{coin.market_cap_rank}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-bold text-white">
                  ${coin.market_data?.current_price?.usd?.toLocaleString()}
                </span>
                <span className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '▲' : '▼'} {Math.abs(priceChange)?.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button onClick={handleAddWatchlist} className="btn-primary">
              ⭐ Add to Watchlist
            </button>
            {watchlistMsg && (
              <p className="text-green-400 text-xs text-center">{watchlistMsg}</p>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <PriceChart coinId={id} isPositive={isPositive} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Market Cap', value: `$${coin.market_data?.market_cap?.usd?.toLocaleString()}` },
          { label: '24h Volume', value: `$${coin.market_data?.total_volume?.usd?.toLocaleString()}` },
          { label: 'All Time High', value: `$${coin.market_data?.ath?.usd?.toLocaleString()}` },
          { label: 'Circulating Supply', value: coin.market_data?.circulating_supply?.toLocaleString() },
        ].map((stat) => (
          <div key={stat.label} className="card">
            <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
            <p className="text-white font-semibold text-sm">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Price Changes */}
      <div className="card mb-6">
        <h3 className="text-white font-semibold mb-4">Price Change</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '1h', value: coin.market_data?.price_change_percentage_1h_in_currency?.usd },
            { label: '24h', value: coin.market_data?.price_change_percentage_24h },
            { label: '7d', value: coin.market_data?.price_change_percentage_7d },
            { label: '30d', value: coin.market_data?.price_change_percentage_30d },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-gray-500 text-xs mb-1">{item.label}</p>
              <p className={`font-semibold text-sm ${item.value >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {item.value >= 0 ? '▲' : '▼'} {Math.abs(item.value)?.toFixed(2)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      {coin.description?.en && (
        <div className="card">
          <h3 className="text-white font-semibold mb-3">About {coin.name}</h3>
          <p
            className="text-gray-400 text-sm leading-relaxed line-clamp-5"
            dangerouslySetInnerHTML={{
              __html: coin.description.en.split('. ').slice(0, 5).join('. '),
            }}
          />
        </div>
      )}
    </div>
  )
}

export default CoinDetail