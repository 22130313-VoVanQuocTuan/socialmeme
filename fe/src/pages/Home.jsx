// src/pages/Home.jsx
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { TrendingUp, Clock } from 'lucide-react';
import { getLatestFeed, getTrendingFeed } from '../service/feedApi';
import MemeCard from '../components/MemeCard';

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
    const [trending, latest] = await Promise.all([
      getTrendingFeed(10),
      getLatestFeed(10),
    ]);
    setTrendingMemes(trending.memes || []);
    setLatestMemes(latest.memes || []);
    setLoading(false);
  };

  const displayMemes = activeTab === 'trending' ? trendingMemes : latestMemes;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-red-600">
            SocialMeme
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              to="/create"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              + Tạo meme
            </Link>
            {user && (
              <Link
                to="/recommended"
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              >
                Gợi ý Meme dành cho bạn!
              </Link>
            )}
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700">{user.username}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('user');
                  window.location.reload();
                }}
                className="text-gray-500 hover:text-red-600"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-red-600">
              Đăng nhập
            </Link>
          )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab('trending')}
            className={`pb-2 px-4 flex items-center gap-2 ${
              activeTab === 'trending'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-500'
            }`}
          >
            <TrendingUp size={18} />
            Thịnh hành
          </button>
          <button
            onClick={() => setActiveTab('latest')}
            className={`pb-2 px-4 flex items-center gap-2 ${
              activeTab === 'latest'
                ? 'border-b-2 border-red-600 text-red-600'
                : 'text-gray-500'
            }`}
          >
            <Clock size={18} />
            Mới nhất
          </button>
        </div>

        {/* Meme Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : displayMemes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Chưa có meme nào. Hãy là người đầu tiên tạo meme!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayMemes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} onLike={fetchFeeds} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}