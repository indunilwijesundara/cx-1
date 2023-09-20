import React, { useEffect, useState } from "react";
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
    video: "",
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    }

    if (!formData.scheduleDate) {
      newErrors.scheduleDate = "Schedule Date is required";
    }
    if (!formData.scheduleTime) {
      newErrors.scheduleTime = "Schedule Time is required";
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

      await axios.post("http://localhost:8800/api/adverticements/", {
        ...formData,
        video: url,
        userId: currentUser._id,
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
            {file ? (
              <ReactPlayer height={300} width={400} url={""} controls={true} />
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
                <label htmlFor="file">
                  Video: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
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
                <label>Schedule Date</label>
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
                <label>Schedule Time</label>
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

              {/* {uploadProgress > 0 && (
                <div className="upload-progress">
                  Uploading: {uploadProgress}% completed
                </div>
              )} */}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAdverticement;
