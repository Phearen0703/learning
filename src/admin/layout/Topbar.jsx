import { useEffect, useState } from "react";

const Topbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  /* Apply theme */
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* Toggle theme */
  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  };

  /* Toggle sidebar (Rizz way) */
const toggleSidebar = () => {
  document.body.classList.toggle("startbar-collapsed");
};



  return (
    <div className="topbar d-print-none">
      <div className="container-xxl">
        <nav className="topbar-custom d-flex justify-content-between align-items-center">

          {/* LEFT */}
          <ul className="topbar-item list-unstyled d-inline-flex align-items-center mb-0">
            <li>
            <button
            className="nav-link nav-icon"
            type="button"
            onClick={toggleSidebar}
            >
            <i className="iconoir-menu-scale fs-4"></i>
            </button>

            </li>

            <li className="ms-3 d-none d-md-block">
              <h5 className="mb-0 fw-semibold">
                Welcome, {user?.username}
              </h5>
              <small className="text-muted">Admin Dashboard</small>
            </li>
          </ul>

          {/* RIGHT */}
          <ul className="topbar-item list-unstyled d-inline-flex align-items-center mb-0">

            {/* Dark / Light */}
            <li className="topbar-item me-2">
              <button
                className="nav-link nav-icon"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <i className="icofont-moon fs-5"></i>
                ) : (
                  <i className="icofont-sun fs-5"></i>
                )}
              </button>
            </li>

            {/* Profile */}
            <li className="dropdown topbar-item">
              <a
                className="nav-link dropdown-toggle arrow-none nav-icon"
                data-bs-toggle="dropdown"
              >
                <img
                  src={
                    user?.avatar
                      ? `http://localhost:8000/storage/${user.avatar}`
                      : "/admin-assets/assets/images/users/avatar-1.jpg"
                  }
                  alt="user"
                  className="thumb-lg rounded-circle"
                  style={{ objectFit: "cover" }}
                />
              </a>

              <div className="dropdown-menu dropdown-menu-end">
                <div className="dropdown-item-text px-3 py-2">
                  <strong>{user?.username}</strong>
                  <br />
                  <small className="text-muted">
                    {user?.roles?.[0] || "User"}
                  </small>
                </div>

                <div className="dropdown-divider"></div>

                <a className="dropdown-item" href="/admin/profile">
                  <i className="las la-user me-1"></i> Profile
                </a>

                <button
                  className="dropdown-item text-danger"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                >
                  <i className="las la-power-off me-1"></i> Logout
                </button>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Topbar;
