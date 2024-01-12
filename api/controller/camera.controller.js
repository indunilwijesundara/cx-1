import Cameras from "../models/cameras.model.js";

export const createCameras = async (req, res) => {
  try {
    // Extracting data from the request body
    const { name, ip } = req.body;

    // Creating a new camera instance
    const newCamera = new Cameras({
      name,
      ip,
    });

    // Saving the new camera to the database
    const createdCamera = await newCamera.save();

    res.status(201).json(createdCamera);
  } catch (error) {
    // Handling errors
    console.error("Error creating camera:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getCameras = async (req, res) => {
  try {
    // Fetch all cameras from the database
    const cameras = await Cameras.find();

    res.status(200).json(cameras);
  } catch (error) {
    // Handling errors
    console.error("Error fetching cameras:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const deleteCamera = async (req, res) => {
  try {
    // Extracting the camera ID from the request parameters
    const cameraId = req.params.id;

    // Deleting the camera from the database
    const deletedCamera = await Cameras.findByIdAndDelete(cameraId);

    if (!deletedCamera) {
      // If the camera with the given ID is not found
      return res.status(404).json({ error: "Camera not found" });
    }

    res
      .status(200)
      .json({ message: "Camera deleted successfully", deletedCamera });
  } catch (error) {
    // Handling errors
    console.error("Error deleting camera:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
