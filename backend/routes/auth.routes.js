import { Router } from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
import { jwtAuth } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/me").get(jwtAuth, getMe);

export default router;
