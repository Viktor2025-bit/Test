const express = require("express")
const { getQuestions} = require("../Controllers/test.controller")
const { submitTest } = require("../Controllers/submit.controller") 
const { autoSubmitTest } = require("../Controllers/autoSubmit.controller")
const { saveAnswer } = require("../Controllers/saveAnswer.controller")
const authMiddleware = require("../Middleware/authMiddleware")

const router = express.Router()

router.get("/questions", authMiddleware, getQuestions)

router.post("/submit", submitTest)

router.post("/save-answer", saveAnswer)

router.post("/auto-submit", autoSubmitTest)


module.exports = router