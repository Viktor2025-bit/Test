const User = require("../Models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// Token generation logic
const generateToken = (user) => {
  return jwt.sign({

    id : user._id,
    role : user.role
  },
  process.env.JWT_SECRET, {
    expiresIn: "7d",
  }
)
}


// Signup logic

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if(!name || !email || !password){
        return res.status(400).json({ Msg : "All fields are required" })
    }

    const existingUser = await User.findOne({ email })
    if(existingUser){
        return res.status(400).json({ Msg : "Email already registered" })
    }

    const user = await User.create({ name, email, password })
    res.status(201).json({ Msg : "User registered successfully", user })

  } catch (error) {
    res.status(500).json({ Msg : error.message })
  }
}


// Login logic

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body
    if(!email || !password){
        return res.status(400).json({ Msg : "All fields are required "})
    }

    const user = await User.findOne({ email })
    if(!email){
        return res.status(400).json({ Msg : "Invalid email or password"})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        return res.status(400).json({ Msg : "Invalid email or password" })
    }

    const token = generateToken(user)
  } catch (error) {
    
  }
}

