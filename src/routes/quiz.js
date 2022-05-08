const router = require('express').Router();
const quizController = require('../controller/quiz.controller');
const { auth } = require('../utils/middlewares');

router.route('/quizCreate').post(auth, quizController.create);
router.route('/quizList').get(quizController.list);
router.route('/quizUpdate').put(quizController.update);
router.route('/quizDelete').delete(quizController.destroy);

module.exports = router;
