const express = require('express');
const multer = require('multer')
const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer as needed
const userController = require('../controllers/user.controller');


router.post('/create', userController.createUser);
router.get('/getAll', userController.getUsers);
router.post('/signin', userController.loginUser);
router.get('/getuser', userController.get);
router.get('/blogs/:id',  userController.blogs);
router.get('/getuserpage/:id',  userController.getUser);
router.put('/update/', upload.single('pfp'), userController.updateUser);
router.put('/resetpfp/', userController.resetPfp);
router.get("/signup", userController.authenticateToken, userController.signupUser);
router.get('/recentblogs', userController.recentBlogs);
router.get('/forgotpassword', userController.forgotPassword);
module.exports = router;