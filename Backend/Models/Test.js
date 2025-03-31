const mongoose = require("mongoose")

const testSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    testFile : {
        type : String,
        required: true
    },

    questions: [
        {
            question : String,
            options: [String],
            correctAnswer : String,
            userAnswer : {
                type : String,
                default: ""
            }
        }
    ],

    isSubmitted : {
        type : Boolean,
        default: false
    },

    isAutoSubmitted : {
        type : Boolean,
        default : false
    },

    score : {
        type : Number,
        default : 0
    },

    submissionTime : {
        type : Date
    },

    startTime: {
        type: Date,
        default: Date.now,
      },

    createdAt : {
        type : Date,
        default : Date.now
    }
})

const Test = mongoose.model("Test", testSchema)

module.exports = Test