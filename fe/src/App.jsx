import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthContext, AuthProvider } from "./contexts/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import CreateMeme from "./pages/CreateMeme";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MemeDetail from "./pages/MemeDetail";
import Profile from "./pages/Profile";
import Recommended from "./pages/Recommended";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route
        path="/create"
        element={
          <PrivateRoute>
            <CreateMeme />
          </PrivateRoute>
        }
      />
      <Route
        path="/recommended"
        element={
          <PrivateRoute>
            <Recommended />
          </PrivateRoute>
        }
      />
      <Route path="/meme/:id" element={<MemeDetail />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
