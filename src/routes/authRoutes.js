import { celebrate } from "celebrate";
import { Router } from "express";

import { logoutUser, registerUser } from "../controllers/authController.js";
import { loginUserSchema } from "../validations/authValidation.js";

const router = Router()

router.post("/auth/register", celebrate(registerUserSchema),registerUser)
router.post("/auth/login",celebrate(loginUserSchema),loginUser)
router.post("/auth/logout",logoutUser)
router.post("/auth/refresh")

export default router