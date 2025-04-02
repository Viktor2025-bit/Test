const express = require("express")
const resultModel = require("../Models/Result")
const testModel = require("../Models/Test")


// submit test result

const submitResult = async (req, res) => {
    try {
       const { testId, answers, timeTaken } = req.body;
   
       // Get test
       const test = await Test.findById(testId);
       if (!test) {
         return res.status(404).json({ message: 'Test not found' });
       }
   
       // Calculate score
       let score = 0;
       const processedAnswers = answers.map(answer => {
         const question = test.questions.find(q => q._id.toString() === answer.questionId);
         const isCorrect = question && question.correctAnswer === answer.userAnswer;
         if (isCorrect) score++;
         return {
           questionId: answer.questionId,
           userAnswer: answer.userAnswer,
           isCorrect
         };
       });
   
       // Create result
       const result = await Result.create({
         test: testId,
         user: req.user._id,
         answers: processedAnswers,
         score,
         totalQuestions: test.questions.length,
         timeTaken
       });
   
       res.status(201).json(result);
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Server error' });
     }
}


// get user result

const userResult = async (req, res) => {
    try {
       const results = await Result.find({ user: req.user._id })
         .populate('test', 'title')
         .sort('-completedAt');
       
       res.json(results);
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Server error' });
     }
}


// get result fro a specific test ( teacher only )

const getSpecificResult = async (req, res) => {
   try {
       const test = await Test.findById(req.params.testId);
       
       if (!test) {
         return res.status(404).json({ message: 'Test not found' });
       }
       
       // Check if user is test creator
       if (test.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
         return res.status(401).json({ message: 'Not authorized' });
       }
       
       const results = await Result.find({ test: req.params.testId })
         .populate('user', 'username email')
         .sort('-completedAt');
       
       res.json(results);
     } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Server error' });
     }
}


module.exports = { submitResult, userResult, getSpecificResult }

