const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User")
const Result = require("../Models/Result")
const Test = require("../Models/Test")

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d", // 7 days expiration
  });

};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword }); // Changed 'name' to 'username'
    
    const token = generateToken(user); // Generate token for auto-login
    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: user._id, // Return userId for frontend
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => { // Changed 'Login' to 'login' for consistency
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id, // Return userId for frontend
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserStats = async (req, res) => {
    try {
        const { userId } = req.query
        if (!userId) {
            return res.status(400).json({ Msg: "user ID is required" })
        }

        const user = await userModel.findById(userId)

        if (!user) {
            return res.status(404).json({ Msg: "User not found" })
        }

        const results = await resultModel.find({ userId }).sort({ submittedAt: -1 })
        const testsCompleted = results.length
        const lastScore = results.length > 0 ? `${results[0].percentage}%` : "N/A"

        res.status(200).json({
            Msg: "User stats fetched successfully",
            name: user.name,
            lastScore,
            testsCompleted
        })
    } catch (error) {
        console.error("Error in getting user Stats :", error)
        res.status(500).json({ Msg: "server error", error: error.message })
    }
}


exports.getActiveTest = async (req, res) => {
    try {
        const { userId } = req.query
        if (!userId) {
            return res.status(400).json({ Msg: "user ID not found" })
        }
        // To check if there's an active test
        const test = await testModel.findOne({ userId, isSubmitted: false })
        if (!test) {
            return res.status(200).json({ Msg: "No active test found" })
        }

        const answered = test.questions.filter((q) => q.userAnswer).length
        const totalQuestions = test.questions.length
        const timeRemaining = test.startTime
            ? Math.max(0, 600- Math.floor(( Date.now() - test.startTime ) / 1000)) // Example: 10 min from creation
            : 600; // Default 10 minutes if no timer set

        res.status(200).json({
            message: "Active test fetched successfully",
            testId: test._id,
            answered,
            totalQuestions,
            timeRemaining,
        })


    } catch (error) {
        console.error("Error in getActiveTest:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }

}


exports.getResults = async (req, res) => {
    try {
      const { userId } = req.query;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const results = await Result.find({ userId }).sort({ submittedAt: -1 }); // Newest first
  
      res.status(200).json(
        results.map((result) => ({
          _id: result._id,
          submittedAt: result.submittedAt,
          score: result.score,
          totalQuestions: result.totalQuestions,
          percentage: result.percentage,
        }))
      );
    } catch (error) {
      console.error("Error in getResults:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

