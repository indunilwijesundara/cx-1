import "./reactionTable.scss"


import { DataGrid } from "@mui/x-data-grid";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { userColumns, userRows } from "../../userssource";
import axios from "axios";
import ReactPlayer from "react-player";

const ReactionTable = () => {
  const [data, setData] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/feedbacks/");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);
console.log(data)
  const formattedData = data.map((item, index) => {
    return {
      id: item._id, // Manually assign a unique identifier
     advertismentId:item.advertismentId,
     happy:item.feedback.Happy,
     sad:item.feedback.Sad,
     angry:item.feedback.Angry,
     disgust:item.feedback.Disgust,
     fear:item.feedback.Fear,
     neutral:item.feedback.Neutral,
     surprise:item.feedback.Surprise


    };
  });
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
  const userColumns = [
    { field: "id", headerName: "ID", width: 200 },
    { field: "advertismentId", headerName: "AdvertismentId", width: 200 },
    { field: "happy", headerName: "Happy", width: 100 },
    { field: "sad", headerName: "Sad", width: 100 },
    { field: "angry", headerName: "Angry", width: 100 },
    { field: "disgust", headerName: "Disgust", width: 100 },
    { field: "fear", headerName: "Fear", width: 100 },
    { field: "neutral", headerName: "Neutral", width: 100 },
    { field: "surprise", headerName: "Surprise", width: 100 },


  

   
  ];
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
        checkboxSelection
      />
    </div>
  );
};

export default ReactionTable;



