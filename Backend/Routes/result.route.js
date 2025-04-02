const express = require('express');
const { submitResult, userResult, getSpecificResult } = require("../Controllers/result.controller")
const { protect } = require("../Middleware/authMiddleware")

const router = express.Router();

// @route   POST /api/results
// @desc    Submit test result
router.post('/', protect, submitResult );

// @route   GET /api/results/user
// @desc    Get user's results
router.get('/user', protect, userResult );

// @route   GET /api/results/test/:testId
// @desc    Get results for specific test (teacher only)
router.get('/test/:testId', protect, getSpecificResult );

module.exports = router;