// src/pages/MemeDetail.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getMeme, likeMeme, shareMeme, deleteMeme } from '../service/memeApi';
import { getComments, createComment, deleteComment } from '../service/commentApi';
import { Heart, Share2, Eye, Trash2, ArrowLeft, User, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getTrendingFeed } from '../service/feedApi';
import { trackView } from '../service/viewApi';

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
    // Gọi API track_view (chỉ khi có user đăng nhập)
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
      setLikeCount(data.like_count);
      
      // Lấy meme liên quan (cùng người tạo hoặc trending)
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
      toast.error('Không thể thêm bình luận');
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
    toast.success('Đã sao chép link meme!');
    
    // Ghi nhận share (nếu đã đăng nhập)
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
      toast.success('Đã xóa meme');
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
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!meme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Không tìm thấy meme</p>
          <Link to="/" className="text-red-600 hover:underline">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && (user.id === meme.user_id || user.role === 'admin');

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
                <Link to={`/profile/${user.id}`} className="text-gray-700 hover:text-red-600">
                  {user.username}
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.location.href = '/';
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

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-4 transition"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main meme content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={`http://localhost:8000${meme.image_url}`}
                alt="meme"
                className="w-full object-contain bg-gray-900"
                style={{ minHeight: '400px', maxHeight: '600px' }}
              />
              
              <div className="p-5">
                <p className="text-xl font-medium text-gray-800 mb-4">
                  {meme.caption}
                </p>
                
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        liked 
                          ? 'bg-red-50 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Heart size={20} className={liked ? 'fill-red-600' : ''} />
                      <span className="font-medium">{likeCount}</span>
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    >
                      <Share2 size={20} />
                      <span>Chia sẻ</span>
                    </button>
                    
                    <div className="flex items-center gap-4 text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye size={18} />
                        <span>{meme.view_count} lượt xem</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={18} />
                        <span>{comments.length} bình luận</span>
                      </div>
                    </div>
                  </div>
                  
                  {isOwner && (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-1 text-gray-400 hover:text-red-600 transition"
                    >
                      <Trash2 size={18} />
                      <span className="text-sm">Xóa</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <MessageCircle size={20} />
                  Bình luận
                </div>
                <span className="text-sm text-gray-400">{comments.length} bình luận</span>
              </div>

              {user ? (
                <div className="space-y-3 mb-5">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-red-500 focus:outline-none"
                    placeholder="Viết bình luận..."
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={commentLoading}
                    className="inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {commentLoading ? 'Đang gửi...' : 'Gửi bình luận'}
                  </button>
                </div>
              ) : (
                <div className="mb-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
                  Vui lòng đăng nhập để tham gia bình luận.
                </div>
              )}

              {comments.length === 0 ? (
                <p className="text-gray-500">Chưa có bình luận nào.</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{comment.username}</p>
                          <p className="text-xs text-gray-400">{formatDate(comment.created_at)}</p>
                        </div>
                        {user && comment.user_id === user.id && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-red-600 hover:underline"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                      <p className="mt-3 text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Creator info */}
            <div className="bg-white rounded-xl shadow-md p-5 mb-6">
              <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <User size={18} />
                Người tạo
              </h3>
              <Link
                to={`/profile/${meme.user_id}`}
                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  {meme.user_username?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{meme.user_username || 'Người dùng'}</p>
                  <p className="text-xs text-gray-400">
                    Tham gia từ {meme.user_joined ? new Date(meme.user_joined).toLocaleDateString('vi-VN') : '?'}
                  </p>
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-md p-5 mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Thống kê</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Đăng lúc</span>
                  <span className="text-gray-700">{formatDate(meme.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lượt thích</span>
                  <span className="text-gray-700">{likeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lượt xem</span>
                  <span className="text-gray-700">{meme.view_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bình luận</span>
                  <span className="text-gray-700">{comments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lượt chia sẻ</span>
                  <span className="text-gray-700">{meme.share_count || 0}</span>
                </div>
              </div>
            </div>

            {/* Related memes */}
            {relatedMemes.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-semibold text-gray-700 mb-3">Có thể bạn cũng thích</h3>
                <div className="space-y-3">
                  {relatedMemes.slice(0, 3).map((related) => (
                    <Link
                      key={related.id}
                      to={`/meme/${related.id}`}
                      className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                      <img
                        src={`http://localhost:8000${related.image_url}`}
                        alt=""
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 line-clamp-2">
                          {related.caption}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                          <span>❤️ {related.like_count}</span>
                          <span>👁️ {related.view_count}</span>
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

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Xóa meme?</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa meme này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}