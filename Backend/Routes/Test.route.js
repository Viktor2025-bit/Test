const express = require('express');
const Test = require("../Models/Test")
const { createNewTest, getAllTest, getTest, updateTest, deleteTest } = require("../Controllers/test.controller")
const { protect, teacher } = require("../Middleware/authMiddleware")

const router = express.Router();

// @route   POST /api/tests
// @desc    Create a new test
router.post('/', protect, teacher, createNewTest );

// @route   GET /api/tests
// @desc    Get all tests
router.get('/', protect, getAllTest );

// @route   GET /api/tests/:id
// @desc    Get test by ID
router.get('/:id', protect, getTest );

// @route   PUT /api/tests/:id
// @desc    Update test
router.put('/:id', protect, teacher, updateTest );

// @route DELETE /api/tests/:Id
// @desc   Delete test

router.delete('/:id', protect, teacher, deleteTest )


module.exports = router;