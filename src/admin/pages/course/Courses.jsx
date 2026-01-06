import { useEffect, useState } from "react";
import api from "@/api/axios";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [pagination, setPagination] = useState({});

  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    subcategory_id: "",
  });

  const [form, setForm] = useState({
    title: "",
    category_id: "",
    subcategory_id: "",
    description: "",
    outcomes: "",
    requirements: "",
    level: "beginner",
    language: "English",
    price: "",
    discount_price: "",
    is_free: false,
    status: "draft",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: "",
  });

  /* ================= ALERT ================= */

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, type, message });
    setTimeout(() => setAlert({ show: false, type: "success", message: "" }), 3000);
  };

  /* ================= FETCH ================= */

  const fetchCourses = async (page = 1) => {
    const res = await api.get("/courses", {
      params: {
        page,
        search: filters.search || undefined,
        category_id: filters.category_id || undefined,
        subcategory_id: filters.subcategory_id || undefined,
      },
    });

    setCourses(res.data.data);
    setPagination(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.data);
  };

  // ✅ FIXED: use subcategories endpoint (NO nested route)
  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    const res = await api.get("/subcategories", {
      params: { category_id: categoryId },
    });

    setSubcategories(res.data.data);
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchSubcategories(filters.category_id);
  }, [filters.category_id]);

  /* ================= GROUP ================= */

  const groupedCourses = courses.reduce((acc, c) => {
    const name = c.category?.name || "Uncategorized";
    if (!acc[name]) acc[name] = [];
    acc[name].push(c);
    return acc;
  }, {});

  /* ================= MODAL ================= */

  const openCreate = () => {
    setEditingId(null);
    setForm({
      title: "",
      category_id: "",
      subcategory_id: "",
      description: "",
      outcomes: "",
      requirements: "",
      level: "beginner",
      language: "English",
      price: "",
      discount_price: "",
      is_free: false,
      status: "draft",
    });
    setSubcategories([]);
    new window.bootstrap.Modal("#courseModal").show();
  };

  const openEdit = async (course) => {
    setEditingId(course.id);
    await fetchSubcategories(course.category_id);

    setForm({
      title: course.title,
      category_id: course.category_id,
      subcategory_id: course.subcategory_id || "",
      description: course.description || "",
      outcomes: course.outcomes || "",
      requirements: course.requirements || "",
      level: course.level,
      language: course.language,
      price: course.price,
      discount_price: course.discount_price || "",
      is_free: Boolean(course.is_free),
      status: course.status,
    });

    new window.bootstrap.Modal("#courseModal").show();
  };

  const closeModal = () => {
    window.bootstrap.Modal.getInstance(
      document.getElementById("courseModal")
    ).hide();
  };

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        subcategory_id: form.subcategory_id ? Number(form.subcategory_id) : null,
        price: form.is_free ? 0 : Number(form.price || 0),
        discount_price: form.discount_price ? Number(form.discount_price) : null,
        is_free: form.is_free ? 1 : 0,
      };

      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        showAlert("Course updated successfully");
      } else {
        await api.post("/courses", payload);
        showAlert("Course created successfully");
      }

      fetchCourses(1);
      closeModal();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        Object.values(err.response?.data?.errors || {}).flat().join(", ");
      showAlert(msg || "Failed to save course", "danger");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */

  const remove = async (id) => {
    if (!confirm("Delete this course?")) return;
    await api.delete(`/courses/${id}`);
    fetchCourses();
    showAlert("Course deleted");
  };

  /* ================= UI ================= */

  return (
    <div className="container-xxl">

      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible fade show`}>
          {alert.message}
          <button className="btn-close" onClick={() => setAlert({ ...alert, show: false })} />
        </div>
      )}

      <div className="d-flex justify-content-between mb-3">
        <h4>Courses Management</h4>
        <button className="btn btn-primary" onClick={openCreate}>
          + Create Course
        </button>
      </div>

      {/* FILTER */}
      <div className="card p-3 mb-3">
        <div className="row g-2">
          <div className="col-md-4">
            <input
              className="form-control"
              placeholder="Search course..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.category_id}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category_id: e.target.value,
                  subcategory_id: "",
                })
              }
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <select
              className="form-select"
              value={filters.subcategory_id}
              onChange={(e) =>
                setFilters({ ...filters, subcategory_id: e.target.value })
              }
              disabled={!filters.category_id}
            >
              <option value="">All Subcategories</option>
              {subcategories.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <button className="btn btn-secondary w-100" onClick={() => fetchCourses(1)}>
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* GROUPED TABLE */}
      {Object.keys(groupedCourses).map((category) => (
        <div key={category} className="mb-4">
          <h5 className="mb-2">{category}</h5>
          <div className="card">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subcategory</th>
                  <th>Level</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th width="140">Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedCourses[category].map((c) => (
                  <tr key={c.id}>
                    <td>{c.title}</td>
                    <td>{c.subcategory?.name || "-"}</td>
                    <td>{c.level}</td>
                    <td>{c.is_free ? "Free" : `$${c.price}`}</td>
                    <td>
                      <span className="badge bg-success">{c.status}</span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => openEdit(c)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => remove(c.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* PAGINATION */}
      <ul className="pagination">
        {pagination.links?.map((l, i) => (
          <li key={i} className={`page-item ${l.active ? "active" : ""} ${!l.url && "disabled"}`}>
            <button
              className="page-link"
              onClick={() => l.url && fetchCourses(l.page)}
              dangerouslySetInnerHTML={{ __html: l.label }}
            />
          </li>
        ))}
      </ul>

      {/* MODAL */}
      <div className="modal fade" id="courseModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <form className="modal-content" onSubmit={submit}>
            <div className="modal-header">
              <h5>{editingId ? "Edit Course" : "Create Course"}</h5>
              <button type="button" className="btn-close" onClick={closeModal} />
            </div>

            <div className="modal-body row g-3">
              <div className="col-md-6">
                <input className="form-control" placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required />
              </div>

              <div className="col-md-6">
                <select className="form-select" value={form.category_id}
                  onChange={(e) => {
                    setForm({ ...form, category_id: e.target.value, subcategory_id: "" });
                    fetchSubcategories(e.target.value);
                  }} required>
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <select className="form-select" value={form.subcategory_id}
                  onChange={(e) => setForm({ ...form, subcategory_id: e.target.value })}>
                  <option value="">Select Subcategory</option>
                  {subcategories.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <select className="form-select" value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="col-md-12">
                <textarea className="form-control" rows="2" placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>

              <div className="col-md-3">
                <input type="number" className="form-control" placeholder="Price"
                  value={form.price}
                  disabled={form.is_free}
                  onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>

              <div className="col-md-3 d-flex align-items-center">
                <input type="checkbox" className="form-check-input me-2"
                  checked={form.is_free}
                  onChange={(e) => setForm({ ...form, is_free: e.target.checked })} />
                Free
              </div>

              <div className="col-md-6">
                <select className="form-select" value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
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

export default Courses;
