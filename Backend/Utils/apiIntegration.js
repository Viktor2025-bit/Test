const axios = require('axios');

const BASE_URL = 'https://opentdb.com/api.php';

// Get categories from OpenTDB
const getCategories = async () => {
  try {
    const response = await axios.get('https://opentdb.com/api_category.php');
    return response.data.trivia_categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Fetch questions with parameters
const fetchQuestions = async (amount = 10, category = '', difficulty = '', type = '') => {
  try {
    let url = `${BASE_URL}?amount=${amount}`;
    
    if (category) url += `&category=${category}`;
    if (difficulty) url += `&difficulty=${difficulty}`;
    if (type) url += `&type=${type}`;
    
    const response = await axios.get(url);
    
    // Format questions to match our schema
    if (response.data.results) {
      return response.data.results.map(q => ({
        question: q.question,
        correctAnswer: q.correct_answer,
        incorrectAnswers: q.incorrect_answers,
        type: q.type,
        difficulty: q.difficulty,
        category: q.category
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

module.exports = {
  getCategories,
  fetchQuestions
};