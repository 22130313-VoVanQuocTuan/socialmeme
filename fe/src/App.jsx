import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateMeme from "./pages/CreateMeme";
import Profile from "./pages/Profile";
import MemeDetail from "./pages/MemeDetail";
import Recommended from "./pages/Recommended";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}
// Chặn người không phải Admin
function AdminRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  // Giả sử context của bạn có lưu role của user
  if (user.role !== "admin") {
    return <Navigate to="/" />; // Đẩy user thường về trang chủ
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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

      {/* Các route dành riêng cho Admin */}
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
