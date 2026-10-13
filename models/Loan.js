const mongoose = require('mongoose');
require('./Member');
require('./Book');

const { Schema, model } = mongoose;

const loanSchema = new Schema(
    {
        _id: {
            type: String,
            default: () => new mongoose.Types.ObjectId().toString()
        },
        member_id: {
            type: String,
            ref: 'Member',
            required: true
        },
        items: [
            {
                _id: false,
                book_id: {
                    type: String,
                    ref: 'Book',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
            }
        ],
        borrowDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        dueDate: {
            type: Date,
            required: true
        },
        returnDate: {
            type: Date,
            default: null
        },
        status: {
            type: String,
            required: true,
            default: 'Borrowing'
        }
    },
    {
        timestamps: true
    }
);

loanSchema.pre('validate', function (next) {
    if (!this.borrowDate) {
        this.borrowDate = new Date();
    }
    if (!this.dueDate) {
        const due = new Date(this.borrowDate);
        due.setDate(due.getDate() + 14);
        this.dueDate = due;
    }
    next();
});

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;