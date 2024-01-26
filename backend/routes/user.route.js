import express from "express";

import {test, updateProfile} from "../controllers/user.controller.js";
import {verifyToken} from "../util/tokenManagement.js";

const router = express.Router();


router.get("/test", test);

router.post("/update/:id", verifyToken, updateProfile);

export default router;