const express = require("express")
const jwt = require("jsonwebtoken")
const userModel = require("../Models/User")

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

const registerUser = async (req, res) => {
    try {
       const { username, email, password, role } = req.body;
   
       // Check if user exists
       const userExists = await userModel.findOne({ $or: [{ email }, { username }] });
       if (userExists) {
         return res.status(400).json({ message: 'User already exists' });
       }
   
       // Create user
       const user = await userModel.create({
         username,
         email,
         password,
         role: role || 'student'
       });
   
       if (user) {
         res.status(201).json({
           _id: user._id,
           username: user.username,
           email: user.email,
           role: user.role,
           token: generateToken(user._id)
         });
       } else {
         res.status(400).json({ message: 'Invalid user data' });
       }
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Server error' });
     }
}

// login user
const loginUser = async (req, res) => {
    try {
       const { email, password } = req.body;
   
       // Check for user email
       const user = await userModel.findOne({ email });
   
       if (user && (await user.matchPassword(password))) {
         res.json({
           _id: user._id,
           username: user.username,
           email: user.email,
           role:  user.role,
           token: generateToken(user._id)
         });
       } else {
         res.status(401).json({ message: 'Invalid email or password' });
       }
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Server error' });
     }
}

// Get user profile
const userProfile = async (req, res) => {
 try {
    const user = await userModel.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { registerUser, loginUser, userProfile }