const express = require('express')
const router = express.Router()
const axios = require('axios')

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

// Simple in-memory cache
const cache = {}
const CACHE_DURATION = 60 * 1000 // 60 seconds

const getFromCache = (key) => {
  const cached = cache[key]
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

const setCache = (key, data) => {
  cache[key] = { data, timestamp: Date.now() }
}

// @route GET /api/coins
router.get('/', async (req, res) => {
  const { page = 1 } = req.query
  const cacheKey = `coins_page_${page}`
  try {
    const cached = getFromCache(cacheKey)
    if (cached) {
      return res.json(cached)
    }
    const { data } = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page,
        sparkline: false,
        price_change_percentage: '24h',
      },
    })
    setCache(cacheKey, data)
    res.json(data)
  } catch (err) {
    // Return cached data even if expired during rate limit
    const stale = cache[`coins_page_${page}`]
    if (stale) return res.json(stale.data)
    res.status(500).json({ message: 'Failed to fetch coins' })
  }
})

// @route GET /api/coins/search
router.get('/search', async (req, res) => {
  const { query } = req.query
  const cacheKey = `search_${query}`
  try {
    const cached = getFromCache(cacheKey)
    if (cached) return res.json(cached)
    const { data } = await axios.get(`${COINGECKO_BASE}/search`, {
      params: { query },
    })
    setCache(cacheKey, data.coins)
    res.json(data.coins)
  } catch (err) {
    res.status(500).json({ message: 'Search failed' })
  }
})

// @route GET /api/coins/:id
router.get('/:id', async (req, res) => {
  const cacheKey = `coin_${req.params.id}`
  try {
    const cached = getFromCache(cacheKey)
    if (cached) return res.json(cached)
    const { data } = await axios.get(`${COINGECKO_BASE}/coins/${req.params.id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      },
    })
    setCache(cacheKey, data)
    res.json(data)
  } catch (err) {
    const stale = cache[cacheKey]
    if (stale) return res.json(stale.data)
    res.status(500).json({ message: 'Failed to fetch coin details' })
  }
})

// @route GET /api/coins/:id/chart
router.get('/:id/chart', async (req, res) => {
  const { days = 7 } = req.query
  const cacheKey = `chart_${req.params.id}_${days}`
  try {
    const cached = getFromCache(cacheKey)
    if (cached) return res.json(cached)
    const { data } = await axios.get(
      `${COINGECKO_BASE}/coins/${req.params.id}/market_chart`,
      { params: { vs_currency: 'usd', days } }
    )
    const chartData = data.prices.map((item) => ({
      date: new Date(item[0]).toLocaleDateString(),
      price: parseFloat(item[1].toFixed(2)),
    }))
    setCache(cacheKey, chartData)
    res.json(chartData)
  } catch (err) {
    const stale = cache[cacheKey]
    if (stale) return res.json(stale.data)
    res.status(500).json({ message: 'Failed to fetch chart data' })
  }
})

module.exports = router