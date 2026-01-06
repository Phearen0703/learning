import { useEffect, useState } from "react";
import api from "@/api/axios";

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    slug: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({ show: false, type: "success", message: "" });

  /* ================= FETCH ================= */

  const fetchSubCategories = async (page = 1) => {
    const res = await api.get(`/subcategories?page=${page}`);
    setSubCategories(res.data.data);
    setPagination(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.data);
  };

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  /* ================= ALERT ================= */

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, message: "" }), 3000);
  };

  /* ================= MODAL ================= */

  const openCreate = () => {
    setEditingId(null);
    setForm({ category_id: "", name: "", slug: "", description: "" });
    new window.bootstrap.Modal("#subCategoryModal").show();
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      category_id: item.category_id,
      name: item.name,
      slug: item.slug,
      description: item.description || "",
    });
    new window.bootstrap.Modal("#subCategoryModal").show();
  };

  const closeModal = () => {
    window.bootstrap.Modal.getInstance(
      document.getElementById("subCategoryModal")
    ).hide();
  };

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await api.put(`/subcategories/${editingId}`, form);
        showAlert("Sub Category updated successfully");
      } else {
        await api.post("/subcategories", form);
        showAlert("Sub Category created successfully");
      }

      fetchSubCategories();
      closeModal();
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Failed to save sub category",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const remove = async (id) => {
    if (!confirm("Delete this sub category?")) return;
    await api.delete(`/subcategories/${id}`);
    fetchSubCategories();
    showAlert("Sub Category deleted");
  };

  /* ================= UI ================= */

  return (
    <div className="container-xxl">

      {alert.show && (
        <div className={`alert alert-${alert.type}`}>{alert.message}</div>
      )}

      <div className="d-flex justify-content-between mb-3">
        <h4>Sub Categories</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Create Sub Category
        </button>
      </div>

      <div className="card">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Slug</th>
              <th width="160">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subCategories.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.category?.name}</td>
                <td>{s.slug}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEdit(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => remove(s.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <nav className="mt-3">
        <ul className="pagination">
          {pagination.links?.map((l, i) => (
            <li
              key={i}
              className={`page-item ${l.active ? "active" : ""} ${!l.url && "disabled"}`}
            >
              <button
                className="page-link"
                onClick={() => l.url && fetchSubCategories(l.page)}
                dangerouslySetInnerHTML={{ __html: l.label }}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* MODAL */}
      <div className="modal fade" id="subCategoryModal">
        <div className="modal-dialog modal-dialog-centered">
          <form className="modal-content" onSubmit={submit}>
            <div className="modal-header">
              <h5>{editingId ? "Edit" : "Create"} Sub Category</h5>
              <button type="button" className="btn-close" onClick={closeModal} />
            </div>

            <div className="modal-body">
              <select
                className="form-select mb-2"
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <input
                className="form-control mb-2"
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                  })
                }
                required
              />

              <input
                className="form-control mb-2"
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
              />

              <textarea
                className="form-control"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>
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

export default SubCategories;
