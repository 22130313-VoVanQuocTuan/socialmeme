// src/pages/Home.jsx
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Heart, Share2, Eye, TrendingUp, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getLatestFeed, getTrendingFeed } from '../service/feedApi';
import { likeMeme, shareMeme } from '../service/memeApi';

function MemeCard({ meme, onLike }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(meme.like_count);

  const handleLike = async () => {
    const result = await likeMeme(meme.id);
    setLiked(result.liked);
    setLikeCount(result.like_count);
    if (onLike) onLike();
  };

  const handleShare = async () => {
    await shareMeme(meme.id, 'copy_link');
    navigator.clipboard.writeText(`${window.location.origin}/meme/${meme.id}`);
    toast.success('Đã sao chép link!');
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <Link to={`/meme/${meme.id}`}>
        <img
          src={`http://localhost:8000${meme.image_url}`}
          alt="meme"
          className="w-full object-cover"
        />
      </Link>
      <div className="p-3">
        <p className="text-gray-800 text-sm line-clamp-2">{meme.caption}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500 transition"
            >
              <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : ''} />
              <span className="text-sm">{likeCount}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-gray-500 hover:text-green-500 transition"
            >
              <Share2 size={18} />
            </button>
            <div className="flex items-center gap-1 text-gray-400">
              <Eye size={16} />
              <span className="text-xs">{meme.view_count}</span>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(meme.created_at).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [trendingMemes, setTrendingMemes] = useState([]);
  const [latestMemes, setLatestMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trending');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchFeeds();
  }, []);

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
            <Link
              to="/create"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              + Tạo meme
            </Link>
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