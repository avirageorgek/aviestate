import express from "express";

import {signup, signin} from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/healthcheck", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "API working fine"
    });
});
router.post("/signup", signup);
router.post("/signin", signin);

export default router;