import express from "express";
import {
  createAdverticement,
  deleteAdverticement,
  editAdverticement,
  getAdverticement,
  getAllAdverticements,
} from "../controller/adverticement.controller.js";

const router = express.Router();

router.post("/", createAdverticement);
router.put("/:advertisementId", editAdverticement);
router.get("/:id", getAdverticement);
router.get("/", getAllAdverticements);
router.delete("/:id", deleteAdverticement);
export default router;
