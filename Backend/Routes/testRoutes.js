const express = require("express")
const { authMiddleware } = require("../Middleware/authMiddleware")
const { startTest, submitTest, getResults, getHistory } = require("../Controllers/testController")

const router = express.Router()

router.post("/start", authMiddleware, startTest)

router.post("/submit", authMiddleware, submitTest)

router.get("/result/:id", authMiddleware, getResults)

router.get("/history/:id", authMiddleware, getHistory)

module.exports = router