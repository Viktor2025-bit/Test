const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionId: String,  // For OpenTDB questions
  question: String,
  correctAnswer: String,
  incorrectAnswers: [String],
  type: {
    type: String,
    enum: ['multiple', 'boolean'],
    default: 'multiple'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: String
});

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timeLimit: {
    type: Number,  // In minutes
    default: 30
  },
  questions: [questionSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Test', testSchema);