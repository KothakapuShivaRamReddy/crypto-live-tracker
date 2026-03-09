import { Link } from 'react-router-dom'

const CoinCard = ({ coin }) => {
  const priceChange = coin.price_change_percentage_24h
  const isPositive = priceChange >= 0

  return (
    <Link to={`/coin/${coin.id}`}>
      <div className="card hover:border-gray-600 hover:bg-gray-800 transition-all duration-200 cursor-pointer fade-in">
        <div className="flex items-center justify-between">

          {/* Left - Coin Info */}
          <div className="flex items-center gap-3">
            <img
              src={coin.image}
              alt={coin.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="text-white font-semibold text-sm">{coin.name}</h3>
              <span className="text-gray-400 text-xs uppercase">{coin.symbol}</span>
            </div>
          </div>

          {/* Right - Price Info */}
          <div className="text-right">
            <p className="text-white font-semibold text-sm">
              ${coin.current_price?.toLocaleString()}
            </p>
            <span className={`text-xs font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? '▲' : '▼'} {Math.abs(priceChange)?.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Market Cap & Volume */}
        <div className="flex justify-between mt-3 pt-3 border-t border-gray-800">
          <div>
            <p className="text-gray-500 text-xs">Market Cap</p>
            <p className="text-gray-300 text-xs font-medium">
              ${coin.market_cap?.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">24h Volume</p>
            <p className="text-gray-300 text-xs font-medium">
              ${coin.total_volume?.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">Rank</p>
            <p className="text-gray-300 text-xs font-medium">
              #{coin.market_cap_rank}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CoinCard