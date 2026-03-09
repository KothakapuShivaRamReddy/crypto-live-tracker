import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getWatchlist, removeFromWatchlist } from '../utils/api'
import Loader from '../components/Loader'

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      setLoading(true)
      const res = await getWatchlist()
      setWatchlist(res.data)
    } catch (err) {
      setError('Failed to fetch watchlist.')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (coinId) => {
    try {
      await removeFromWatchlist(coinId)
      setWatchlist((prev) => prev.filter((c) => c.coinId !== coinId))
    } catch (err) {
      console.error('Failed to remove:', err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">⭐ My Watchlist</h1>
          <p className="text-gray-400 text-sm mt-1">Track your favourite coins</p>
        </div>
        <span className="text-gray-500 text-sm">{watchlist.length} coins</span>
      </div>

      {loading ? (
        <Loader text="Loading watchlist..." />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400">{error}</p>
        </div>
      ) : watchlist.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">⭐</p>
          <p className="text-white text-lg font-semibold mb-2">Your watchlist is empty</p>
          <p className="text-gray-400 text-sm mb-6">
            Go to any coin page and click "Add to Watchlist"
          </p>
          <Link to="/" className="btn-primary">
            Browse Coins
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {watchlist.map((coin) => (
            <div
              key={coin.coinId}
              className="card flex items-center justify-between hover:border-gray-600 transition-all duration-200 fade-in"
            >
              {/* Coin Info */}
              <Link
                to={`/coin/${coin.coinId}`}
                className="flex items-center gap-4 flex-1"
              >
                <img
                  src={coin.image}
                  alt={coin.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-white font-semibold">{coin.name}</p>
                  <p className="text-gray-400 text-xs uppercase">{coin.symbol}</p>
                </div>
              </Link>

              {/* Added Date */}
              <div className="hidden md:block text-right mr-6">
                <p className="text-gray-500 text-xs">Added</p>
                <p className="text-gray-300 text-xs">
                  {new Date(coin.addedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  to={`/coin/${coin.coinId}`}
                  className="btn-secondary text-xs"
                >
                  View
                </Link>
                <button
                  onClick={() => handleRemove(coin.coinId)}
                  className="btn-danger text-xs"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Watchlist