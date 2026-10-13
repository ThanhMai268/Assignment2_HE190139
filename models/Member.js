const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const memberSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            minlength: 1,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        membershipType: {
            type: String,
            required: true,
            enum: ['Student', 'Teacher', 'Guest']
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;