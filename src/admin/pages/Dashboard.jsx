const Dashboard = () => {
  return (
    <>
      <div className="row mb-4">
        <div className="col">
          <h4 className="page-title">Dashboard</h4>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col">
                  <p className="text-dark mb-0 fw-semibold fs-14">Courses</p>
                  <h3 className="mt-2 mb-0 fw-bold">12</h3>
                </div>
                <div className="col-auto">
                  <div className="thumb-xl bg-light rounded-circle d-flex justify-content-center align-items-center">
                    <i className="iconoir-book h1 mb-0 text-secondary"></i>
                  </div>
                </div>
              </div>
              <p className="mb-0 text-muted mt-3">
                <span className="text-success">+2</span> New courses
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col">
                  <p className="text-dark mb-0 fw-semibold fs-14">Students</p>
                  <h3 className="mt-2 mb-0 fw-bold">320</h3>
                </div>
                <div className="col-auto">
                  <div className="thumb-xl bg-light rounded-circle d-flex justify-content-center align-items-center">
                    <i className="iconoir-user h1 mb-0 text-secondary"></i>
                  </div>
                </div>
              </div>
              <p className="mb-0 text-muted mt-3">
                <span className="text-success">+18</span> This month
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
