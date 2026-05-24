import User from '../models/auth.model.js'
import jwt from 'jsonwebtoken'

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
}

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        await User.create({
            username,
            email,
            password
        })

        res.status(201).json({
            message: 'Account created successfully! You can now login.'
        })

    } catch (error) {
        console.log('Register error:', error.message)
        res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const isMatch = await user.comparePassword(password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        res.cookie('token', token, cookieOptions)

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                email: user.email
            }
        })

    } catch (error) {
        console.log('Login error:', error.message)
        res.status(500).json({ message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', cookieOptions)
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (error) {
        console.log('Logout error:', error.message)
        res.status(500).json({ message: error.message })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ user })
    } catch (error) {
        console.log('GetMe error:', error.message)
        res.status(500).json({ message: error.message })
    }
}