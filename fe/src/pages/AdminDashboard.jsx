import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import adminApi from '../service/adminApi';
import { Users, LayoutDashboard, LogOut, ArrowLeft, Heart, Image as ImageIcon, ShieldCheck, ChevronRight, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total_users: 0, total_memes: 0, total_likes: 0 });
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        setStats(response.data || response);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Header Sticky (Đồng bộ y hệt trang Quản lý người dùng) */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-6xl">
          <Link to="/admin" className="text-2xl font-bold text-red-600 flex items-center gap-2">
            <LayoutDashboard size={24} /> SocialMeme Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-gray-500 hover:text-red-600 transition flex items-center gap-1 font-medium">
              <ArrowLeft size={18} /> Về trang chủ
            </Link>
            <div className="w-px h-6 bg-gray-200"></div>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 transition flex items-center gap-2 font-medium"
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tổng quan hệ thống</h1>
            <p className="text-gray-500 mt-1">Cập nhật số liệu mới nhất của nền tảng</p>
          </div>
          <div className="p-3 bg-white rounded-full shadow-sm text-red-600 animate-pulse">
            <Activity size={24} />
          </div>
        </div>

        {/* Khối thống kê - Style 2026 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Users */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Người dùng</p>
                <p className="text-4xl font-black text-gray-900">{stats.total_users}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                <Users size={28} />
              </div>
            </div>
          </div>

          {/* Card 2: Memes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Meme đã đăng</p>
                <p className="text-4xl font-black text-gray-900">{stats.total_memes}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
                <ImageIcon size={28} />
              </div>
            </div>
          </div>

          {/* Card 3: Likes */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Lượt tương tác</p>
                <p className="text-4xl font-black text-gray-900">{stats.total_likes}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-inner">
                <Heart size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Khu vực Truy cập nhanh */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-red-600" /> Thao tác quản trị
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Action: Quản lý người dùng */}
            <Link 
              to="/admin/users" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-200 transition-all duration-300 group flex items-start gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                <Users size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">Quản lý Người dùng</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">Theo dõi danh sách, phân quyền và khóa/mở khóa tài khoản thành viên.</p>
              </div>
              <div className="mt-1">
                <ChevronRight className="text-gray-300 group-hover:text-red-500 transition-colors" />
              </div>
            </Link>

            {/* Các thẻ trống chờ tính năng tương lai (Quản lý Meme, Thống kê chi tiết...) */}
            {/* Quick Action: Quản lý Meme */}
            <Link 
              to="/admin/memes" 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group flex items-start gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <ImageIcon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">Quản lý Meme</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">Kiểm duyệt nội dung, khóa hoặc mở khóa các meme vi phạm.</p>
              </div>
              <div className="mt-1">
                <ChevronRight className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
              </div>
            </Link>

            <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 opacity-70 cursor-not-allowed">
              <Activity size={32} className="mb-2 text-gray-300" />
              <p className="text-sm font-medium">Báo cáo doanh thu</p>
              <span className="text-xs mt-1 bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">Sắp ra mắt</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;