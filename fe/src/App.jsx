import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateMeme from './pages/CreateMeme';
import Profile from './pages/Profile';
import MemeDetail from './pages/MemeDetail';

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
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
      <Route path="/meme/:id" element={<MemeDetail />} />
      <Route path="/profile/:id" element={<Profile />} />
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