import express from "express";
import {
  createCameras,
  deleteCamera,
  getCameras,
} from "../controller/camera.controller.js";

const router = express.Router();

router.post("/", createCameras);
router.get("/", getCameras);
router.delete("/:id", deleteCamera);
export default router;
