import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import "./newAdverticement.scss";
import uploadFirebase from "../../utils/uploadFirebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";

const NewAdverticement = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    scheduleDate: "",
    scheduleTime: "",
    endScheduleDate: "",
    endScheduleTime: "",
    video: "",
  });

  const [cameraSelection, setCameraSelection] = useState({
    camera1: false,
    camera2: false,
    camera3: false,
  });

  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleCameraCheckboxChange = (camera) => {
    setCameraSelection((prev) => ({
      ...prev,
      [camera]: !prev[camera],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    }
    if (!formData.video) {
      newErrors.video = "Video link is required";
    }
    if (!formData.scheduleDate) {
      newErrors.scheduleDate = "Start Schedule Date is required";
    }
    if (!formData.scheduleTime) {
      newErrors.scheduleTime = "Start Schedule Time is required";
    }
    if (!formData.endScheduleDate) {
      newErrors.endScheduleDate = "End Schedule Date is required";
    }
    if (!formData.endScheduleTime) {
      newErrors.endScheduleTime = "End Schedule Time is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || uploading) {
      return;
    }

    try {
      setUploading(true);

      const url = await uploadFirebase(file, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });

      const cameras = Object.keys(cameraSelection).filter(
        (camera) => cameraSelection[camera]
      );

      // Default IP addresses for cameras
      const cameraIPs = {
        camera1: "192.13.12.23",
        camera2: "192.13.12.24",
        camera3: "192.13.12.25",
      };

      // Include selected cameras with their default IP addresses in the data
      await axios.post("http://localhost:8800/api/adverticements/", {
        ...formData,
        userId: currentUser._id,
        cameras: cameras.map((camera) => ({
          name: camera,
          ip: cameraIPs[camera],
        })),
      });
      navigate("/adverticement");
      setFormData({
        title: "",
        scheduleDate: "",
        video: "",
        scheduleTime: "",
      });
      setFile(null);
      setUploadProgress(0);
      setUploading(false);
    } catch (error) {
      console.error("Error uploading data:", error);
      setUploading(false);
    }
  };
console.log(formData)
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Advertisement</h1>
        </div>
        <div className="bottom">
          <div className="left">
            {formData.video ? (
              <ReactPlayer
                height={300}
                width={400}
                url={formData.video}
                controls={true}
              />
            ) : (
              <img
                src="https://icon-library.com/images/upload_video_162306_9899.png"
                alt=""
              />
            )}
          </div>
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Video Link</label>
                <input
                  type="text"
                  name="video"
                  placeholder="Enter"
                  value={formData.video}
                  onChange={handleChange}
                />
                {errors.video && <span className="error">{errors.video}</span>}
              </div>
              <div className="formInput">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <span className="error">{errors.title}</span>}
              </div>
              <div className="formInput">
                <label>Start Schedule Date</label>
                <input
                  type="date"
                  name="scheduleDate"
                  placeholder=""
                  value={formData.scheduleDate}
                  onChange={handleChange}
                />
                {errors.scheduleDate && (
                  <span className="error">{errors.scheduleDate}</span>
                )}
              </div>
              <div className="formInput">
                <label>Start Schedule Time</label>
                <input
                  type="time"
                  name="scheduleTime"
                  placeholder=""
                  value={formData.scheduleTime}
                  onChange={handleChange}
                />
                {errors.scheduleTime && (
                  <span className="error">{errors.scheduleTime}</span>
                )}
              </div>

              <div className="formInput">
                <label>End Schedule Date</label>
                <input
                  type="date"
                  name="endScheduleDate"
                  placeholder=""
                  value={formData.endScheduleDate}
                  onChange={handleChange}
                />
                {errors.endScheduleDate && (
                  <span className="error">{errors.endScheduleDate}</span>
                )}
              </div>
              <div className="formInput">
                <label>End Schedule Time</label>
                <input
                  type="time"
                  name="endScheduleTime"
                  placeholder=""
                  value={formData.endScheduleTime}
                  onChange={handleChange}
                />
                {errors.endScheduleTime && (
                  <span className="error">{errors.endScheduleTime}</span>
                )}
              </div>

              {/* Add checkboxes for camera selection */}
              <div className="CheckBoxes">
               <div> <label>Camera 1 : </label>
                <input
                  type="checkbox"
                  name="camera1"
                  checked={cameraSelection.camera1}
                  onChange={() => handleCameraCheckboxChange("camera1")}
                /></div>
                 <div> <label>Camera 2 : </label>
                <input
                  type="checkbox"
                  name="camera2"
                  checked={cameraSelection.camera2}
                  onChange={() => handleCameraCheckboxChange("camera2")}
                /></div>
               <div>  <label>Camera 3 : </label>
                <input
                  type="checkbox"
                  name="camera3"
                  checked={cameraSelection.camera3}
                  onChange={() => handleCameraCheckboxChange("camera3")}
                /></div>
              </div>
              <div className="formInput">
              
              </div>
              <div className="formInput">
               
              </div>

              <div className="formInput">
                {uploading ? (
                  <div className="formInputButton">
                    <div>
                      <CircularProgress size={34} thickness={5} />
                    </div>
                  </div>
                ) : (
                  <div className="formInputButton">
                    <button type="submit">
                      {uploading ? "Uploading..." : "Send"}
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAdverticement;
