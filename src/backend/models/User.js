const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name : String,
    email : {type : String, unique: true},
    password: String,
    collegeName: { type: String },
    accommodation: { type: Boolean, default: false },
    events: { type: [String], default: [] },
    idDocumentUrl: { type: String, default: null },
    paymentScreenshotUrl: { type: String, default: null }
})

module.exports = mongoose.model('User',userSchema);