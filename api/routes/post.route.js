import express from 'express'
import { VerifyToken } from '../utils/verifyUser.js';
import { createPost, deletepost, getposts, updatepost } from '../controllers/post.controller.js';

 const router = express.Router();

 router.post('/create', VerifyToken, createPost)
 router.get('/getposts', getposts)
 router.delete('/deletepost/:postId/:userId', VerifyToken, deletepost)
 router.put('/updatepost/:postId/:userId', VerifyToken, updatepost)

 export default router;