const { Schema, model, models } = require("mongoose");

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "'Title' field is required"],
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [{
      type: Object,
      contains: {
          answers: {type: Array},
          correctAnswer: String,
          questionName: String
      }
  }],
    users: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    picture: String,
  },
  {
    timestamps: true,
  }
);

const Quiz = model("Quiz", quizSchema);

module.exports = Quiz;
