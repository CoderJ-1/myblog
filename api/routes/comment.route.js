import express from "express";
import { VerifyToken } from '../utils/verifyUser.js'
import { CreateComment, EditComment, deleteComment, getComment, getComments, likeComment } from "../controllers/comment.controller.js";

const router = express.Router();

router.post('/create', VerifyToken, CreateComment)
router.get('/getcomments/:postId', getComment)
router.get('/getcomments', VerifyToken, getComments)
router.put('/likecomment/:commentId', VerifyToken, likeComment)
router.put('/editcomment/:commentId', VerifyToken, EditComment)
router.delete('/deletecomment/:commentId', VerifyToken, deleteComment )

export default router