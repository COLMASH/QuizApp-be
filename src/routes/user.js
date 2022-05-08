const router = require('express').Router();
const userController = require('../controller/user.controller');
const { auth, formData } = require('../utils/middlewares');

router.route('/signin').post(userController.signin);
router.route('/signup').post(userController.signup);
router.route('/userList').get(userController.list);
router.route('/userInfo').get(auth, userController.show);
router.route('/userProfilePic').put(auth, formData, userController.update);
router.route('/userUpdate').put(auth, userController.update);
router.route('/:userId').delete(userController.destroy);

module.exports = router;
