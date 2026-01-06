import { useEffect, useState } from "react";
import api from "@/api/axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    links: [],
    total: 0,
  });

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  /* ================= FETCH ================= */

  const fetchCategories = async (page = 1) => {
    try {
      const res = await api.get(`/categories?page=${page}`);

      setCategories(res.data.data);
      setPagination({
        current_page: res.data.current_page,
        last_page: res.data.last_page,
        links: res.data.links,
        total: res.data.total,
      });
    } catch (err) {
      showAlert("Failed to load categories", "danger");
    }
  };

  useEffect(() => {
    fetchCategories(1);
  }, []);

  /* ================= ALERT ================= */

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "success", message: "" });
    }, 3000);
  };

  /* ================= HELPERS ================= */

  const resetForm = () => {
    setEditingId(null);
    setForm({
      name: "",
      slug: "",
      description: "",
    });
  };

  /* ================= MODAL ================= */

  const openCreate = () => {
    resetForm();
    new window.bootstrap.Modal("#categoryModal").show();
  };

  const openEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
    });
    new window.bootstrap.Modal("#categoryModal").show();
  };

  const closeModal = () => {
    resetForm();
    window.bootstrap.Modal.getInstance(
      document.getElementById("categoryModal")
    ).hide();
  };

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        showAlert("Category updated successfully");
      } else {
        await api.post("/categories", form);
        showAlert("Category created successfully");
      }

      fetchCategories(pagination.current_page);
      closeModal();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {})
          .flat()
          .join(", ");
      showAlert(msg || "Failed to save category", "danger");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await api.delete(`/categories/${id}`);
      fetchCategories(pagination.current_page);
      showAlert("Category deleted");
    } catch {
      showAlert("Failed to delete category", "danger");
    }
  };

  /* ================= PAGINATION ================= */

  const changePage = (page) => {
    if (!page || page === pagination.current_page) return;
    fetchCategories(page);
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

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Categories Management</h4>
        <div className="text-muted">Total: {pagination.total}</div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Create Category
        </button>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Description</th>
                <th width="160">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c, i) => (
                <tr key={c.id}>
                  <td>
                    {(pagination.current_page - 1) * 10 + i + 1}
                  </td>
                  <td>{c.name}</td>
                  <td>
                    <span className="badge bg-light text-dark">
                      {c.slug}
                    </span>
                  </td>
                  <td>{c.description || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openEdit(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => remove(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {pagination.last_page > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-end">
            {pagination.links.map((link, index) => (
              <li
                key={index}
                className={`page-item ${
                  link.active ? "active" : ""
                } ${!link.url ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  onClick={() => changePage(link.page)}
                />
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* MODAL */}
      <div className="modal fade" id="categoryModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <form className="modal-content" onSubmit={submit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editingId ? "Edit Category" : "Create Category"}
              </h5>
              <button type="button" className="btn-close" onClick={closeModal} />
            </div>

            <div className="modal-body row g-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/\s+/g, "-"),
                    })
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Slug</label>
                <input
                  className="form-control"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
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

export default Categories;
