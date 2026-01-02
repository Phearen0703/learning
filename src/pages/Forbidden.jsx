import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">403</h1>
        <h4 className="mb-3">Access Denied</h4>
        <p className="text-muted mb-4">
          You do not have permission to access this page.
        </p>

        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/dashboard")}
          >
            Dashboard
          </button>

          <button
            className="btn btn-outline-danger"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
