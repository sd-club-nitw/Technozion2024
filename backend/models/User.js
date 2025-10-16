const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, { _id: false }); // _id: false prevents Mongoose from creating an _id for each team member

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    collegeName: { type: String },
    accommodation: { type: Boolean, default: false },
    registrationType: { 
        type: String, 
        enum: ['individual', 'team'], 
        default: 'individual' 
    },
    teamMembers: { 
        type: [teamMemberSchema], 
        default: [],
        validate: {
            validator: function(arr) {
                if (this.registrationType === 'team') {
                    return arr.length >= 1 && arr.length <= 4;
                }
                return true;
            },
            message: 'Team must have 1-4 additional members (2-5 total including leader)'
        }
    },
    events: { type: [String], default: [] },
    idDocumentUrl: { type: String, default: null },
    paymentScreenshotUrl: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
