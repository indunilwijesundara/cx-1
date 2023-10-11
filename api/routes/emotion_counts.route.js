import express from "express";
import {
  getAllEmotionalCounts,
  getEmotionsForAdvertisement,
} from "../controller/emotion_counts.controller.js";

const router = express.Router();
router.get("/", getAllEmotionalCounts);
router.get("/adverticement/:id", getEmotionsForAdvertisement);

export default router;
