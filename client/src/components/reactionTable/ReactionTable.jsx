import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";

const ReactionTable = () => {
  const [data, setData] = useState([]);
  const [advertisements, setAdvertisements] = useState({});

  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/emotions");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching feedback details", error);
      }
    };

    fetchFeedbackDetails();
  }, []);

  useEffect(() => {
    const fetchAdvertisementDetails = async () => {
      const advertisementDetails = {};

      for (const feedbackItem of data) {
        if (feedbackItem.advertisement) {
          try {
            const response = await axios.get(
              `http://localhost:8800/api/advertisements/${feedbackItem.advertisement}`
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
    const createdAt = new Date(item.advertisement.scheduleDateTime);
    const date = format(createdAt, "yyyy-MM-dd");
    const time = format(createdAt, "HH:mm:ss");

    return {
      id: index + 1,
      title: item.advertisement.title || "N/A",
      anger: item.emotionData.emotion_counts.anger,
      contempt: item.emotionData.emotion_counts.contempt,
      disgust: item.emotionData.emotion_counts.disgust,
      fear: item.emotionData.emotion_counts.fear,
      happy: item.emotionData.emotion_counts.happy,
      neutral: item.emotionData.emotion_counts.neutral,
      surprise: item.emotionData.emotion_counts.surprise,
      date,
      time,
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
    { field: "date", headerName: "Date", width: 150 },
    { field: "time", headerName: "Time", width: 100 },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">Reactions History</div>
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
