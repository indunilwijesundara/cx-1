import "./adverticementTable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { format, isValid, parseISO } from "date-fns"; // Import isValid and parseISO
import ReactPlayer from "react-player";

const AdverticementTable = () => {
  const [data, setData] = useState([]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let apiUrl = "http://localhost:8800/api/adverticements/";
  if (currentUser.role === "user") {
    // If the user is a regular user, filter advertisements accordingly
    apiUrl = `http://localhost:8800/api/adverticements/user/${currentUser._id}`;
  }

  console.log(apiUrl);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [apiUrl]);

  const formattedData = data.map((item, index) => {
    // Check if the date value is valid before formatting
    // const scheduleDateTime = isValid(parseISO(item.scheduleDateTime))
    //   ? format(parseISO(item.scheduleDateTime), "yyyy-MM-dd HH:mm:ss")
    //   : "Invalid Date";

    return {
      id: item._id, // Manually assign a unique identifier
      title: item.title,
      video: item.video,
      scheduleDate: item.scheduleDate
        ? new Date(item.scheduleDate).toISOString().split("T")[0]
        : "",
      scheduleTime: item.scheduleTime,
      status: item.status,
    };
  });
  const handleDelete = async (advertiseId) => {
    try {
      await axios.delete(
        `http://localhost:8800/api/adverticements/${advertiseId}`
      );
      // After successful deletion, refetch the data
      const response = await axios.get(apiUrl);
      setData(response.data);
    } catch (error) {
      console.error("Error deleting advertisement", error);
    }
  };
  const filteredData =
    currentUser.role === "admin"
      ? formattedData.filter((item) => item.status === true)
      : formattedData;

  const userColumns = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "title", headerName: "Title", width: 100 },
    {
      field: "video",
      headerName: "Video",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <ReactPlayer
              height={30}
              width={40}
              url={params.row.video}
              controls={true}
            />
            {params.row.adDetails}
          </div>
        );
      },
    },
    {
      field: "scheduleDate",
      headerName: "Schedule Date",
      width: 200,
    },
    {
      field: "scheduleTime",
      headerName: "Schedule Time",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 160,
      renderCell: (params) => {
        const statusText = params.row.status ? "Active" : "Pending";
        const statusClassName = params.row.status
          ? "activeStatus"
          : "inactiveStatus";

        return (
          <div className={`cellWithStatus ${statusClassName}`}>
            {statusText}
          </div>
        );
      },
    },

    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/adverticement/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">View</div>
            </Link>
            <Link
              to={`/adverticement/editads/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="editButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Adverticements Details
        <Link to="/adverticement/newads" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default AdverticementTable;
