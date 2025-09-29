const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    email : {type : String,unique: true},
    password: String,
    needsPayment: {type: Boolean,default:false}
})

module.exports = mongoose.model('User',userSchema);