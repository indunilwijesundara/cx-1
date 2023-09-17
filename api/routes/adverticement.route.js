import express from "express";
import {
  createAdverticement,
  editAdverticement,
} from "../controller/adverticement.controller.js";

const router = express.Router();

router.post("/", createAdverticement);
router.put("/:advertisementId", editAdverticement);

export default router;
