const mongoose = require("mongoose")

const TestSchema = new mongoose.Schema({
    candidate : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    subject : {
        type : String,
        required : true
    },

    questions : {
        type : Array,
        required : true
    },

    score : {
        type : Number,
        default : 0
    },

    status : {
        type : String,
        enum : [ "pending", "completed"],
        default : "pending"
    },

    startedAt : {
        type : Date,
        default : Date.now
    },

    submittedAt : {
        type : Date
    }
})

module.exports = mongoose.model("Test", TestSchema)