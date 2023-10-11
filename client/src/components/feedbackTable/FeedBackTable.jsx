import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

const FeedBackTable = ({ advertisementId }) => {
  const [data, setData] = useState([]);
  const [advertisement, setAdvertisement] = useState(null);
  console.log(advertisementId);


  useEffect(() => {
    const fetchFeedbackDetails = async () => {
      try {
        const response = await axios.get( `http://localhost:8800/api/emotions/${advertisementId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching feedback details", error);
      }
    };

    fetchFeedbackDetails();
  }, [advertisementId]);
console.log(data)


const formattedData = data.map((item, index) => {
  const createdAt = new Date(item.scheduleDateTime);
  const date = format(createdAt, "yyyy-MM-dd");
  const time = format(createdAt, "HH:mm:ss");

  return {
    id: index + 1,
    // title:item.
  
    anger: item.emotion_counts.anger,
    contempt: item.emotion_counts.contempt,
    disgust: item.emotion_counts.disgust,
    fear: item.emotion_counts.fear,
    happy: item.emotion_counts.happy,
    neutral: item.emotion_counts.neutral,
    surprise: item.emotion_counts.surprise,
    date,
    time,
  };
});

  const userColumns = [
    { field: "id", headerName: "ID", width: 50 },
    // { field: "title", headerName: "Title", width: 50 },
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
      <div className="datatableTitle">Feedbacks Details</div>
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

export default FeedBackTable;
