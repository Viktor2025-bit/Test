const Test = require("../Models/Test");

exports.autoSubmitTest = async (req, res) => {
   try {
      const { testid, userId } = req.body;

      if (!testid || !userId) {
         return res.status(400).json({ Msg: "Test ID and User ID are required" });
      }

      // Find the test
      const test = await Test.findOne({ _id: testid, userId });

      if (!test) {
         return res.status(404).json({ Msg: "Test not found" });
      }

      if (test.isSubmitted) {
         return res.status(400).json({ Msg: "Test already submitted" });
      }

      if (!test.answers || !test.correctAnswers) {
         return res.status(400).json({ Msg: "Test data is incomplete, missing answers" });
      }

      // Mark as submitted
      test.isSubmitted = true;
      test.isAutoSubmitted = true;
      test.submissionTime = new Date();

      // Calculate the score
      test.score = calculateScore(test.answers, test.correctAnswers);

      // Save the updated test
      await test.save();

      return res.status(200).json({ 
         Msg: "Test auto-submitted successfully", 
         score: test.score 
      });

   } catch (error) {
      console.error("Error in autoSubmitTest:", error);
      res.status(500).json({ Msg: "Server error", error: error.message });
   }
};
