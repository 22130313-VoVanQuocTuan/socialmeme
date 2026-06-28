import { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

import Header from '../components/Header';
import { AuthContext } from '../contexts/AuthContext';
import MemeCard from '../components/MemeCard';
import { getRecommendedFeed } from '../service/feedApi';

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
      toast.error('Khong the tai goi y AI. Vui long thu lai sau.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
          </div>
        ) : !hasBehavior ? (
          <div className="rounded-2xl bg-white shadow-sm p-8 text-center">
            <TrendingUp size={40} className="mx-auto text-red-600" />
            <h2 className="mt-4 text-xl font-semibold">Chưa có dữ liệu để gợi ý</h2>
            <p className="mt-3 text-gray-500">
              Hãy xem hoặc like một vài meme để có được gợi ý phù hợp cho bạn.
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
