import { Router } from "express";
import { login, logout, signup, updateProfile } from "../controller/auth.controllers.js";


const router = Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', logout)
router.put('/update-profile', updateProfile)


export default router