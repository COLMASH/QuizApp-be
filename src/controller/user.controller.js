const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { welcome } = require("../utils/mailer");
const User = require("../models/user.model");
const Quiz = require("../models/quiz.model");

module.exports = {
  async list(req, res) {
    try {
      const users = await User.find({}).select({ password: 0 });
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async show(req, res) {
    try {
      const { userId } = req;
      const user = await User.findById(userId).populate({
        path: "subscribedQuizzes",
        populate: { path: "creator" },
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { userId, body } = req;
      const user = await User.findByIdAndUpdate(userId, body, { new: true });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async destroy(req, res) {
    try {
      const { userId } = req;
      const user = await User.findByIdAndDelete(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async signup(req, res) {
    try {
      const { body } = req;
      const user = await User.create(body);

      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24 * 365,
      });
      await welcome(user);

      res.status(201).json({
        token,
        user: {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async signin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error("Invalid password or email");
      }
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("Invalid password or email");
      }
      const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24 * 365,
      });

      res.status(201).json({
        token,
        user: {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async subscribeQuiz(req, res) {
    try {
      const { quizId } = req.body;
      const { userId } = req;
      let userInit = await User.findById(userId);
      if (userInit.subscribedQuizzes.includes(quizId)) {
        res.status(200).json("already");
      } else {
        await User.updateOne(
          { _id: userId },
          { $addToSet: { subscribedQuizzes: quizId } }
        );
        await Quiz.updateOne({ _id: quizId }, { $addToSet: { users: userId } });
        let user = await User.findById(userId).populate("quizzes");
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  async unsubscribeQuiz(req, res) {
    try {
      const { quizId } = req.body;
      const { userId } = req;
      await User.updateOne(
        { _id: userId },
        { $pull: { subscribedQuizzes: quizId } }
      );
      await Quiz.updateOne({ _id: quizId }, { $pull: { users: userId } });
      const quizUnsubscribed = await Quiz.findById(quizId);
      res.status(200).json(quizUnsubscribed);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
