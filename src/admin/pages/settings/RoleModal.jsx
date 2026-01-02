import { useEffect, useState } from "react";
import api from "../../../api/axios";

const RoleModal = ({ role, permissions, onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setSelected(role.permissions.map(p => p.id));
    } else {
      setName("");
      setSelected([]);
    }
  }, [role]);

  const togglePermission = (id) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let roleId = role?.id;

      /* CREATE ROLE */
      if (!role) {
        const res = await api.post("/roles", { name });
        roleId = res.data.data.id;
      }

      /* UPDATE ROLE NAME */
      if (role && name !== role.name) {
        await api.put(`/roles/${role.id}`, { name });
      }

      /* ASSIGN PERMISSIONS (YOUR API) */
      await api.post(`/roles/${roleId}/assign-permissions`, {
        permission_ids: selected,
      });

      onSaved();
      onClose();
    } catch (err) {
      console.error("Role save error", err);
      alert("Failed to save role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <form onSubmit={submit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {role ? "Edit Role" : "Create Role"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Role Name</label>
                <input
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <label className="form-label">Permissions</label>
              <div className="row">
                {permissions.map((perm) => (
                  <div className="col-md-4" key={perm.id}>
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selected.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                      />
                      <label className="form-check-label">
                        {perm.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleModal;
