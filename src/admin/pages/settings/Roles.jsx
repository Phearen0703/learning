import { useEffect, useState } from "react";
import api from "../../../api/axios";
import RoleModal from "./RoleModal";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const fetchData = async () => {
    setLoading(true);

    const rolesRes = await api.get("/roles");
    const permRes = await api.get("/permissions");

    //IMPORTANT
    setRoles(rolesRes.data.data);
    setPermissions(permRes.data.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteRole = async (id) => {
    if (!window.confirm("Delete this role?")) return;
    await api.delete(`/roles/${id}`);
    fetchData();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container-xxl">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Role Management</h3>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingRole(null);
            setShowModal(true);
          }}
        >
          + New Role
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table table-bordered align-middle">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Permissions</th>
                <th width="150">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>
                    {role.permissions.length === 0 && (
                      <span className="text-muted">No permissions</span>
                    )}
                    {role.permissions.map((p) => (
                      <span
                        key={p.id}
                        className="badge bg-secondary me-1 mb-1"
                      >
                        {p.name}
                      </span>
                    ))}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => {
                        setEditingRole(role);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteRole(role.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {roles.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted">
                    No roles found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <RoleModal
          role={editingRole}
          permissions={permissions}
          onClose={() => setShowModal(false)}
          onSaved={fetchData}
        />
      )}
    </div>
  );
};

export default Roles;
