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

        {/* BRAND */}
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

        {/* MENU */}
        <div className="startbar-menu">
          <div className="startbar-inner" data-simplebar>
            <ul className="navbar-nav mb-auto w-100">

              {/* MAIN */}
              <li className="menu-label pt-0 mt-0">
                <span>Main Menu</span>
              </li>

              {/* DASHBOARD */}
              <li className="nav-item">
                <NavLink to="/admin/dashboard" className={navClass}>
                  <i className="iconoir-home-simple menu-icon"></i>
                  <span>Dashboard</span>
                </NavLink>
              </li>

              {/* COURSE MANAGEMENT */}
              {(hasPermission(user, "manage_courses") ||
                hasPermission(user, "manage_categories") ||
                hasPermission(user, "manage_subcategories")) && (
                <>
                  <li className="menu-label mt-2">
                    <span>Course Management</span>
                  </li>

                  {/* CATEGORIES */}
                  {hasPermission(user, "manage_categories") && (
                    <li className="nav-item">
                      <NavLink to="/admin/categories" className={navClass}>
                        <i className="iconoir-folder menu-icon"></i>
                        <span>Categories</span>
                      </NavLink>
                    </li>
                  )}

                  {/* SUB CATEGORIES */}
                  {hasPermission(user, "manage_subcategories") && (
                    <li className="nav-item">
                      <NavLink to="/admin/subcategories" className={navClass}>
                        <i className="iconoir-folder-minus menu-icon"></i>
                        <span>Sub Categories</span>
                      </NavLink>
                    </li>
                  )}

                  {/* COURSES (ENTRY POINT) */}
                  {hasPermission(user, "manage_courses") && (
                    <li className="nav-item">
                      <NavLink to="/admin/courses" className={navClass}>
                        <i className="iconoir-book menu-icon"></i>
                        <span>Courses</span>
                      </NavLink>
                    </li>
                  )}

                  {/* LESSONS */}
                  <li className="nav-item">
                    <NavLink to="/admin/lessons" className={navClass}>
                      <i className="iconoir-list menu-icon"></i>
                      <span>Lessons</span>
                    </NavLink>
                  </li>

                  {/* LESSON VIDEOS */}
                  <li className="nav-item">
                    <NavLink to="/admin/lesson-videos" className={navClass}>
                      <i className="iconoir-play-circle menu-icon"></i>
                      <span>Lesson Videos</span>
                    </NavLink>
                  </li>

                </>
              )}

              {/* SETTINGS */}
              {hasPermission(user, "manage_roles") && (
                <>
                  <li className="menu-label mt-2">
                    <span>Settings</span>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/admin/users" className={navClass}>
                      <i className="iconoir-user menu-icon"></i>
                      <span>Users</span>
                    </NavLink>
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
