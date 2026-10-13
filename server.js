const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();

// Router
const bookRoutes = require('./routes/bookRoute');
const memberRoutes = require('./routes/memberRoute');
const loanRoutes = require('./routes/loanRoute');

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/loans', loanRoutes);

// Connect to MongoDB
const startServer = async () => {
    await connectDB();

    app.get('/', async (req, res) => {
        try {
            res.send({ message: 'Welcome to Practical Exam!' });
        } catch (error) {
            res.send({ error: error.message });
        }
    });

    const PORT = process.env.PORT || 9999;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();