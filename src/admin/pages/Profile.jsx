import { useEffect, useState } from "react";
import api from "@/api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Message box
  const [message, setMessage] = useState(null);

  // Avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Password
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  /* =======================
     Helper: Show Message
  ======================= */
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  /* =======================
     Fetch Profile
  ======================= */
  useEffect(() => {
    api.get("/profile").then((res) => {
      setUser(res.data.data);
      setAvatarPreview(
        res.data.data.avatar
          ? `http://localhost:8000/storage/${res.data.data.avatar}`
          : null
      );
    });
  }, []);

  /* =======================
     Update Profile Info
  ======================= */
  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put("/profile", user);
      setUser(res.data.data);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      showMessage("success", "Profile updated successfully");
    } catch {
      showMessage("danger", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     Change Avatar
  ======================= */
  const changeAvatar = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      showMessage("danger", "Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    setAvatarLoading(true);

    try {
      const res = await api.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = { ...user, avatar: res.data.avatar };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setAvatarPreview(`http://localhost:8000/storage/${res.data.avatar}`);
      setAvatarFile(null);

      showMessage("success", "Profile image updated successfully");
    } catch {
      showMessage("danger", "Avatar upload failed");
    } finally {
      setAvatarLoading(false);
    }
  };

  /* =======================
     Change Password
  ======================= */
  const changePassword = async (e) => {
    e.preventDefault();

    try {
      await api.put("/profile/change-password", password);
      showMessage("success", "Password changed successfully");
      setPassword({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch {
      showMessage("danger", "Password change failed");
    }
  };

  if (!user) return null;

  return (
    <div className="container-xxl">
      <h4 className="mb-4">My Profile</h4>

      {/* ================= MESSAGE BOX ================= */}
      {message && (
        <div
          className={`alert alert-${message.type} alert-dismissible fade show`}
          role="alert"
        >
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage(null)}
          ></button>
        </div>
      )}

      {/* ================= AVATAR ================= */}
      <form onSubmit={changeAvatar} className="card p-4 mb-4">
        <h6 className="mb-3">Profile Image</h6>

        <div className="d-flex align-items-center gap-3">
          <img
            src={
              avatarPreview ||
              "/admin-assets/assets/images/users/avatar-1.jpg"
            }
            className="rounded-circle"
            width={100}
            height={100}
            style={{ objectFit: "cover" }}
          />

          <div>
            <input
              type="file"
              className="form-control mb-2"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
            />

            <button
              className="btn btn-primary btn-sm"
              disabled={avatarLoading}
            >
              {avatarLoading ? "Uploading..." : "Change Image"}
            </button>
          </div>
        </div>
      </form>

      {/* ================= PROFILE INFO ================= */}
      <form onSubmit={updateProfile} className="card p-4 mb-4">
        <h6 className="mb-3">Profile Information</h6>

        <div className="row g-3">
          <div className="col-md-6">
            <input
              className="form-control"
              value={user.username}
              onChange={(e) =>
                setUser({ ...user, username: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              value={user.email}
              onChange={(e) =>
                setUser({ ...user, email: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              value={user.first_name}
              onChange={(e) =>
                setUser({ ...user, first_name: e.target.value })
              }
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control"
              value={user.last_name}
              onChange={(e) =>
                setUser({ ...user, last_name: e.target.value })
              }
            />
          </div>
        </div>

        <button className="btn btn-primary mt-3" disabled={loading}>
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* ================= PASSWORD ================= */}
      <form onSubmit={changePassword} className="card p-4">
        <h6 className="mb-3">Change Password</h6>

        <input
          type="password"
          className="form-control mb-2"
          placeholder="Current password"
          value={password.current_password}
          onChange={(e) =>
            setPassword({
              ...password,
              current_password: e.target.value,
            })
          }
        />

        <input
          type="password"
          className="form-control mb-2"
          placeholder="New password"
          value={password.new_password}
          onChange={(e) =>
            setPassword({
              ...password,
              new_password: e.target.value,
            })
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm new password"
          value={password.new_password_confirmation}
          onChange={(e) =>
            setPassword({
              ...password,
              new_password_confirmation: e.target.value,
            })
          }
        />

        <button className="btn btn-warning">Change Password</button>
      </form>
    </div>
  );
};

export default Profile;
