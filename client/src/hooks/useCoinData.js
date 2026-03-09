import { useState, useEffect } from 'react'
import { getCoins, getCoinById, getCoinChart } from '../utils/api'

export const useCoins = (page = 1) => {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true)
        const res = await getCoins(page)
        setCoins(res.data)
      } catch (err) {
        setError('Failed to fetch coins. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCoins()

    // Auto refresh every 60 seconds
    const interval = setInterval(fetchCoins, 60000)
    return () => clearInterval(interval)
  }, [page])

  return { coins, loading, error }
}

export const useCoin = (id) => {
  const [coin, setCoin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchCoin = async () => {
      try {
        setLoading(true)
        const res = await getCoinById(id)
        setCoin(res.data)
      } catch (err) {
        setError('Failed to fetch coin details.')
      } finally {
        setLoading(false)
      }
    }

    fetchCoin()
  }, [id])

  return { coin, loading, error }
}

export const useCoinChart = (id, days = 7) => {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    const fetchChart = async () => {
      try {
        setLoading(true)
        const res = await getCoinChart(id, days)
        setChartData(res.data)
      } catch (err) {
        setError('Failed to fetch chart data.')
      } finally {
        setLoading(false)
      }
    }

    fetchChart()
  }, [id, days])

  return { chartData, loading, error }
}