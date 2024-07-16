const express = require('express');
const blogController = require('../controllers/blog.controller');
const router = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' });
// Define your routes here
router.get('/getall', blogController.getAllBlogs);
router.post('/create', upload.single('picture'),blogController.createBlog);
router.delete('/delete/:id', blogController.deleteBlog);
router.put('/like/:blogId', blogController.likeBlog);
router.put('/unlike/:blogId', blogController.unlikeBlog);
router.post('/addcomment/:blogId', blogController.addComment);
router.get('/getcomments/:blogId', blogController.getComments);
router.put('/likecomment/:blogId', blogController.likeComment);
router.put('/unlikecomment/:blogId', blogController.unlikeComment);
router.put('/edit/:blogId',upload.single('picture'), blogController.updateBlog);
router.get('/get/:id', blogController.getBlog);
router.put('/editcomment/:id', blogController.editComment);
router.delete('/deletecomment/:id', blogController.deleteComment);
router.get('/recent', blogController.getRecentBlogs);
router.get('/popular', blogController.getPopularBlogs);
router.get('/user/:userId', blogController.getBlogByUser);
router.get('/feed', blogController.getFeed);
router.get('/sidebar', blogController.sidebarStuff);
router.get('/search',blogController.search)

//for testing period only
router.delete('/deleteall', blogController.deleteAll);
module.exports = router;