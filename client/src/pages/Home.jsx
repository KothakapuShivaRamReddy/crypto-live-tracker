import { useState } from 'react'
import { useCoins } from '../hooks/useCoinData'
import CoinCard from '../components/CoinCard'
import SearchBar from '../components/SearchBar'
import Loader from '../components/Loader'

const Home = () => {
  const [page, setPage] = useState(1)
  const { coins, loading, error } = useCoins(page)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">
          Track <span className="text-blue-500">Crypto</span> in Real Time
        </h1>
        <p className="text-gray-400 mb-6">
          Live prices, charts, and portfolio tracking for 100+ cryptocurrencies
        </p>
        <div className="flex justify-center">
          <SearchBar />
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Coins', value: '100+', icon: '🪙' },
          { label: 'Live Prices', value: 'Real Time', icon: '📡' },
          { label: 'Market Data', value: 'CoinGecko', icon: '📊' },
          { label: 'Updates', value: 'Every 60s', icon: '🔄' },
        ].map((stat) => (
          <div key={stat.label} className="card text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-white font-semibold text-sm">{stat.value}</div>
            <div className="text-gray-500 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Coins List Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-xl font-semibold">
          Top Cryptocurrencies
        </h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full live-pulse"></span>
          <span className="text-gray-400 text-xs">Live</span>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-4 gap-4 px-4 mb-2">
        <span className="text-gray-500 text-xs">Coin</span>
        <span className="text-gray-500 text-xs text-right">Price</span>
        <span className="text-gray-500 text-xs text-right">24h Change</span>
        <span className="text-gray-500 text-xs text-right">Market Cap</span>
      </div>

      {/* Coins Grid */}
      {loading ? (
        <Loader text="Fetching live prices..." />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 text-lg mb-2">⚠️ {error}</p>
          <p className="text-gray-500 text-sm">Please check your connection and try again.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coins.map((coin) => (
              <CoinCard key={coin.id} coin={coin} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="text-gray-400 text-sm">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="btn-secondary"
            >
              Next →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Home