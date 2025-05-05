import express from "express"
import { adminDashboard, createUser, deleteUser, editUser, loginAdmin, logoutAdmin } from "../controllers/admin.controller.js";
const router = express.Router()

router.post("/login", loginAdmin)
router.get("/dashboard", adminDashboard)
router.post("/create", createUser)
router.patch("/edit", editUser)
router.delete("/delete", deleteUser)
router.post("/logout", logoutAdmin)

export default router;