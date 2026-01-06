import { useEffect, useState } from "react";
import api from "@/api/axios";

const Lessons = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    message: ""
  });

  const [form, setForm] = useState({
    course_id: "",
    title: "",
    videos: [{ video_url: "", position: 1 }]
  });

  /* ================= ALERT ================= */
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: "success", message: "" });
    }, 3000);
  };

  /* ================= LOAD COURSES ================= */
  useEffect(() => {
    api.get("/courses").then(res => {
      setCourses(res.data.data);
    });
  }, []);

  /* ================= LOAD LESSONS ================= */
  const fetchLessons = async (courseId) => {
    if (!courseId) {
      setLessons([]);
      return;
    }

    const res = await api.get("/lessons", {
      params: { course_id: courseId }
    });

    setLessons(res.data.data);
  };

  useEffect(() => {
    fetchLessons(form.course_id);
  }, [form.course_id]);

  /* ================= VIDEO HANDLERS ================= */
  const addVideo = () => {
    setForm({
      ...form,
      videos: [...form.videos, { video_url: "", position: form.videos.length + 1 }]
    });
  };

  const removeVideo = (i) => {
    const updated = form.videos.filter((_, idx) => idx !== i);
    setForm({ ...form, videos: updated });
  };

  const updateVideo = (i, value) => {
    const updated = [...form.videos];
    updated[i].video_url = value;
    setForm({ ...form, videos: updated });
  };

  /* ================= EDIT ================= */
  const openEdit = (lesson) => {
    setEditingId(lesson.id);
    setForm({
      course_id: lesson.course_id,
      title: lesson.title,
      videos: lesson.contents.map((c, i) => ({
        video_url: c.video_url,
        position: i + 1
      }))
    });
  };

  /* ================= DELETE ================= */
  const removeLesson = async (id) => {
    if (!confirm("Delete this lesson?")) return;

    await api.delete(`/lessons/${id}`);
    fetchLessons(form.course_id);
    showAlert("Lesson deleted successfully");
  };

  /* ================= SUBMIT ================= */
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        course_id: Number(form.course_id),
        title: form.title,
        contents: form.videos.map((v, i) => ({
          content_type: "video",
          video_url: v.video_url,
          position: i + 1
        }))
      };

      if (editingId) {
        await api.put(`/lessons/${editingId}`, payload);
        showAlert("Lesson updated successfully");
      } else {
        await api.post("/lessons", payload);
        showAlert("Lesson created successfully");
      }

      setEditingId(null);
      setForm({
        ...form,
        title: "",
        videos: [{ video_url: "", position: 1 }]
      });

      fetchLessons(form.course_id);

    } catch (err) {
      showAlert(
        err.response?.data?.message || "Validation error",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xxl">
      <h4 className="mb-3">Lesson Management</h4>

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

      {/* FORM */}
      <form className="card p-4 mb-4" onSubmit={submit}>
        <select
          className="form-select mb-3"
          value={form.course_id}
          onChange={e => setForm({ ...form, course_id: e.target.value })}
          required
        >
          <option value="">Select Course</option>
          {courses.map(c => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>

        <input
          className="form-control mb-3"
          placeholder="Lesson title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />

        <h6>Lesson Videos</h6>

        {form.videos.map((v, i) => (
          <div key={i} className="d-flex gap-2 mb-2">
            <input
              className="form-control"
              placeholder="YouTube / Vimeo URL"
              value={v.video_url}
              onChange={e => updateVideo(i, e.target.value)}
              required
            />
            {form.videos.length > 1 && (
              <button type="button" className="btn btn-danger"
                onClick={() => removeVideo(i)}>✕</button>
            )}
          </div>
        ))}

        <button type="button" className="btn btn-outline-primary mb-3" onClick={addVideo}>
          + Add Video
        </button>

        <button className="btn btn-success" disabled={loading}>
          {loading ? "Saving..." : editingId ? "Update Lesson" : "Save Lesson"}
        </button>
      </form>

      {/* LIST */}
      {form.course_id && (
        <div className="card p-3">
          <h5>Lesson List</h5>

          {lessons.length === 0 ? (
            <p className="text-muted">No lessons</p>
          ) : (
            lessons.map((l, i) => (
              <div key={l.id} className="border rounded p-2 mb-2">
                <div className="d-flex justify-content-between">
                  <b>{i + 1}. {l.title}</b>
                  <div>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => openEdit(l)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeLesson(l.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <ul className="mt-2 mb-0">
                  {l.contents.map((c, idx) => (
                    <li key={idx}>🎬 Video {idx + 1}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Lessons;
