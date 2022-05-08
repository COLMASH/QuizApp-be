const Quiz = require('../models/quiz.model');
const User = require('../models/user.model');

module.exports = {
    async list(req, res) {
        try {
            const quiz = await Quiz.find().populate('creator');
            res.status(200).json(quiz);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    },

    async update(req, res) {
        try {
            const { quizId } = req.body;
            const quiz = await Quiz.findByIdAndUpdate(quizId, req.body, {
                new: true
            });
            res.status(200).json(quiz);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async destroy(req, res) {
        try {
            const { quizId } = req.body;
            const quiz = await Quiz.findByIdAndDelete(quizId);
            res.status(200).json(quiz);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    async create(req, res) {
        try {
            const { body, userId } = req;
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User does not exist');
            }
            const quiz = await Quiz.create({ ...body, creator: userId });
            await User.updateOne({ _id: userId }, { $addToSet: { quizzes: quiz._id } });
            res.status(201).json(quiz);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};
