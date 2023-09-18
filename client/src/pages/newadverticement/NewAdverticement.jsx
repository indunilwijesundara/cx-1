import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import "./newAdverticement.scss";
import uploadFirebase from "../../utils/uploadFirebase";
import axios from "axios";

const NewAdverticement = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    scheduleDateTime: "",
    video: "",
  });

  const [errors, setErrors] = useState({});



  const handleChange = (e) => {
      setFormData((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
console.log(formData)
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = "Title is required";
    }

    if (!formData.scheduleDateTime) {
      newErrors.scheduleDateTime = "Schedule Date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Form validation failed, do not proceed with submission
    }

    try {
      const url = await uploadFirebase(file);
      await axios.post("http://localhost:8800/api/adverticements/", {
        ...formData,
         video: url,
        userId: currentUser._id,
      });

      // Clear the form after successful submission
      setFormData({
        title: "",
        scheduleDateTime: "",
        video: "",
      });
      setFile(null);
    } catch (error) {
      console.error("Error uploading data:", error);
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
              <video width="320" height="240" controls>
                <source src={URL.createObjectURL(file)} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
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

              <button type="submit">Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAdverticement;
