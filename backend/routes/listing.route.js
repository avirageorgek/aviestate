import express from "express";
import { verifyToken } from "../util/tokenManagement.js";

import {createListing, getList, deleteList, updateList} from "../controllers/listing.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.get("/:id", getList);
router.delete("/:id", verifyToken, deleteList);
router.patch("/:id", verifyToken, updateList);

export default router;