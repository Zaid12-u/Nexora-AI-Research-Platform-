import express from "express";
import { saveHistory, getHistory, deleteHistory } from "../controllers/history.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/save", verifyToken, saveHistory);
router.get("/get", verifyToken, getHistory);
router.delete("/delete/:id", verifyToken, deleteHistory);

export default router;