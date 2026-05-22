import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { likeMeme, shareMeme } from '../service/memeApi';

export default function MemeCard({ meme, onLike }) {
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
