// src/pages/MemeDetail.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getMeme, likeMeme, shareMeme, deleteMeme } from '../service/memeApi';
import { getComments, createComment, deleteComment } from '../service/commentApi';
import { Heart, Share2, Eye, Trash2, ArrowLeft, User, MessageCircle, Calendar, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTrendingFeed } from '../service/feedApi';
import { trackView } from '../service/viewApi';
import Header from '../components/Header';

export default function MemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [relatedMemes, setRelatedMemes] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      trackView(id, 0);
    }
    fetchMeme();
    fetchComments();
  }, [id, user]);

  const fetchMeme = async () => {
    setLoading(true);
    try {
      const data = await getMeme(id);
      setMeme(data);
      setLiked(!!data.is_liked);
      setLikeCount(data.like_count);
      
      const feed = await getTrendingFeed(6);
      setRelatedMemes(feed.memes?.filter(m => m.id !== parseInt(id)) || []);
    } catch (error) {
      toast.error('Không thể tải meme');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const data = await getComments(id);
      setComments(data);
    } catch (error) {
      console.error('Fetch comments error:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để bình luận');
      navigate('/login');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }

    setCommentLoading(true);
    try {
      const newComment = await createComment(id, commentText.trim());
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      toast.success('Đã thêm bình luận');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Không thể thêm bình luận');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success('Đã xóa bình luận');
    } catch (error) {
      toast.error('Không thể xóa bình luận');
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để like');
      navigate('/login');
      return;
    }
    
    try {
      const result = await likeMeme(id);
      setLiked(result.liked);
      setLikeCount(result.like_count);
    } catch (error) {
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/meme/${id}`;
    await navigator.clipboard.writeText(url);
    toast.success('Đã sao chép link meme vào bộ nhớ tạm!');
    
    if (user) {
      try {
        await shareMeme(id, 'copy_link');
      } catch (error) {
        // Silent fail
      }
    }
  };

  const handleDelete = async () => {
    if (!user || (user.id !== meme?.user_id && user.role !== 'admin')) {
      toast.error('Bạn không có quyền xóa meme này');
      return;
    }
    
    try {
      await deleteMeme(id);
      toast.success('Đã xóa meme thành công');
      navigate('/');
    } catch (error) {
      toast.error('Không thể xóa meme');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Vài phút trước';
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-100 border-t-red-600"></div>
          <p className="text-sm font-medium text-gray-500 animate-pulse">Đang tải meme siêu mượt...</p>
        </div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm max-w-sm border border-gray-100">
          <p className="text-gray-500 font-medium mb-4">Meme này đã bị "bốc hơi" hoặc không tồn tại</p>
          <Link to="/" className="inline-flex justify-center bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-700 transition shadow-sm shadow-red-200">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && (user.id === meme.user_id || user.role === 'admin');

  return (
    <div className="min-h-screen bg-gray-50/70 antialiased text-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 group transition"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại trang trước
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* CỘT TRÁI: Nội dung Meme & Bình luận */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Meme Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Khu vực ảnh (Nền tối để làm nổi bật ảnh meme) */}
              <div className="bg-neutral-950 flex items-center justify-center relative group">
                <img
                  src={`http://localhost:8000${meme.image_url}`}
                  alt={meme.caption || 'Meme'}
                  className="w-full object-contain"
                  style={{ minHeight: '350px', maxHeight: '650px' }}
                />
              </div>
              
              {/* Nội dung chi tiết */}
              <div className="p-6">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug mb-5">
                  {meme.caption}
                </h1>
                
                {/* Thanh Action tương tác */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Nút Like */}
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        liked 
                          ? 'bg-red-50 text-red-600 scale-[1.02]' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Heart size={18} className={liked ? 'fill-red-600 stroke-red-600 animate-bounce' : 'text-gray-500'} />
                      <span>{likeCount} Thích</span>
                    </button>
                    
                    {/* Nút Share */}
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 font-medium text-sm transition"
                    >
                      <Share2 size={18} className="text-gray-500" />
                      <span>Chia sẻ</span>
                    </button>
                    
                    {/* Stats nhanh */}
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400 sm:ml-2">
                      <span className="flex items-center gap-1"><Eye size={15} /> {meme.view_count} xem</span>
                      <span className="flex items-center gap-1"><MessageCircle size={15} /> {comments.length} bình luận</span>
                    </div>
                  </div>
                  
                  {/* Nút xóa nếu là chủ sở hữu */}
                  {isOwner && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-red-600 rounded-lg p-1.5 hover:bg-red-50/50 transition"
                    >
                      <Trash2 size={16} />
                      <span>Xóa bài</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Khối Bình luận */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <MessageCircle className="text-red-500" size={20} />
                  Bình luận ({comments.length})
                </h3>
              </div>

              {/* Ô Nhập bình luận */}
              {user ? (
                <div className="mb-6 space-y-3">
                  <div className="relative">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all resize-none"
                      placeholder="Hãy nói gì đó thật hài hước nào..."
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitComment}
                      disabled={commentLoading}
                      className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition shadow-sm shadow-red-100 disabled:opacity-50"
                    >
                      {commentLoading ? 'Đang gửi...' : <>Gửi ngay <Send size={14} /></>}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 text-center text-sm text-gray-500">
                  Vui lòng <Link to="/login" className="text-red-600 font-semibold hover:underline">Đăng nhập</Link> để tham gia thảo luận mặn mà này.
                </div>
              )}

              {/* Danh sách bình luận */}
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Chưa có bình luận nào. Hãy là người đầu tiên bóc tem!
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {comments.map((comment) => (
                    <div key={comment.id} className="group/item rounded-xl border border-gray-50 bg-gray-50/40 p-4 transition hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-bold text-xs">
                            {comment.username?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-800">{comment.username}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                          </div>
                        </div>
                        {user && comment.user_id === user.id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs font-medium text-gray-400 hover:text-red-600 opacity-0 group-hover/item:opacity-100 transition-all duration-200"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                      <p className="mt-2.5 text-sm text-gray-700 whitespace-pre-wrap pl-9">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: Thông tin Tác giả & Meme liên quan */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Widget: Người tạo */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                <User size={14} /> Tác giả bài viết
              </h3>
              <Link
                to={`/profile/${meme.user_id}`}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition"
              >
                <div className="w-12 h-12 bg-gradient-to-tr from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-sm">
                  {meme.user_username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-base truncate">{meme.user_username || 'Người dùng'}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Calendar size={12} />
                    Từ {meme.user_joined ? new Date(meme.user_joined).toLocaleDateString('vi-VN') : '?'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Widget: Thống kê chi tiết */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-3">Thống kê chỉ số</h3>
              <div className="divide-y divide-gray-50 text-sm">
                <div className="flex justify-between py-2.5">
                  <span className="text-gray-500">Ngày lên sóng</span>
                  <span className="font-medium text-gray-700">{formatDate(meme.created_at)}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-gray-500">Tổng điểm Tim</span>
                  <span className="font-bold text-red-600">{likeCount}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-gray-500">Mắt xem</span>
                  <span className="font-semibold text-gray-700">{meme.view_count}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-gray-500">Chia sẻ</span>
                  <span className="font-medium text-gray-700">{meme.share_count || 0}</span>
                </div>
              </div>
            </div>

            {/* Widget: Có thể bạn cũng thích */}
            {relatedMemes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase mb-4">Gợi ý mặn mòi khác</h3>
                <div className="space-y-3">
                  {relatedMemes.slice(0, 3).map((related) => (
                    <Link
                      key={related.id}
                      to={`/meme/${related.id}`}
                      className="flex gap-3 p-1.5 rounded-xl hover:bg-gray-50 group transition"
                    >
                      <img
                        src={`http://localhost:8000${related.image_url}`}
                        alt=""
                        className="w-16 h-16 object-cover rounded-xl bg-gray-100 group-hover:opacity-90 transition"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-red-600 transition">
                          {related.caption}
                        </p>
                        <div className="flex items-center gap-3 text-xs font-medium text-gray-400 mt-1">
                          <span className="flex items-center gap-1"><Heart size={14} /> {related.like_count}</span>
                          <span className="flex items-center gap-1"><Eye size={14} /> {related.view_count}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal xác nhận xóa bài - Đẹp và mượt hơn */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl border border-gray-100 text-center">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Xóa Meme này?</h3>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa bài viết này không? Hành động này sẽ bay màu vĩnh viễn và không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 transition shadow-sm shadow-red-100"
              >
                Chắc chắn xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}