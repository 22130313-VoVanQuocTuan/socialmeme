// src/pages/Profile.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Heart, Eye } from 'lucide-react';
import { getUserMemes } from '../service/feedApi';
import NotificationBell from '../components/NotificationBell';

export default function Profile() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const isOwnProfile = user && user.id === parseInt(id);

  useEffect(() => {
    fetchUserMemes();
  }, [id]);

  const fetchUserMemes = async () => {
    setLoading(true);
    try {
      const data = await getUserMemes(id);
      setMemes(data.memes || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="text-2xl font-bold text-red-600">
            SocialMeme
          </Link>
          <div className="flex items-center gap-3">
            <NotificationBell />
            {user && (
              <Link to={`/profile/${user.id}`} className="text-sm text-gray-600 hover:text-red-600">
                {user.username}
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {isOwnProfile ? user?.username?.[0]?.toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {isOwnProfile ? user?.username : `Người dùng #${id}`}
              </h1>
              <p className="text-gray-500">{memes.length} meme đã tạo</p>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Meme đã tạo</h2>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : memes.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center text-gray-500">
            Chưa có meme nào
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {memes.map((meme) => (
              <Link key={meme.id} to={`/meme/${meme.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <img
                  src={`http://localhost:8000${meme.image_url}`}
                  alt="meme"
                  className="w-full h-48 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm text-gray-800 line-clamp-2">{meme.caption}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">❤️ {meme.like_count}</span>
                    <span className="flex items-center gap-1">👁️ {meme.view_count}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
