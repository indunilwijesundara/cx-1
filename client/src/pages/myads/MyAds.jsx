import "./myads.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Datatable from "../../components/datatable/Datatable";
import MyAdsTable from "../../components/myadsTable/MyAdsTable";


const MyAds = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        < MyAdsTable/>
      </div>
    </div>
  );
};

export default MyAds;
