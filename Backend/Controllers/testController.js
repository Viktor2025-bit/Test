const Test = require("../Models/Test")
const axios = require("axios")

exports.startTest = async (req, res) => {
  try {
    // Fetch 10 multiple-choice questions from Open Trivia Database
    const response = await axios.get("https://opentdb.com/api.php?amount=20&type=multiple");

    // Check if response contains questions
    if (!response.data.results || response.data.results.length === 0) {
      return res.status(400).json({ Msg: "No questions found" });
    }

    // Format questions with shuffled options
    const questions = response.data.results.map((q, index) => ({
      id: index + 1,
      questionText: q.question,
      options: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
      correctAnswer: q.correct_answer,
    }));

    res.status(200).json({ Msg: "Questions fetched successfully", questions });
  } catch (error) {
    res.status(500).json({ Msg: "Failed to fetch questions", Error: error.message });
  }
};

// Submit test
exports.submitTest = async (req, res) => {
   try {
    const { testId, answers } = req.body
    if(!testId || !answers){
        return res.status(400).json({ Msg : "TestId and answers are required" })
    }

    const test = await Test.findById(testId)
    if(!test){
        return res.status(404).json({ Msg : "Test not found"})
    }

    let score = 0

    test.questions.forEach((q, index) => {
        if(q.correctAnswer === answers[index]){
            score = score + 1
        }
    })

    test.score = score
    test.status = "completed"
    test.submittedAt = new Date()
    await test.save()

    res.status(200).json({ Msg : "Test submitted successfully", score, total : test.questions.length })
    
   } catch (error) {
    res.status(500).json({ Msg : error.message })
   }
}


// Get Test Results
exports.getResults = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate("candidate", "name email")
    if(!test){
        return res.status(404).json({ Msg : "Test not found" })
    }

    res.status(200).json({ Msg : "Test results", test })
  } catch (error) {
    res.status(500).json({ Msg : error.message })
  }
}


// Test History

exports.getHistory = async (req, res) => {
  try {
    const tests = await Test.find({ candidate: req.user.id }).sort({ createdAt : -1 })
    res.status(200).json({ Msg : "Test history", tests })
  } catch (error) {
    res.status(500).json({ Msg : error.message })
  }
}