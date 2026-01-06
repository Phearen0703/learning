import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./student/pages/Home";
import Login from "./auth/Login";

import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";

import Courses from "./admin/pages/course/Courses";
import Categories from "./admin/pages/course/Categories";
import SubCategories from "./admin/pages/course/SubCategories";
import Lessons from "./admin/pages/course/Lessons";
import LessonVideos from "./admin/pages/course/LessonVideos";

import Users from "./admin/pages/Users";
import Roles from "./admin/pages/settings/Roles";
import Permissions from "./admin/pages/settings/Permissions";
import Profile from "./admin/pages/Profile";
import Forbidden from "./pages/Forbidden";

import AdminRoute from "./routes/AdminRoute";
import PermissionRoute from "./routes/PermissionRoute";

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* STUDENT */}
        <Route path="/" element={<Home />} />

        {/* AUTH */}
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

          {/* COURSE STRUCTURE */}
          <Route
            path="categories"
            element={
              <PermissionRoute permission="manage_categories">
                <Categories />
              </PermissionRoute>
            }
          />

          <Route
            path="subcategories"
            element={
              <PermissionRoute permission="manage_subcategories">
                <SubCategories />
              </PermissionRoute>
            }
          />

          <Route
            path="courses"
            element={
              <PermissionRoute permission="manage_courses">
                <Courses />
              </PermissionRoute>
            }
          />

          {/*LESSONS PER COURSE */}
          <Route
            path="lessons"
            element={
              <PermissionRoute permission="manage_courses">
                <Lessons />
              </PermissionRoute>
            }
          />

          <Route
            path="lesson-videos"
            element={
              <PermissionRoute permission="manage_courses">
                <LessonVideos />
              </PermissionRoute>
            }
          />



          {/* USER MANAGEMENT */}
          <Route
            path="users"
            element={
              <PermissionRoute permission="manage_roles">
                <Users />
              </PermissionRoute>
            }
          />

          {/* SETTINGS */}
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

          {/* PROFILE */}
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* FORBIDDEN */}
        <Route path="/403" element={<Forbidden />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;
