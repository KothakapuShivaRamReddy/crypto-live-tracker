import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPortfolio, addToPortfolio, removeFromPortfolio } from '../utils/api'
import { getCoins } from '../utils/api'
import Loader from '../components/Loader'

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([])
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ coinId: '', quantity: '', buyPrice: '' })
  const [error, setError] = useState(null)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [portfolioRes, coinsRes] = await Promise.all([
        getPortfolio(),
        getCoins(1),
      ])
      setPortfolio(portfolioRes.data)
      setCoins(coinsRes.data)
    } catch (err) {
      setError('Failed to load portfolio.')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentPrice = (coinId) => {
    const coin = coins.find((c) => c.id === coinId)
    return coin?.current_price || 0
  }

  const getCoinImage = (coinId) => {
    const coin = coins.find((c) => c.id === coinId)
    return coin?.image || ''
  }

  const calculatePnL = (item) => {
    const currentPrice = getCurrentPrice(item.coinId)
    const currentValue = currentPrice * item.quantity
    const investedValue = item.buyPrice * item.quantity
    const pnl = currentValue - investedValue
    const pnlPercent = investedValue > 0 ? (pnl / investedValue) * 100 : 0
    return { currentValue, investedValue, pnl, pnlPercent }
  }

  const totalPortfolioValue = portfolio.reduce((acc, item) => {
    return acc + getCurrentPrice(item.coinId) * item.quantity
  }, 0)

  const totalInvested = portfolio.reduce((acc, item) => {
    return acc + item.buyPrice * item.quantity
  }, 0)

  const totalPnL = totalPortfolioValue - totalInvested
  const totalPnLPercent = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0

  const handleAddHolding = async () => {
    if (!form.coinId || !form.quantity || !form.buyPrice) {
      setFormError('Please fill in all fields.')
      return
    }
    try {
      const selectedCoin = coins.find((c) => c.id === form.coinId)
      await addToPortfolio({
        coinId: form.coinId,
        name: selectedCoin?.name,
        symbol: selectedCoin?.symbol,
        quantity: parseFloat(form.quantity),
        buyPrice: parseFloat(form.buyPrice),
      })
      setForm({ coinId: '', quantity: '', buyPrice: '' })
      setShowForm(false)
      setFormError('')
      fetchData()
    } catch (err) {
      setFormError('Failed to add holding.')
    }
  }

  const handleRemove = async (id) => {
    try {
      await removeFromPortfolio(id)
      setPortfolio((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      console.error('Failed to remove:', err)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">💹 My Portfolio</h1>
          <p className="text-gray-400 text-sm mt-1">Track your crypto holdings</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? '✕ Cancel' : '+ Add Holding'}
        </button>
      </div>

      {/* Add Holding Form */}
      {showForm && (
        <div className="card mb-6 fade-in">
          <h3 className="text-white font-semibold mb-4">Add New Holding</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Select Coin</label>
              <select
                value={form.coinId}
                onChange={(e) => setForm({ ...form, coinId: e.target.value })}
                className="input-field"
              >
                <option value="">-- Select Coin --</option>
                {coins.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Quantity</label>
              <input
                type="number"
                placeholder="e.g. 0.5"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Buy Price (USD)</label>
              <input
                type="number"
                placeholder="e.g. 45000"
                value={form.buyPrice}
                onChange={(e) => setForm({ ...form, buyPrice: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          {formError && <p className="text-red-400 text-xs mt-2">{formError}</p>}
          <button onClick={handleAddHolding} className="btn-primary mt-4">
            Add to Portfolio
          </button>
        </div>
      )}

      {loading ? (
        <Loader text="Loading portfolio..." />
      ) : error ? (
        <p className="text-red-400 text-center py-12">{error}</p>
      ) : portfolio.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">💹</p>
          <p className="text-white text-lg font-semibold mb-2">No holdings yet</p>
          <p className="text-gray-400 text-sm mb-6">Click "Add Holding" to start tracking</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card text-center">
              <p className="text-gray-400 text-xs mb-1">Total Portfolio Value</p>
              <p className="text-white text-2xl font-bold">
                ${totalPortfolioValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-xs mb-1">Total Invested</p>
              <p className="text-white text-2xl font-bold">
                ${totalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="card text-center">
              <p className="text-gray-400 text-xs mb-1">Total P&L</p>
              <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                <span className="text-sm ml-2">({totalPnLPercent.toFixed(2)}%)</span>
              </p>
            </div>
          </div>

          {/* Holdings Table */}
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-gray-500 text-xs text-left pb-3">Coin</th>
                  <th className="text-gray-500 text-xs text-right pb-3">Holdings</th>
                  <th className="text-gray-500 text-xs text-right pb-3">Buy Price</th>
                  <th className="text-gray-500 text-xs text-right pb-3">Current Price</th>
                  <th className="text-gray-500 text-xs text-right pb-3">Current Value</th>
                  <th className="text-gray-500 text-xs text-right pb-3">P&L</th>
                  <th className="text-gray-500 text-xs text-right pb-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => {
                  const { currentValue, pnl, pnlPercent } = calculatePnL(item)
                  const currentPrice = getCurrentPrice(item.coinId)
                  const isProfit = pnl >= 0
                  return (
                    <tr key={item._id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                      <td className="py-4">
                        <Link to={`/coin/${item.coinId}`} className="flex items-center gap-3">
                          <img
                            src={getCoinImage(item.coinId)}
                            alt={item.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-white text-sm font-medium">{item.name}</p>
                            <p className="text-gray-400 text-xs uppercase">{item.symbol}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="text-right text-white text-sm py-4">{item.quantity}</td>
                      <td className="text-right text-gray-300 text-sm py-4">
                        ${item.buyPrice.toLocaleString()}
                      </td>
                      <td className="text-right text-gray-300 text-sm py-4">
                        ${currentPrice.toLocaleString()}
                      </td>
                      <td className="text-right text-white text-sm py-4">
                        ${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                      <td className={`text-right text-sm py-4 font-medium ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                        {isProfit ? '+' : ''}${pnl.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        <br />
                        <span className="text-xs">({pnlPercent.toFixed(2)}%)</span>
                      </td>
                      <td className="text-right py-4">
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="btn-danger text-xs"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Portfolio