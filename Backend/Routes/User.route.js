const express = require("express")
const { signup, login, getUserStats, getActiveTest, getResults } = require("../Controllers/user.controller")
const authMiddleware = require("../Middleware/authMiddleware")
const router = express.Router()

router.post("/create", signup)

router.post("/login", login)

router.get("/stats", authMiddleware, getUserStats)

router.get("/tests/active", authMiddleware, getActiveTest)

router.get("/results", authMiddleware, getResults)

module.exports = router