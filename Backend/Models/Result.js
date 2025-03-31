const mongoose = require("mongoose")

const resultSchema = new mongoose.Schema({
    candidate : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },

    score : {
        type : Number,
        required : true
    },

    totalQuestions : {
        type : Number,
        required : true
    },

    correctAnswers : {
        type : Number,
        required : true
    },

    submittedAt : {
        type : Date,
        default : Date.now
    }
})


const testResult = mongoose.model("TestResult", resultSchema)

module.exports = testResult