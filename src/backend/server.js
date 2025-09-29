const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config();

const app = express();

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("done kathpal"))
.catch(err => console.err(err))

const authRoutes = require('./routes/auth')
app.use('/auth',authRoutes)

app.listen(process.env.PORT,()=>console.log("Server on"));