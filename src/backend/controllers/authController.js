const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const register = async(req,res)=>{
    try{
        const {name,email,password} = req.body;

        const exist = await User.findOne({email})
        if(exist){
            return res.status(400).json({message: "Email already registered"});
        }
        
        const hashed = await bcrypt.hash(password,10);
        const isCollege = email.endsWith('nitw.ac.in');

        const user = await User.create({
            name,
            email,
            password: hashed,
            needsPayment : !isCollege
        })

        const token = jwt.sign({id:user._id},process.env.jwt_key,{expiresIn:'1h'});

        res.json({
            user : {name : user.name , email: user.email,needsPayment: user.needsPayment},
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
            res.status(400).json({message: "User not found"})
        }
        
        const match = await bcrypt.compare(password,user.password);
        if(!match){
            res.status(400).json({message: "Incorrect Password"});
        }
        
        const token = jwt.sign({id:user._id},process.env.jwt_key,{expiresIn:'1h'});
        
        res.json({
            user : {name : user.name , email: user.email,needsPayment: user.needsPayment},
            token
        })

    } catch (error) {
        console.log('Error', Error)
    }
}

module.exports = {register,login};