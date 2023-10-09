import "./reactionTable.scss";

import { DataGrid } from "@mui/x-data-grid";

import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { userColumns, userRows } from "../../userssource";
import axios from "axios";
import ReactPlayer from "react-player";
import { format } from "date-fns";

const ReactionTable = () => {
  const [data, setData] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const [advertisements, setAdvertisements] = useState(null);
  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8800/api/feedbacks`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching feedback details", error);
      }
    };

    fetchFeedbackDetails();
  }, []);

  useEffect(() => {
    // Fetch advertisement details for each feedback item
    const fetchAdvertisementDetails = async () => {
      const advertisementDetails = {};

      for (const feedbackItem of data) {
        if (feedbackItem.advertisement) {
          try {
            const response = await axios.get(
              `http://localhost:8800/api/adverticements/${feedbackItem.advertisement}`
            );
            advertisementDetails[feedbackItem._id] = response.data.title;
          } catch (error) {
            console.error("Error fetching advertisement details", error);
          }
        }
      }

      setAdvertisements(advertisementDetails);
    };

    fetchAdvertisementDetails();
  }, [data]);
  const formattedData = data.map((item, index) => {
    const createdAt = new Date(item.createdAt);
    const date = format(createdAt, "yyyy-MM-dd");
    const time = format(createdAt, "HH:mm:ss");

    return {
      id: index + 1,
      title: advertisements[item._id] || "N/A", // Use the stored advertisement title or "N/A" if not available
      anger: item.emotion_counts.anger,
      contempt: item.emotion_counts.contempt,
      disgust: item.emotion_counts.disgust,
      fear: item.emotion_counts.fear,
      happy: item.emotion_counts.happy,
      neutral: item.emotion_counts.neutral,
      surprise: item.emotion_counts.surprise,
      date, // Separate date
      time, // Separate time
    };
  });

  const userColumns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "title", headerName: "Title", width: 100 },
    { field: "anger", headerName: "Anger", width: 100 },
    { field: "contempt", headerName: "Contempt", width: 100 },
    { field: "disgust", headerName: "Disgust", width: 100 },
    { field: "fear", headerName: "Fear", width: 100 },
    { field: "happy", headerName: "Happy", width: 100 },
    { field: "neutral", headerName: "Neutral", width: 100 },
    { field: "surprise", headerName: "Surprise", width: 100 },
    { field: "date", headerName: "Date", width: 150 }, // Date column
    { field: "time", headerName: "Time", width: 100 }, // Time column
  ];
  const handleDelete = async (id) => {
    console.log(id);
    try {
      await axios.delete(`http://localhost:8800/api/users/${id}`);
      // After successful deletion, refetch the data
      // const response = await axios.get(apiUrl);
      // setData(response.data);
    } catch (error) {
      console.error("Error deleting advertisement", error);
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Reactions History
        {/* <Link to="/users/new" className="link">
          Add New
        </Link> */}
      </div>
      <DataGrid
        className="datagrid"
        rows={formattedData}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
      />
    </div>
  );
};

export default ReactionTable;
