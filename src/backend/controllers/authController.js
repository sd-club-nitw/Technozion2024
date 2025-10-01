const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const register = async(req,res)=>{
    try{
        // Accept registration fields from req.body. If file was uploaded via middleware it may appear on req.file - we will destructure but not process file content here.
        console.log("FULL REGISTER REQ BODY:", req.body);
        const { name, email, password, collegeName, accommodation, idDocument } = req.body || {};

        // If middleware attached a file (e.g. multer), note it but do not process here per instruction
        if (req.file) {
            console.log('Received file in request (will not be processed here):', req.file.originalname);
        }

        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const exist = await User.findOne({ email })
        if (exist) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const isCollege = typeof email === 'string' && email.endsWith('nitw.ac.in');

        // normalize accommodation to boolean when possible
        const accommodationBool = accommodation === true || accommodation === 'true' || accommodation === '1' || accommodation === 1;

        const userPayload = {
            name,
            email,
            password: hashed,
            needsPayment: !isCollege,
        }

        if (collegeName) userPayload.collegeName = collegeName;
        if (typeof accommodation !== 'undefined') userPayload.accommodation = accommodationBool;

        // Do not store idDocument here per instruction. If you want to store metadata, pass idDocument when it's not a file.

        const user = await User.create(userPayload)

        const token = jwt.sign({ id: user._id }, process.env.jwt_key, { expiresIn: '1h' });

        res.json({
            user: { name: user.name, email: user.email, needsPayment: user.needsPayment },
            token
        })

    }catch(err){
        res.status(500).json({message:err.message});
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        
        const user = await User.findOne({email});
        
        if(!user){
            return res.status(400).json({message: "User not found"})
        }
        
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({message: "Incorrect Password"});
        }
        
        const token = jwt.sign({id:user._id},process.env.jwt_key,{expiresIn:'1h'});
        
        res.json({
            user : {name : user.name , email: user.email,needsPayment: user.needsPayment},
            token
        })

    } catch (error) {
        console.log('Error', error)
    }
}

module.exports = {register,login};