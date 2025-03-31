const dotenv = require("dotenv")
dotenv.config()

const express = require("express")
const app = express()
const cors = require("cors")
const mongoose = require("mongoose")
const userRoutes = require("./Routes/User.route")
const testRoutes = require("./Routes/Test.route")

app.use(express.json())
app.use(cors())

app.use("/api/user", userRoutes)
app.use("/api/test", testRoutes)

const port = process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected")
})
.catch((err) => {
    console.log(err.message)
})

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`)
})
