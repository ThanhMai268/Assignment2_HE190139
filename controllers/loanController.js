const Loan = require('../models/Loan');
const Member = require('../models/Member');
const Book = require('../models/Book');

// GET all loans
const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate('member_id', 'fullName email phone membershipType isActive')
            .populate('items.book_id', 'title author category isbn publishedYear totalCopies availableCopies');
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving loans', error: error.message });
    }
};

// GET loan by ID
const getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id)
            .populate('member_id', 'fullName email phone membershipType isActive')
            .populate('items.book_id', 'title author category isbn publishedYear totalCopies availableCopies');
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving loan', error: error.message });
    }
};

// POST Create a new loan
const createLoan = async (req, res) => {
    try {
        const { member_id, items } = req.body;

        // Kiểm tra Mem
        const member = await Member.findById(member_id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        if (!member.isActive) {
            return res.status(400).json({ message: 'Only active members are allowed to borrow books' });
        }

        // Kiểm tra items
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: 'Loan must contain at least one book item' });
        }

        // Check Book tồn tại và đủ số lượng
        const booksToUpdate = [];
        for (const item of items) {
            const book = await Book.findById(item.book_id);
            if (!book) {
                return res.status(404).json({ message: `Book not found with ID: ${item.book_id}` });
            }
            if (book.availableCopies < item.quantity) {
                return res.status(400).json({
                    message: `Not enough copies available for book "${book.title}". Available: ${book.availableCopies}, requested: ${item.quantity}`
                });
            }
            booksToUpdate.push({ book, quantity: item.quantity });
        }

        const loan = new Loan(req.body);
        await loan.save();

        // Trừ số lượng availableCopies
        for (const { book, quantity } of booksToUpdate) {
            book.availableCopies -= quantity;
            await book.save();
        }
        await loan.populate([
            { path: 'member_id', select: 'fullName email phone membershipType isActive' },
            { path: 'items.book_id', select: 'title author category isbn publishedYear totalCopies availableCopies' }
        ]);
        res.status(201).json(loan);
    } catch (error) {
        res.status(400).json({ message: 'Error creating loan', error: error.message });
    }
};

// PUT Update a loan by ID
const updateLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        if (req.body.status === 'Returned' && loan.status !== 'Returned') {
            for (const item of loan.items) {
                await Book.findByIdAndUpdate(item.book_id, {
                    $inc: { availableCopies: item.quantity }
                });
            }
            if (!req.body.returnDate) {
                req.body.returnDate = new Date();
            }
        }
        Object.assign(loan, req.body);
        await loan.save();
        await loan.populate([
            { path: 'member_id', select: 'fullName email phone membershipType isActive' },
            { path: 'items.book_id', select: 'title author category isbn publishedYear totalCopies availableCopies' }
        ]);

        res.status(200).json(loan);
    } catch (error) {
        res.status(400).json({ message: 'Error updating loan', error: error.message });
    }
};

// DELETE a loan by ID
const deleteLoanById = async (req, res) => {
    try {
        const loan = await Loan.findByIdAndDelete(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        res.status(200).json({ message: 'Loan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting loan', error: error.message });
    }
};

module.exports = {
    getAllLoans,
    getLoanById,
    createLoan,
    updateLoanById,
    deleteLoanById
};
