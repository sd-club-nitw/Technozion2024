const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register
const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            collegeName,
            accommodation,
            events = [],
            idDocumentUrl = null,
            paymentScreenshotUrl = null
        } = req.body || {}

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" })
        }

        const exist = await User.findOne({ email })
        if (exist) {
            return res.status(400).json({ message: "Email already registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const accommodationBool = accommodation === true || accommodation === 'true' || accommodation === '1' || accommodation === 1

        const userPayload = {
            name,
            email,
            password: hashedPassword,
            collegeName: collegeName || undefined,
            accommodation: accommodationBool,
            events,
            idDocumentUrl,
            paymentScreenshotUrl
        }

        const user = await User.create(userPayload)

        const token = jwt.sign({ id: user._id }, process.env.jwt_key, { expiresIn: '1h' })

        res.json({
            user: {
                name: user.name,
                email: user.email,
                collegeName: user.collegeName || null,
                accommodation: !!user.accommodation,
                events: user.events || [],
                idDocumentUrl: user.idDocumentUrl,
                paymentScreenshotUrl: user.paymentScreenshotUrl
            },
            token
        })

    } catch (err) {
        console.error('Register error:', err)
        res.status(500).json({ message: err.message })
    }
}

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "User not found" })

        const match = await bcrypt.compare(password, user.password)
        if (!match) return res.status(400).json({ message: "Incorrect Password" })

        const token = jwt.sign({ id: user._id }, process.env.jwt_key, { expiresIn: '1h' })

        res.json({
            user: {
                name: user.name,
                email: user.email,
                collegeName: user.collegeName || null,
                accommodation: !!user.accommodation,
                events: user.events || [],
                idDocumentUrl: user.idDocumentUrl,
                paymentScreenshotUrl: user.paymentScreenshotUrl
            },
            token
        })

    } catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ message: err.message })
    }
}

module.exports = { register, login }
