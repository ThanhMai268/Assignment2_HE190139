const Member = require('../models/Member');

// GET all members
const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving members', error: error.message });
    }
};

// GET member by ID
const getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving member', error: error.message });
    }
};

// POST Create a new member
const createMember = async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ message: 'Error creating member', error: error.message });
    }
};

// PUT Update a member by ID
const updateMemberById = async (req, res) => {
    try {
        const member = await Member.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json(member);
    } catch (error) {
        res.status(400).json({ message: 'Error updating member', error: error.message });
    }
};

// DELETE a member by ID
const deleteMemberById = async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.status(200).json({ message: 'Member deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting member', error: error.message });
    }
};

module.exports = {
    getAllMembers,
    getMemberById,
    createMember,
    updateMemberById,
    deleteMemberById,
};