import User from '../models/auth.model.js'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
}

const sendOTPEmail = async (email, username, otp) => {
    await resend.emails.send({
        from: 'ResearchAI <onboarding@resend.dev>',
        to: email,
        subject: 'Verify Your Email - ResearchAI',
        html: `
           <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; background-color: #0a0a0a; border: 1px solid #1e1e1e; border-radius: 16px;">
  
  <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 28px;">
    <div style="background-color: #10b981; padding: 10px; border-radius: 12px; display: inline-block;">
      <span style="color: white; font-size: 20px;">📖</span>
    </div>
    <span style="color: #ffffff; font-size: 22px; font-weight: bold;">ResearchAI</span>
  </div>

  <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 8px;">Hey ${username}, verify your email!</h2>
  <p style="color: #6b7280; font-size: 14px; margin-bottom: 24px;">
    You're one step away from unlocking AI-powered research paper discovery.
  </p>

  <div style="background-color: #111111; border: 1px solid #1e1e1e; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
    <p style="color: #6b7280; font-size: 13px; margin-bottom: 12px;">Your verification code</p>
    <h1 style="color: #10b981; font-size: 42px; letter-spacing: 12px; margin: 0;">${otp}</h1>
    <p style="color: #4b5563; font-size: 12px; margin-top: 12px;">⏱ Valid for 5 minutes only</p>
  </div>

  <div style="background-color: #111111; border: 1px solid #1e1e1e; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <p style="color: #9ca3af; font-size: 13px; margin-bottom: 14px;">What you'll get with ResearchAI:</p>
    <div style="margin-bottom: 10px;">
      <span style="color: #10b981;">✦</span>
      <span style="color: #d1d5db; font-size: 13px; margin-left: 8px;">Semantic AI Search — find papers by meaning, not just keywords</span>
    </div>
    <div style="margin-bottom: 10px;">
      <span style="color: #10b981;">✦</span>
      <span style="color: #d1d5db; font-size: 13px; margin-left: 8px;">Deep Research Mode — AI analyzes top papers and generates summaries</span>
    </div>
    <div>
      <span style="color: #10b981;">✦</span>
      <span style="color: #d1d5db; font-size: 13px; margin-left: 8px;">Search History — track and revisit your past research</span>
    </div>
  </div>

  <p style="color: #4b5563; font-size: 12px; text-align: center; margin-bottom: 16px;">
    If you did not create a ResearchAI account, please ignore this email.
  </p>

  <div style="border-top: 1px solid #1e1e1e; padding-top: 16px; text-align: center;">
    <p style="color: #374151; font-size: 12px;">Built for researchers • Powered by AI • Free to use</p>
  </div>

</div>
        `
    })
}

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: 'Email already registered' })
        }

        const otp = generateOTP()
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)

        if (existingUser && !existingUser.isVerified) {
            existingUser.username = username
            existingUser.password = password
            existingUser.otp = otp
            existingUser.otpExpiry = otpExpiry
            await existingUser.save()
        } else {
            await User.create({
                username,
                email,
                password,
                otp,
                otpExpiry,
                isVerified: false
            })
        }

        await sendOTPEmail(email, username, otp)

        res.status(201).json({
            message: 'OTP sent to your email',
            email
        })

    } catch (error) {
        console.log('Register error:', error.message)
        res.status(500).json({ message: error.message })
    }
}

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' })
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP expired — please register again' })
        }

        user.isVerified = true
        user.otp = null
        user.otpExpiry = null
        await user.save()

        res.status(200).json({
            message: 'Email verified successfully! You can now login.'
        })

    } catch (error) {
        console.log('VerifyOTP error:', error.message)
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

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email first' })
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
        const user = await User.findById(req.user.id).select('-password -otp -otpExpiry')
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        res.status(200).json({ user })
    } catch (error) {
        console.log('GetMe error:', error.message)
        res.status(500).json({ message: error.message })
    }
}