import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permission";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="startbar d-print-none">

        {/* Brand */}
        <div className="brand">
          <Link to="/admin/dashboard" className="logo">
            <span>
              <img
                src="/admin-assets/assets/images/logo-sm.png"
                alt="logo-sm"
                className="logo-sm"
              />
            </span>
            <span>
              <img
                src="/admin-assets/assets/images/logo-dark.png"
                alt="logo-lg"
                className="logo-lg logo-dark"
              />
            </span>
          </Link>
        </div>

        {/* Menu */}
        <div className="startbar-menu">
          <div className="startbar-inner" data-simplebar>
            <ul className="navbar-nav mb-auto w-100">

              {/* Main Menu */}
              <li className="menu-label pt-0 mt-0">
                <span>Main Menu</span>
              </li>

              {/* Dashboard */}
              <li className="nav-item">
                <Link to="/admin/dashboard" className="nav-link">
                  <i className="iconoir-home-simple menu-icon"></i>
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* Courses */}
              {hasPermission(user, "manage_courses") && (
                <li className="nav-item">
                  <Link to="/admin/courses" className="nav-link">
                    <i className="iconoir-book menu-icon"></i>
                    <span>Courses</span>
                  </Link>
                </li>
              )}

              {/* Users */}
              {hasPermission(user, "manage_roles") && (
                <li className="nav-item">
                  <Link to="/admin/users" className="nav-link">
                    <i className="iconoir-user menu-icon"></i>
                    <span>Users</span>
                  </Link>
                </li>
              )}

              {/* SETTINGS (ROLE & PERMISSION) */}
              {hasPermission(user, "manage_roles") && (
                <>
                  <li className="menu-label mt-2">
                    <span>Settings</span>
                  </li>

                  <li className="nav-item">
                    <Link to="/admin/settings/roles" className="nav-link">
                      <i className="iconoir-shield menu-icon"></i>
                      <span>Roles</span>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/admin/settings/permissions" className="nav-link">
                      <i className="iconoir-lock menu-icon"></i>
                      <span>Permissions</span>
                    </Link>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div className="startbar-overlay d-print-none"></div>
    </>
  );
};

export default Sidebar;
