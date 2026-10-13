const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Define routes
router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.get('/member/:memberId', loanController.getLoansByMemberId);
router.post('/', loanController.createLoan);
router.put('/:id', loanController.updateLoanById);
router.delete('/:id', loanController.deleteLoanById);

module.exports = router;
