const express = require("express")
const { signup, Login } = require("../Controllers/authController")

const router = express.Router()

router.post("/create", signup)

router.post("/login", Login)

module.exports = router