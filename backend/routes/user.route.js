import express from "express";

import {deleteUser, signOutUser, test, updateProfile, getUserListings, getListCount} from "../controllers/user.controller.js";
import {verifyToken} from "../util/tokenManagement.js";

const router = express.Router();


router.get("/test", test);

router.post("/update/:id", verifyToken, updateProfile);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/signOut/:id", verifyToken, signOutUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/list/count/:id", verifyToken, getListCount);


export default router;