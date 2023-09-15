import React from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Datatable from "../../components/datatable/Datatable";
import RequestTable from "../../components/requestsTable/RequestTable";

export default function Requests() {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <RequestTable />
      </div>
    </div>
  );
}
