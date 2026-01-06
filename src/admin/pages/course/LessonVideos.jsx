import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/api/axios";

const LessonVideos = () => {
  const { courseId, lessonId } = useParams();

  const [videos, setVideos] = useState([]);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchVideos = async () => {
    const res = await api.get(
      `/courses/${courseId}/lessons/${lessonId}/videos`
    );
    setVideos(res.data.data);
  };

  useEffect(() => {
    fetchVideos();
  }, [lessonId]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post(
        `/courses/${courseId}/lessons/${lessonId}/videos`,
        { video_url: url }
      );
      setUrl("");
      fetchVideos();
    } catch {
      alert("Failed to add video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-xxl">
      <h4 className="mb-3">
        Videos (Course #{courseId} / Lesson #{lessonId})
      </h4>

      {/* CREATE */}
      <form className="card p-3 mb-3" onSubmit={submit}>
        <div className="row g-2">
          <div className="col-md-10">
            <input
              className="form-control"
              placeholder="YouTube / Vimeo URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Saving..." : "Add"}
            </button>
          </div>
        </div>
      </form>

      {/* LIST */}
      <div className="card">
        <table className="table mb-0">
          <thead>
            <tr>
              <th>#</th>
              <th>Video URL</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((v, i) => (
              <tr key={v.id}>
                <td>{i + 1}</td>
                <td>
                  <a href={v.video_url} target="_blank" rel="noreferrer">
                    {v.video_url}
                  </a>
                </td>
              </tr>
            ))}

            {videos.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center text-muted">
                  No videos found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LessonVideos;
