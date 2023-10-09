import express from "express";
import { getAllEmotionalCounts, getAllemotionsTimeEqualAdverticementTime } from "../controller/emotion_counts.controller.js";

const router = express.Router();

router.get("/:id", getAllEmotionalCounts);
router.get("/", getAllemotionsTimeEqualAdverticementTime);

export default router;
