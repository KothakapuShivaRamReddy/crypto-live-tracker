import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchCoins } from '../utils/api'

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setShowDropdown(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const res = await searchCoins(query)
        setResults(res.data.slice(0, 6))
        setShowDropdown(true)
      } catch (err) {
        console.error('Search failed:', err)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  const handleSelect = (coinId) => {
    setQuery('')
    setShowDropdown(false)
    navigate(`/coin/${coinId}`)
  }

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      {/* Input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search coins... (e.g. Bitcoin)"
          className="input-field pl-10 pr-4"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
            Searching...
          </span>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
          {results.map((coin) => (
            <button
              key={coin.id}
              onClick={() => handleSelect(coin.id)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors duration-150 text-left"
            >
              <img src={coin.thumb} alt={coin.name} className="w-7 h-7 rounded-full" />
              <div>
                <p className="text-white text-sm font-medium">{coin.name}</p>
                <p className="text-gray-400 text-xs uppercase">{coin.symbol}</p>
              </div>
              {coin.market_cap_rank && (
                <span className="ml-auto text-gray-500 text-xs">#{coin.market_cap_rank}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showDropdown && results.length === 0 && !loading && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 p-4">
          <p className="text-gray-400 text-sm text-center">No coins found for "{query}"</p>
        </div>
      )}
    </div>
  )
}

export default SearchBar