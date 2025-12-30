import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./student/pages/Home";
import Login from "./auth/Login";

import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Courses from "./admin/pages/Courses";
import Users from "./admin/pages/Users";
import Roles from "./admin/pages/settings/Roles";
import Permissions from "./admin/pages/settings/Permissions";

import AdminRoute from "./routes/AdminRoute";
import PermissionRoute from "./routes/PermissionRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* STUDENT HOME */}
        <Route path="/" element={<Home />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />

          <Route
            path="courses"
            element={
              <PermissionRoute permission="manage_courses">
                <Courses />
              </PermissionRoute>
            }
          />

          <Route
            path="users"
            element={
              <PermissionRoute permission="manage_roles">
                <Users />
              </PermissionRoute>
            }
          />

          <Route
            path="settings/roles"
            element={
              <PermissionRoute permission="manage_roles">
                <Roles />
              </PermissionRoute>
            }
          />

          <Route
            path="settings/permissions"
            element={
              <PermissionRoute permission="manage_roles">
                <Permissions />
              </PermissionRoute>
            }
          />
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;
