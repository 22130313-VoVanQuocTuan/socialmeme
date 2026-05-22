import { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { getRecommendedFeed } from '../service/feedApi';
import MemeCard from '../components/MemeCard';

export default function Recommended() {
  const [memes, setMemes] = useState([]);
  const [hasBehavior, setHasBehavior] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchRecommended();
  }, [user]);

  const fetchRecommended = async () => {
    setLoading(true);
    try {
      const data = await getRecommendedFeed(10);
      setMemes(data.memes || []);
      setHasBehavior(!!data.has_behavior);
    } catch (error) {
      toast.error('Không thể tải gợi ý AI. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-red-600">Gợi ý Meme dành cho bạn</h1>
        
          </div>
          <Link
            to="/"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : !hasBehavior ? (
          <div className="rounded-2xl bg-white shadow-sm p-8 text-center">
            <TrendingUp size={40} className="mx-auto text-red-600" />
            <h2 className="mt-4 text-xl font-semibold">Chưa đủ dữ liệu để gợi ý</h2>
            <p className="mt-3 text-gray-500">
              Hãy xem hoặc like một vài meme trong feed để hệ thống AI có thể gợi ý đúng hơn cho bạn.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
            >
              Về feed chính
            </Link>
          </div>
        ) : memes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Hiện tại chưa có gợi ý cho bạn. Hãy thử lại sau.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {memes.map((meme) => (
              <MemeCard key={meme.id} meme={meme} onLike={fetchRecommended} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
