// src/pages/Home.jsx
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { TrendingUp, Clock, Sparkles } from 'lucide-react';
import { getLatestFeed, getTrendingFeed } from '../service/feedApi';
import MemeCard from '../components/MemeCard';
import Header from '../components/Header';

export default function Home() {
  const [trendingMemes, setTrendingMemes] = useState([]);
  const [latestMemes, setLatestMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchFeeds();
  }, [user]);

  const fetchFeeds = async () => {
    setLoading(true);
    try {
      const [trending, latest] = await Promise.all([
        getTrendingFeed(10),
        getLatestFeed(10),
      ]);
      setTrendingMemes(trending.memes || []);
      setLatestMemes(latest.memes || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách meme:", error);
    } finally {
      setLoading(false);
    }
  };

  const displayMemes = activeTab === 'trending' ? trendingMemes : latestMemes;

  return (
    <div className="min-h-screen bg-gray-50/70 antialiased text-gray-900布">
      <Header />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Nút Gợi ý dành riêng cho Mobile (Hiện ra khi màn hình nhỏ) */}
        {user && (
          <div className="block md:hidden mb-4">
            <Link
              to="/recommended"
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 border border-orange-100 py-2.5 rounded-xl font-semibold text-sm shadow-sm"
            >
              <Sparkles size={15} />
              Xem gợi ý Meme dành riêng cho bạn!
            </Link>
          </div>
        )}

        {/* Bộ lọc Tabs - Thiết kế Hiện đại & Indicator đẹp mắt */}
        <div className="flex gap-2 mb-8 bg-gray-200/50 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('trending')}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all duration-200 ${
              activeTab === 'trending'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <TrendingUp size={16} />
            Thị hành
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`px-5 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all duration-200 ${
              activeTab === 'latest'
                ? 'bg-white text-red-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Clock size={16} />
            Mới nhất
          </button>
        </div>

        {/* Khối Meme Grid hoặc Loading/Empty */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-100 border-t-red-600"></div>
            <p className="text-sm font-medium text-gray-400 animate-pulse">Đang nạp năng lượng meme...</p>
          </div>
        ) : displayMemes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto shadow-sm">
            <p className="text-gray-400 font-medium mb-3">Chưa có chiếc meme nào ở đây cả...</p>
            <Link to="/create" className="text-sm font-bold text-red-600 hover:underline">
              Trở thành người đầu tiên tạo meme ngay!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayMemes.map((meme) => (
              <div key={meme.id} className="transform hover:-translate-y-1 transition-all duration-300">
                <MemeCard meme={meme} onLike={fetchFeeds} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}