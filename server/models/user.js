const mongoose = require('mongoose');
const fs = require('fs'); // for deleting old images

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['freelancer', 'enterprise', 'hybrid'],
        default: 'freelancer'
    },
    wallet: {
        type: Number,
        default: 0
    },
    commissionRate: {
        type: Number
    },
    bio: {
        type: String,
        maxlength: 500
    },
    info: {
        skills: [{ type: String }],
        portfolio: { type: String },
        experience: [{ type: String }],
        profilePic: { type: String } // Store image file path
    },
    previousWorks: [{
        title: { type: String, required: true },
        description: { type: String },
        link: { type: String }
    }],
}, { timestamps: true });

// Middleware to set commission rate based on role
userSchema.pre('save', function (next) {
    if (this.isNew) {
        switch (this.role) {
            case 'freelancer':
                this.commissionRate = 0.5;
                break;
            case 'enterprise':
                this.commissionRate = 1;
                break;
            case 'hybrid':
                this.commissionRate = 1.5;
                break;
            default:
                this.commissionRate = 1;
        }
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
