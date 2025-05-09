import express from "express"
const router = express.Router()
import { authUser } from "../middleware/authMiddleware.js";
import { getProfile, loginUser, logoutUser, registerUser, updateProfile } from "../controllers/user.controller.js";


router.post('/register', registerUser)
router.post('/login', loginUser)


router.get('/home', authUser, getProfile)
router.post('/logout', authUser, logoutUser)
router.put('/update-profile', authUser, updateProfile)

export default router;