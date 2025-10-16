const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            collegeName,
            accommodation,
            registrationType = 'individual',
            teamMembers = [],
            events = [],
            idDocumentUrl = null,
            paymentScreenshotUrl = null
        } = req.body || {};

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        // Check if email already exists
        const exist = await User.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Validate team registration
        if (registrationType === 'team') {
            if (!Array.isArray(teamMembers) || teamMembers.length < 1) {
                return res.status(400).json({ 
                    message: "Team registration requires at least 1 additional member" 
                });
            }
            if (teamMembers.length > 4) {
                return res.status(400).json({ 
                    message: "Maximum team size is 5 members (including leader)" 
                });
            }
            // Validate each team member has a name
            const invalidMembers = teamMembers.filter(member => !member.name || member.name.trim() === '');
            if (invalidMembers.length > 0) {
                return res.status(400).json({ 
                    message: "All team members must have a name" 
                });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const accommodationBool = accommodation === true || accommodation === 'true' || accommodation === '1' || accommodation === 1;

        // Prepare user payload
        const userPayload = {
            name,
            email,
            password: hashedPassword,
            collegeName: collegeName || undefined,
            accommodation: accommodationBool,
            registrationType,
            teamMembers: registrationType === 'team' ? teamMembers : [],
            events,
            idDocumentUrl,
            paymentScreenshotUrl
        };

        // Create user
        const user = await User.create(userPayload);

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.jwt_key, { expiresIn: '1h' });

        // Send response
        res.json({
            user: {
                name: user.name,
                email: user.email,
                collegeName: user.collegeName || null,
                accommodation: !!user.accommodation,
                registrationType: user.registrationType,
                teamMembers: user.teamMembers || [],
                events: user.events || [],
                idDocumentUrl: user.idDocumentUrl,
                paymentScreenshotUrl: user.paymentScreenshotUrl
            },
            token
        });

    } catch (err) {
        console.error('Register error:', err);
        
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: Object.values(err.errors).map(e => e.message).join(', ') 
            });
        }
        
        res.status(500).json({ message: err.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Incorrect Password" });

        const token = jwt.sign({ id: user._id }, process.env.jwt_key, { expiresIn: '1h' });

        res.json({
            user: {
                name: user.name,
                email: user.email,
                collegeName: user.collegeName || null,
                accommodation: !!user.accommodation,
                registrationType: user.registrationType,
                teamMembers: user.teamMembers || [],
                events: user.events || [],
                idDocumentUrl: user.idDocumentUrl,
                paymentScreenshotUrl: user.paymentScreenshotUrl
            },
            token
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: err.message });
    }
};

module.exports = { register, login };
