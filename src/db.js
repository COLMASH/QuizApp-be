const mongoose = require('mongoose');

function connect() {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    mongoose
        .connect(mongoURI, options)
        .then(() => console.log('Connection established successfully'))
        .catch((err) => console.log('Something went wrong', err));
}

module.exports = connect;
