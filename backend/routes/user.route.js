import express from 'express'
import {getUser, getUsers} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router=express.Router()

router.get('/getusers',verifyToken,getUsers)
router.get('/:userId',verifyToken,getUser)

export default router;