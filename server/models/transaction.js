const mongoose = require('mongoose'); 
const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['debit', 'credit'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    commission: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
