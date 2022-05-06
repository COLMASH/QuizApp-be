const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { welcome } = require("../utils/mailer");
const User = require("../models/user.model");

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
          profilePicture: user.profilePicture,
        },
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
