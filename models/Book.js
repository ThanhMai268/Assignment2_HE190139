const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        author: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        isbn: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        publishedYear: {
            type: Number,
            required: true
        },
        totalCopies: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },
        availableCopies: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;