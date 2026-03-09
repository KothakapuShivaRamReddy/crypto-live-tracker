import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Coins
export const getCoins = (page = 1) =>
  api.get(`/coins?page=${page}`)

export const getCoinById = (id) =>
  api.get(`/coins/${id}`)

export const getCoinChart = (id, days = 7) =>
  api.get(`/coins/${id}/chart?days=${days}`)

export const searchCoins = (query) =>
  api.get(`/coins/search?query=${query}`)

// Auth
export const registerUser = (data) =>
  api.post('/auth/register', data)

export const loginUser = (data) =>
  api.post('/auth/login', data)

export const getMe = () =>
  api.get('/auth/me')

// Watchlist
export const getWatchlist = () =>
  api.get('/watchlist')

export const addToWatchlist = (coin) =>
  api.post('/watchlist', coin)

export const removeFromWatchlist = (coinId) =>
  api.delete(`/watchlist/${coinId}`)

// Portfolio
export const getPortfolio = () =>
  api.get('/portfolio')

export const addToPortfolio = (data) =>
  api.post('/portfolio', data)

export const removeFromPortfolio = (id) =>
  api.delete(`/portfolio/${id}`)

export default api