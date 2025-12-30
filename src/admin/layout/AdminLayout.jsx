import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      <Topbar />
      <Sidebar />

      {/* 🔴 REQUIRED BY RIZZ CSS */}
      <div className="page-wrapper">
        <div className="page-content">
          <div className="container-xxl">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
