const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const Watchlist = require('../models/Watchlist')

// @route GET /api/watchlist
router.get('/', protect, async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ userId: req.user.id }).sort({ addedAt: -1 })
    res.json(watchlist)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @route POST /api/watchlist
router.post('/', protect, async (req, res) => {
  const { coinId, name, symbol, image } = req.body
  try {
    const existing = await Watchlist.findOne({ userId: req.user.id, coinId })
    if (existing) {
      return res.status(400).json({ message: 'Coin already in watchlist' })
    }
    const item = await Watchlist.create({
      userId: req.user.id,
      coinId,
      name,
      symbol,
      image,
    })
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @route DELETE /api/watchlist/:coinId
router.delete('/:coinId', protect, async (req, res) => {
  try {
    await Watchlist.findOneAndDelete({
      userId: req.user.id,
      coinId: req.params.coinId,
    })
    res.json({ message: 'Removed from watchlist' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router