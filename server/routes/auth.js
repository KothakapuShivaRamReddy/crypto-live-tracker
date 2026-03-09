const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const protect = require('../middleware/auth')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' })
    }
    const user = await User.create({ username, email, password })
    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, email: user.email },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json({
      token: generateToken(user._id),
      user: { id: user._id, username: user.username, email: user.email },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router