const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    email : {type : String, unique: true},
    password: String,
    collegeName: { type: String },
    accommodation: { type: Boolean, default: false },
    events: { type: [String], default: [] }
})

module.exports = mongoose.model('User',userSchema);