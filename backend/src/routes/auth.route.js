import { Router } from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controller/auth.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";


const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.put('/update-profile',protectRoute ,updateProfile)
router.get('/chek', protectRoute, checkAuth )

export default router