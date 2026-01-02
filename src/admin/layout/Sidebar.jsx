import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permission";

const Sidebar = () => {
  const { user } = useAuth();

  const navClass = ({ isActive }) =>
    "nav-link " + (isActive ? "active" : "");

  return (
    <>
      <div className="startbar d-print-none">

        {/* Brand */}
        <div className="brand">
          <NavLink to="/admin/dashboard" className="logo">
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
          </NavLink>
        </div>

        {/* Menu */}
        <div className="startbar-menu">
          <div className="startbar-inner" data-simplebar>
            <ul className="navbar-nav mb-auto w-100">

              <li className="menu-label pt-0 mt-0">
                <span>Main Menu</span>
              </li>

              {/* Dashboard */}
              <li className="nav-item">
                <NavLink to="/admin/dashboard" className={navClass}>
                  <i className="iconoir-home-simple menu-icon"></i>
                  <span>Dashboard</span>
                </NavLink>
              </li>

              {/* Courses */}
              {hasPermission(user, "manage_courses") && (
                <li className="nav-item">
                  <NavLink to="/admin/courses" className={navClass}>
                    <i className="iconoir-book menu-icon"></i>
                    <span>Courses</span>
                  </NavLink>
                </li>
              )}

              {/* Users */}
              {hasPermission(user, "manage_roles") && (
                <li className="nav-item">
                  <NavLink to="/admin/users" className={navClass}>
                    <i className="iconoir-user menu-icon"></i>
                    <span>Users</span>
                  </NavLink>
                </li>
              )}

              {/* Settings */}
              {hasPermission(user, "manage_roles") && (
                <>
                  <li className="menu-label mt-2">
                    <span>Settings</span>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/admin/settings/roles" className={navClass}>
                      <i className="iconoir-shield menu-icon"></i>
                      <span>Roles</span>
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/admin/settings/permissions" className={navClass}>
                      <i className="iconoir-lock menu-icon"></i>
                      <span>Permissions</span>
                    </NavLink>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </div>

      <div className="startbar-overlay d-print-none"></div>
    </>
  );
};

export default Sidebar;
