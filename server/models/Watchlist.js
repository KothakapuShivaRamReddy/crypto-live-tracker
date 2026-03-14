const mongoose = require('mongoose')

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coinId: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    image: { type: String ,required:true},
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Prevent duplicate coins per user
watchlistSchema.index({ userId: 1, coinId: 1 }, { unique: true })

module.exports = mongoose.model('Watchlist', watchlistSchema)
