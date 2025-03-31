const Result = require("../Models/Result");

exports.submitTest = async (req, res) => {
  try {
    const { candidateId, answers } = req.body;

    if (!candidateId) {
      return res.status(400).json({ Msg: "Candidate ID is required" });
    }
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ Msg: "Answers are required and must be an array" });
    }

    let score = 0;
    let totalQuestions = answers.length;
    let detailedResults = [];

    for (let i = 0; i < totalQuestions; i++) {
      const question = answers[i];

      if (!question.question || !question.selectedAnswer || !question.correctAnswer) {
        return res.status(400).json({ Msg: "Invalid answer format" });
      }

      const isCorrect = question.selectedAnswer === question.correctAnswer;
      if (isCorrect) score++;

      detailedResults.push({
        question: question.question,
        selectedAnswer: question.selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect
      });
    }

    const percentage = ((score / totalQuestions) * 100).toFixed(2);

    // Save test result in the database
    const testResult = new Result({
      candidate: candidateId,
      score,
      totalQuestions,
      percentage,
      detailedResults
    });

    await testResult.save();

    res.status(200).json({
      Msg: "Test submitted successfully",
      score,
      totalQuestions,
      percentage,
      detailedResults
    });

  } catch (error) {
    console.error("Error submitting test:", error);
    res.status(500).json({ Msg: "Internal Server Error" });
  }
};
