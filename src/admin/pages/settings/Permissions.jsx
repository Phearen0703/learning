import { useEffect, useState } from "react";
import api from "@/api/axios";

const Permissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPermissions = async () => {
    const res = await api.get("/permissions");
    setPermissions(res.data.data);
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  /* OPEN CREATE MODAL */
  const openCreate = () => {
    setEditingId(null);
    setName("");
    const modal = new window.bootstrap.Modal(
      document.getElementById("permissionModal")
    );
    modal.show();
  };

  /* OPEN EDIT MODAL */
  const openEdit = (permission) => {
    setEditingId(permission.id);
    setName(permission.name);
    const modal = new window.bootstrap.Modal(
      document.getElementById("permissionModal")
    );
    modal.show();
  };

  /* SUBMIT */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/permissions/${editingId}`, { name });
      } else {
        await api.post("/permissions", { name });
      }

      fetchPermissions();
      setName("");
      setEditingId(null);

      // close modal
      window.bootstrap.Modal.getInstance(
        document.getElementById("permissionModal")
      ).hide();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to save permission");
    } finally {
      setLoading(false);
    }
  };

  /* DELETE */
  const remove = async (id) => {
    if (!confirm("Delete this permission?")) return;
    await api.delete(`/permissions/${id}`);
    fetchPermissions();
  };

  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Permission Management</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Create Permission
        </button>
      </div>

      {/* LIST */}
      <div className="card">
        <div className="table-responsive">
          <table className="table table-striped mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Permission</th>
                <th width="150">Actions</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((p, i) => (
                <tr key={p.id}>
                  <td>{i + 1}</td>
                  <td>{p.name}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openEdit(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {permissions.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No permissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <div
        className="modal fade"
        id="permissionModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <form className="modal-content" onSubmit={submit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editingId ? "Edit Permission" : "Create Permission"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <label className="form-label">Permission Name</label>
              <input
                className="form-control"
                placeholder="e.g. manage_courses"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel
              </button>
              <button className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  );
};

export default Permissions;
