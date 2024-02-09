import express from "express";
import { verifyToken } from "../util/tokenManagement.js";

import {createListing, getList} from "../controllers/listing.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/:id", verifyToken, getList);

export default router;