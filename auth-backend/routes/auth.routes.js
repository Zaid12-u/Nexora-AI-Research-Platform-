import express from 'express'
import { register, verifyOTP, login, logout } from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/verify-otp', verifyOTP)
router.post('/login', login)
router.get('/logout', authMiddleware, logout) 
router.get('/me', authMiddleware, (req, res) => {
    res.json({ message: 'Protected route', user: req.user })
})

export default router

