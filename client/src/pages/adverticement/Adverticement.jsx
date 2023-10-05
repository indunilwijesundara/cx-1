import "./adverticement.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Adverticement = () => {
  const { adverticementId } = useParams();
  const [advertisement, setAdvertisement] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // Fetch advertisement details using the ID
    const fetchAdvertisementDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/adverticements/${adverticementId}`
        );
        setAdvertisement(response.data);
        setLoading(false); // Data has been fetched, so set loading to false
      } catch (error) {
        console.error("Error fetching advertisement details", error);
      }
    };
     // Fetch advertisement details using the ID
    const fetchFeedbackDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/feedbacks/adverticement/${adverticementId}`
        );
        setFeedback(response.data);
        console.log(response.data)
        setLoading(false); // Data has been fetched, so set loading to false
      } catch (error) {
        console.error("Error fetching advertisement details", error);
      }
    };

    fetchAdvertisementDetails();
    fetchFeedbackDetails()
  }, [adverticementId]);


  // Add conditional rendering for when data is loading or not available
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!advertisement) {
    return <div>No advertisement data found.</div>;
  }

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <ReactPlayer
              height={300}
              width={400}
              url={advertisement.video} // Use the video URL from the advertisement data
              controls={true}
            />
          </div>
          <div className="right">
            <h3>Adverticement Details</h3>
            <p>{advertisement.title}</p>
           
            <p>{ advertisement.scheduleDate
        ? new Date(advertisement.scheduleDate).toISOString().split("T")[0]
        : ""}</p>
            <p>{advertisement.scheduleTime}</p>
            <p>{advertisement.status}</p>
            <h3 className="t">Feedback</h3>
  <ul>
              {feedback.map((item) => (
                <p key={item._id}>
                  <p>Angry: {item.feedback.Angry}</p>
                  <p>Sad: {item.feedback.Sad}</p>
                  <p>Happy: {item.feedback.Happy}</p>
                </p>
              ))}
            </ul>
          </div>
        </div>
        {/* <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div> */}
      </div>
    </div>
  );
};

export default Adverticement;
