import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUser, getChat, sendMessage } from "../controller/message.contoller.js";


const router = Router()

router.get('/users', protectRoute, getUser)
router.get('/:id', protectRoute, getChat)
router.post('/send/:id', protectRoute, sendMessage)


export default router