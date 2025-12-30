const Footer = () => {
  return (
    <footer className="footer text-center text-sm-start d-print-none">
      <div className="container-xxl">
        <div className="row">
          <div className="col-12">
            <div className="card mb-0 rounded-bottom-0">
              <div className="card-body">
                <p className="text-muted mb-0">
                  © {new Date().getFullYear()} Rizz
                  <span className="text-muted d-none d-sm-inline-block float-end">
                    Crafted with <i className="iconoir-heart text-danger"></i> by
                    Mannatthemes
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
