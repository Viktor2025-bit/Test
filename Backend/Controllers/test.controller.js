const express = require("express")
const testModel = require("../Models/Test")


// Create a new test
const createNewTest = async (req, res) => {

    try {
        const { title, description, timeLimit, questions } = req.body

        const test = new testModel.create({ title, description, timeLimit, creator: req.user._id })

        res.status(201).json(test)
    } catch (error) {
        console.error(error)
        res.status(500).json({ Msg: "Internal server error" })
    }
}


// Get all test

const getAllTest = async (req, res) => {
    try {
        let query = {}

        // if student only show published test

        if (req.user.role === "student") {
            query = { isPublished: true }
        } else if (req.user.role === "teacher") {
            query = { creator: req.user._id }
        }
        const tests = await Test.find(query).populate('creator', 'username');
        res.json(tests);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


const getTest = async (req, res) => {

    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if user is creator
        if (test.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedTest = await Test.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedTest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

}


const updateTest = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if user is creator
        if (test.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedTest = await Test.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(updatedTest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


const deleteTest = async (req, res) => {

    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if user is creator
        if (test.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await test.remove();

        res.json({ message: 'Test removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports = { createNewTest, getAllTest, getTest, updateTest, deleteTest }

