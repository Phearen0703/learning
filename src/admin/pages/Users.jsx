import { useEffect, useState } from "react";
import api from "@/api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_ids: [],
    is_active: true,
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  /* ================= FETCH ================= */

  const fetchUsers = async () => {
    const res = await api.get("/users");
    setUsers(res.data.data);
  };

  const fetchRoles = async () => {
    const res = await api.get("/roles");
    setRoles(res.data.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  /* ================= ALERT ================= */

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "success", message: "" });
    }, 3000);
  };

  /* ================= RESET FORM ================= */

  const resetForm = () => {
    setEditingId(null);
    setForm({
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role_ids: [],
      is_active: true,
    });
    setAvatar(null);
    setAvatarPreview(null);
  };

  /* ================= MODAL ================= */

  const openCreate = () => {
    resetForm();
    new window.bootstrap.Modal("#userModal").show();
  };

  const openEdit = (user) => {
    setEditingId(user.id);
    setForm({
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: "",
      role_ids: user.roles.map((r) => r.id),
      is_active: Boolean(user.is_active),
    });

    setAvatar(null);
    setAvatarPreview(
      user.avatar
        ? `${import.meta.env.VITE_API_URL}/storage/${user.avatar}`
        : null
    );

    new window.bootstrap.Modal("#userModal").show();
  };

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("username", form.username);
      formData.append("first_name", form.first_name);
      formData.append("last_name", form.last_name);
      formData.append("email", form.email);
      formData.append("is_active", form.is_active ? 1 : 0);

      if (!editingId) {
        formData.append("password", form.password);
      }

      form.role_ids.forEach((id) => {
        formData.append("role_ids[]", id);
      });

      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      }

      if (editingId) {
        formData.append("_method", "PUT");
        await api.post(`/users/${editingId}`, formData);
        showAlert("User updated successfully");
      } else {
        await api.post("/users", formData);
        showAlert("User created successfully");
      }

      fetchUsers();
      resetForm();
      window.bootstrap.Modal.getInstance(
        document.getElementById("userModal")
      ).hide();

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})
          .flat()
          .join(", ");
      showAlert(msg || "Failed to save user", "danger");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
    showAlert("User deleted");
  };

  /* ================= UI ================= */

  return (
    <div className="container-xxl">

      {/* ALERT */}
      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`}>
          {alert.message}
          <button
            className="btn-close"
            onClick={() => setAlert({ ...alert, show: false })}
          />
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>User Management</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Create User
        </button>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Avatar</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th width="160">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>
                    <img
                      src={
                        u.avatar
                          ? `${import.meta.env.VITE_API_URL}/storage/${u.avatar}`
                          : "/admin-assets/assets/images/users/avatar-1.jpg"
                      }
                      width="36"
                      height="36"
                      className="rounded-circle"
                    />
                  </td>
                  <td>{u.username}</td>
                  <td>{u.first_name} {u.last_name}</td>
                  <td>{u.email}</td>
                  <td>{u.roles?.map(r => r.name).join(", ")}</td>
                  <td>
                    {u.is_active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-secondary">Inactive</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="userModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <form className="modal-content" onSubmit={submit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editingId ? "Edit User" : "Create User"}
              </h5>
              <button type="button" className="btn-close"
                onClick={() => {
                  resetForm();
                  window.bootstrap.Modal.getInstance(
                    document.getElementById("userModal")
                  ).hide();
                }}
              />
            </div>

            <div className="modal-body row g-2">

              {/* AVATAR */}
              <div className="col-12 text-center mb-3">
                <img
                  src={avatarPreview || "/admin-assets/assets/images/users/avatar-1.jpg"}
                  width="80"
                  height="80"
                  className="rounded-circle mb-2"
                />
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setAvatar(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              <div className="col-md-6">
                <input className="form-control" placeholder="Username"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  required />
              </div>

              <div className="col-md-6">
                <input className="form-control" placeholder="Email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required />
              </div>

              <div className="col-md-6">
                <input className="form-control" placeholder="First name"
                  value={form.first_name}
                  onChange={e => setForm({ ...form, first_name: e.target.value })}
                  required />
              </div>

              <div className="col-md-6">
                <input className="form-control" placeholder="Last name"
                  value={form.last_name}
                  onChange={e => setForm({ ...form, last_name: e.target.value })}
                  required />
              </div>

              {!editingId && (
                <div className="col-md-6">
                  <input type="password" className="form-control"
                    placeholder="Password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required />
                </div>
              )}

              <div className="col-md-6">
                <select className="form-select"
                  value={form.role_ids[0] || ""}
                  onChange={e => setForm({ ...form, role_ids: [Number(e.target.value)] })}
                  required>
                  <option value="">Select Role</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  />
                  <label className="form-check-label">Active</label>
                </div>
              </div>

            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  resetForm();
                  window.bootstrap.Modal.getInstance(
                    document.getElementById("userModal")
                  ).hide();
                }}
              >
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

export default Users;
