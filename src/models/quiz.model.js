const { Schema, model, models } = require('mongoose');

const quizSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "'Name' field is required"]
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        questions: [
            {
                type: Object,
                contains: {
                    answers: { type: Array },
                    correctAnswer: String,
                    questionName: String
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Quiz = model('Quiz', quizSchema);

module.exports = Quiz;
