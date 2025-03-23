const jwt = require("jsonwebtoken")

exports.authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")
  if(!token){
    return res.status(401).json({ Msg : "Access denied. No token provided" })
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer", ""),
process.env.JWT_SECRET)
req.user = decoded
next()
  } catch (error) {
    res.status(400).json({ Msg : "Invalid token" })
  }
}

exports.adminMiddleware = (req, res, next) => {
  if(req.user.role !== "admin"){
    return res.status(403).json({ Msg : "Access denied. Admins only"})
  }
  next()
}