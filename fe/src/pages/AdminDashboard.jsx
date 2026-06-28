import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  ChevronRight,
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  Users,
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import adminApi from '../service/adminApi';

const initialStats = {
  total_users: 0,
  total_memes: 0,
  total_likes: 0,
  memes_by_day: [],
  memes_by_month: [],
  memes_by_year: [],
  posting_distribution: {
    day: 0,
    night: 0,
  },
};

const formatLabel = (label, mode) => {
  if (!label) return '';

  if (mode === 'day') {
    const [year, month, day] = label.split('-');
    return `${day}/${month}`;
  }

  if (mode === 'month') {
    const [year, month] = label.split('-');
    return `${month}/${year}`;
  }

  return label;
};

const BarChartCard = ({ title, subtitle, colorClass, data, mode }) => {
  const chartData = data.length > 0 ? data : [{ label: 'N/A', count: 0 }];
  const maxValue = Math.max(...chartData.map((item) => item.count), 1);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
      </div>

      <div className="h-64 flex items-end gap-3">
        {chartData.map((item) => {
          const height = `${Math.max((item.count / maxValue) * 100, item.count > 0 ? 14 : 4)}%`;

          return (
            <div key={`${mode}-${item.label}`} className="flex-1 min-w-0 flex flex-col items-center justify-end gap-3">
              <span className="text-xs font-semibold text-gray-700">{item.count}</span>
              <div className="w-full h-44 bg-gray-100 rounded-2xl flex items-end overflow-hidden">
                <div
                  className={`w-full rounded-2xl ${colorClass} transition-all duration-500`}
                  style={{ height }}
                  title={`${item.label}: ${item.count}`}
                />
              </div>
              <span className="text-xs text-gray-500 font-medium text-center leading-tight break-words">
                {formatLabel(item.label, mode)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DonutChartCard = ({ distribution }) => {
  const dayCount = distribution?.day || 0;
  const nightCount = distribution?.night || 0;
  const total = dayCount + nightCount;
  const dayPercent = total > 0 ? Math.round((dayCount / total) * 100) : 0;
  const nightPercent = total > 0 ? 100 - dayPercent : 0;
  const chartStyle = {
    background: `conic-gradient(#f59e0b 0% ${dayPercent}%, #1f2937 ${dayPercent}% 100%)`,
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Tỷ lệ đăng meme ngày và đêm</h3>
          <p className="text-sm text-gray-500 mt-1">Ban ngày tính từ 06:00 đến 17:59 theo giờ Việt Nam.</p>
        </div>
        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="relative w-52 h-52 rounded-full" style={chartStyle}>
          <div className="absolute inset-6 bg-white rounded-full flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-gray-900">{total}</span>
            <span className="text-sm text-gray-500">meme đã đăng</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-amber-400 text-white flex items-center justify-center">
                <Sun size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ban ngày</p>
                <p className="text-sm text-gray-500">06:00 - 17:59</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900">{dayPercent}%</p>
              <p className="text-sm text-gray-500">{dayCount} bài</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-800 text-white flex items-center justify-center">
                <Moon size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ban đêm</p>
                <p className="text-sm text-gray-500">18:00 - 05:59</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900">{nightPercent}%</p>
              <p className="text-sm text-gray-500">{nightCount} bài</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getDashboardStats();
        setStats({
          ...initialStats,
          ...(response.data || {}),
          posting_distribution: {
            ...initialStats.posting_distribution,
            ...((response.data || {}).posting_distribution || {}),
          },
        });
      } catch (error) {
        console.error('Lỗi tải thống kê:', error);
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

  const dayChartData = stats.memes_by_day.slice(-7);
  const monthChartData = stats.memes_by_month.slice(-6);
  const yearChartData = stats.memes_by_year.slice(-5);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
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
            <p className="text-gray-500 mt-1">Cập nhật số liệu mới nhất của nền tảng.</p>
          </div>
          <div className="p-3 bg-white rounded-full shadow-sm text-red-600 animate-pulse">
            <Activity size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Tổng lượt thích</p>
                <p className="text-4xl font-black text-gray-900">{stats.total_likes}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-inner">
                <Heart size={28} />
              </div>
            </div>
          </div>
        </div>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Thống kê đăng tải meme</h2>
              <p className="text-sm text-gray-500 mt-1">Theo dõi tần suất đăng bài gần đây theo ngày, tháng và năm.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <BarChartCard
              title="Theo ngày"
              subtitle="7 ngày gần nhất có phát sinh bài đăng"
              colorClass="bg-blue-500"
              data={dayChartData}
              mode="day"
            />
            <BarChartCard
              title="Theo tháng"
              subtitle="6 tháng gần nhất có phát sinh bài đăng"
              colorClass="bg-emerald-500"
              data={monthChartData}
              mode="month"
            />
            <BarChartCard
              title="Theo năm"
              subtitle="5 năm gần nhất có phát sinh bài đăng"
              colorClass="bg-rose-500"
              data={yearChartData}
              mode="year"
            />
          </div>
        </section>

        <section className="mb-10">
          <DonutChartCard distribution={stats.posting_distribution} />
        </section>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShieldCheck className="text-red-600" /> Thao tác quản trị
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/admin/users"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-red-200 transition-all duration-300 group flex items-start gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                <Users size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-red-600 transition-colors">Quản lý người dùng</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">Theo dõi danh sách, phân quyền và khóa/mở khóa tài khoản thành viên.</p>
              </div>
              <div className="mt-1">
                <ChevronRight className="text-gray-300 group-hover:text-red-500 transition-colors" />
              </div>
            </Link>

            <Link
              to="/admin/memes"
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 group flex items-start gap-4 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <ImageIcon size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">Quản lý meme</h3>
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