const express = require('express')
const router = express.Router()
const protect = require('../middleware/auth')
const Portfolio = require('../models/Portfolio')

// @route GET /api/portfolio
router.get('/', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ userId: req.user.id }).sort({ addedAt: -1 })
    res.json(portfolio)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @route POST /api/portfolio
router.post('/', protect, async (req, res) => {
  const { coinId, name, symbol, quantity, buyPrice } = req.body
  try {
    const item = await Portfolio.create({
      userId: req.user.id,
      coinId,
      name,
      symbol,
      quantity,
      buyPrice,
    })
    res.status(201).json(item)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @route DELETE /api/portfolio/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    await Portfolio.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    })
    res.json({ message: 'Removed from portfolio' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router