const Test = require("../Models/Test");

exports.saveAnswer = async (req, res) => {
  try {
    const { testId, questionIndex, userAnswer } = req.body;

    if (!testId || questionIndex === undefined || userAnswer === undefined) {
      return res.status(400).json({ Msg: "Missing required fields" });
    }

    let test = await Test.findById(testId);

    if (!test) {
      return res.status(404).json({ Msg: "Test not found" });
    }

    if (test.isSubmitted) {
      return res.status(400).json({ Msg: "Test has already been submitted" });
    }

    if (!test.questions || test.questions.length <= questionIndex) {
      return res.status(400).json({ Msg: "Invalid question index" });
    }

    // Save the answer
    test.questions[questionIndex].userAnswer = userAnswer;

    await test.save(); // Fix: Save the `test` object, not `testModel.save()`

    res.status(200).json({ Msg: "Answer saved successfully" });
  } catch (error) {
    console.error("Error in saveAnswer:", error);
    res.status(500).json({ Msg: "Internal server error", error: error.message });
  }
};
