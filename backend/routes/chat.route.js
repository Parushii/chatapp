import express from 'express'
import { getChatHistory,sendMessage } from '../controllers/chat.controller.js'
import { verifyToken } from '../utils/verifyUser.js';


const router=express.Router()

router.post('/sendMessage',sendMessage)
router.get('/getChatHistory/:userId/:contactId',getChatHistory)

export default router;