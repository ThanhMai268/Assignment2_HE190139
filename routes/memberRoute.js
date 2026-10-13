const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Define routes
router.get('/', memberController.getAllMembers);
router.get('/:id', memberController.getMemberById);
router.post('/', memberController.createMember);
router.put('/:id', memberController.updateMemberById);
router.delete('/:id', memberController.deleteMemberById);

module.exports = router;
