import express from "express";
import { signin, signup, google, updateUser, deleteUser, signout, getUsers, getUser} from '../controllers/user.controller.js';
import { VerifyToken } from "../utils/verifyUser.js";

const router = express.Router();

    router.post('/signup', signup);
    router.post('/signin', signin);
    router.post('/google', google);
    router.put('/update/:userId', VerifyToken,updateUser);
    router.delete('/delete/:userId', VerifyToken,deleteUser);
    router.post('/signout', signout)
    router.get('/getusers',VerifyToken, getUsers)
    router.get('/:userId', getUser)


export default router;