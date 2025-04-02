const express = require('express');
const {  registerUser, loginUser, userProfile } = require("../Controllers/user.controller")
const { protect } = require("../Middleware/authMiddleware")

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser );


// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', loginUser );



// @route   GET /api/auth/profile
// @desc    Get user profile
router.get('/profile', protect, userProfile );

module.exports = router;