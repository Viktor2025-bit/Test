const express = require("express")
const { getCategories, fetchQuestions } = require("../Utils/apiIntegration")

// get all categories

const getAllCategories = async (req, res) => {
    try {
        const categories = await getCategories();
        res.json(categories);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching categories' });
      }
}

// fetch questions

const getQuestions = async (req, res) => {
    try {
        const { amount, category, difficulty, type } = req.query;
        const questions = await fetchQuestions(amount, category, difficulty, type);
        res.json(questions);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching questions' });
      }
}

module.exports = { getAllCategories, getQuestions }
