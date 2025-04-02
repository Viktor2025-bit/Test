const express = require('express');
const { getAllCategories, getQuestions } = require("../Controllers/opentdb.controller")
const { protect } = require("../Middleware/authMiddleware")

const router = express.Router();

// @route   GET /api/opentdb/categories
// @desc    Get all categories
router.get('/categories', protect, getAllCategories );

// @route   GET /api/opentdb/questions
// @desc    Fetch questions
router.get('/questions', protect, getQuestions );

module.exports = router;