const router = require("express").Router();
const quizController = require("../controller/quiz.controller");
const { auth, formData } = require("../utils/middlewares");

router.route("/quizCreate").post(auth, quizController.create);
router.route("/quizList").get(quizController.list);
router.route("/quizInfo").get(auth, quizController.show);
router.route("/quizUpdate").put(auth, formData, quizController.update);
router.route("/quizDelete").delete(quizController.destroy);

module.exports = router;
