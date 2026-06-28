// src/pages/Profile.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Heart, Eye, Trophy, MessageCircle, Share2, Clock, Image as ImageIcon, Settings, User as UserIcon, Lock, Save, Mail, FileText, Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getUserMemes, getUserLikedMemes } from '../service/feedApi';
import { getUserStats, getUserHistory, getCurrentUser, updateProfile, uploadAvatar } from '../service/userApi';
import Header from '../components/Header';
import MemeCard from '../components/MemeCard';

export default function Profile() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [memes, setMemes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('posts');
  const [likedMemes, setLikedMemes] = useState([]);
  const [history, setHistory] = useState([]);
  const [likedMemesLoading, setLikedMemesLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Settings states
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    current_password: '',
    new_password: ''
  });

  const isOwnProfile = user && user.id === parseInt(id);

  useEffect(() => {
    fetchUserData();
    // Reset tabs data when user id changes
    setLikedMemes([]);
    setHistory([]);
    setActiveTab('posts');
  }, [id]);

  useEffect(() => {
    if (activeTab === 'liked' && likedMemes.length === 0) {
      fetchLikedMemes();
    } else if (activeTab === 'history' && history.length === 0) {
      fetchHistory();
    } else if (activeTab === 'settings' && formData.email === '') {
      fetchSettingsData();
    }
  }, [activeTab, id]);

  const fetchSettingsData = async () => {
    setSettingsLoading(true);
    try {
      const data = await getCurrentUser();
      setFormData(prev => ({
        ...prev,
        username: data.username || '',
        email: data.email || ''
      }));
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải thông tin cài đặt');
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSettingsChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        username: formData.username
      });
      toast.success('Cập nhật thông tin thành công!');
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (localUser && localUser.username !== formData.username) {
        localUser.username = formData.username;
        localStorage.setItem('user', JSON.stringify(localUser));
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!formData.current_password || !formData.new_password) {
      toast.error('Vui lòng nhập đủ mật khẩu cũ và mới');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        current_password: formData.current_password,
        new_password: formData.new_password
      });
      toast.success('Đổi mật khẩu thành công!');
      setFormData(prev => ({ ...prev, current_password: '', new_password: '' }));
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh!');
      return;
    }
    
    setUploadingAvatar(true);
    try {
      const data = await uploadAvatar(file);
      toast.success('Cập nhật ảnh đại diện thành công!');
      
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (localUser) {
        localUser.avatar_url = data.avatar_url;
        localStorage.setItem('user', JSON.stringify(localUser));
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải ảnh lên');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const fetchLikedMemes = async () => {
    setLikedMemesLoading(true);
    try {
      const data = await getUserLikedMemes(id);
      setLikedMemes(data.memes || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLikedMemesLoading(false);
    }
  };

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await getUserHistory(id);
      setHistory(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const [memesData, statsData] = await Promise.all([
        getUserMemes(id),
        getUserStats(id)
      ]);
      setMemes(memesData.memes || []);
      setStats(statsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                {stats?.user?.avatar_url || (isOwnProfile && user?.avatar_url) ? (
                  <img src={`http://localhost:8000${stats?.user?.avatar_url || user?.avatar_url}`} alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-white shadow-md" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {stats?.user?.username?.[0]?.toUpperCase() || (isOwnProfile ? user?.username?.[0]?.toUpperCase() : 'U')}
                  </div>
                )}
                {isOwnProfile && (
                  <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow border border-gray-100 cursor-pointer hover:bg-gray-50 transition" title="Thay đổi ảnh đại diện">
                    <Camera size={14} className="text-gray-600" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                  </label>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {stats?.user?.username || (isOwnProfile ? user?.username : `Người dùng #${id}`)}
                </h1>
                <p className="text-gray-500">{stats?.total_memes || 0} meme đã tạo</p>
              </div>
            </div>
            {stats && (
              <div className="flex gap-6 mt-4 md:mt-0 md:ml-auto bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{stats.total_likes_received}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1"><Heart size={14}/> Lượt thích</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{stats.total_views_received}</div>
                  <div className="text-sm text-gray-500 flex items-center gap-1"><Eye size={14}/> Lượt xem</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {stats?.top_interactors?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Trophy size={24} className="text-yellow-500" /> Fan cứng (Tương tác nhiều nhất)
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {stats.top_interactors.map((interactor, index) => (
                <Link key={interactor.id} to={`/profile/${interactor.id}`} className="bg-white rounded-xl shadow p-4 flex flex-col items-center min-w-[120px] hover:shadow-md transition shrink-0">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mb-2">
                      {interactor.username?.[0]?.toUpperCase()}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">
                        1
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-sm truncate w-full text-center">{interactor.username}</p>
                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full mt-1">
                    Điểm: {interactor.interaction_score}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tabs Điều Hướng */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('posts')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'posts' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <ImageIcon size={16} /> Bài đăng
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'liked' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Heart size={16} /> Đã thích
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors ${
              activeTab === 'history' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Clock size={16} /> Lịch sử
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-colors ${
                activeTab === 'settings' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Settings size={16} /> Cài đặt
            </button>
          )}
        </div>
        
        {/* Nội dung Tab Bài Đăng */}
        {activeTab === 'posts' && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : memes.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                Chưa có bài đăng nào
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {memes.map((meme) => (
                  <div key={meme.id} className="transform hover:-translate-y-1 transition-all duration-300">
                    <MemeCard meme={meme} onLike={fetchUserData} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Nội dung Tab Đã Thích */}
        {activeTab === 'liked' && (
          <>
            {likedMemesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              </div>
            ) : likedMemes.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                Chưa thích meme nào
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {likedMemes.map((meme) => (
                  <div key={meme.id} className="transform hover:-translate-y-1 transition-all duration-300">
                    <MemeCard meme={meme} onLike={fetchLikedMemes} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Nội dung Tab Lịch Sử Tương Tác */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 max-w-3xl mx-auto">
            {historyLoading ? (
               <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div></div>
            ) : history.length === 0 ? (
               <div className="text-center text-gray-500 py-10">Chưa có lịch sử tương tác nào</div>
            ) : (
              <div className="space-y-6">
                {history.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start relative">
                    {/* Line nối timeline */}
                    {index < history.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-gray-100"></div>
                    )}
                    <div className="mt-1 relative z-10">
                      {item.type === 'like' && <div className="bg-red-50 text-red-500 p-2.5 rounded-full"><Heart size={18} /></div>}
                      {item.type === 'comment' && <div className="bg-blue-50 text-blue-500 p-2.5 rounded-full"><MessageCircle size={18} /></div>}
                      {item.type === 'share' && <div className="bg-green-50 text-green-500 p-2.5 rounded-full"><Share2 size={18} /></div>}
                    </div>
                    <div className="flex-1 bg-gray-50 p-4 rounded-xl hover:bg-gray-100/50 transition">
                      <p className="text-sm font-semibold text-gray-800 mb-2">
                        {item.type === 'like' && 'Đã thích meme'}
                        {item.type === 'comment' && 'Đã bình luận trên meme'}
                        {item.type === 'share' && `Đã chia sẻ meme (${item.platform || 'Link'})`}
                        <span className="text-gray-400 font-normal text-xs ml-2">• {new Date(item.created_at).toLocaleString('vi-VN')}</span>
                      </p>
                      {item.type === 'comment' && (
                        <p className="text-sm font-medium text-gray-700 mb-3 bg-white p-3 rounded-lg border-l-2 border-blue-400 shadow-sm whitespace-pre-wrap">{item.content}</p>
                      )}
                      <Link to={`/meme/${item.meme.id}`} className="flex gap-3 items-center bg-white p-2 rounded-xl border border-gray-200 hover:border-red-300 transition group">
                        <img src={`http://localhost:8000${item.meme.image_url}`} className="w-14 h-14 object-cover rounded-lg shadow-sm" alt="meme" />
                        <span className="text-sm font-medium text-gray-700 line-clamp-2 group-hover:text-red-600 transition">{item.meme.caption || 'Meme không có tiêu đề'}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Nội dung Tab Cài đặt */}
        {activeTab === 'settings' && isOwnProfile && (
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 max-w-2xl mx-auto">
            {settingsLoading ? (
               <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div></div>
            ) : (
              <div className="space-y-6">
                {/* General Info Form */}
                <form onSubmit={handleUpdateInfo} className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-3 border-b pb-2"><UserIcon size={16} className="text-red-500"/> Thông tin chung</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tên hiển thị</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none"><UserIcon size={14} className="text-gray-400" /></div>
                      <input type="text" name="username" value={formData.username} onChange={handleSettingsChange} className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Email (Không thể thay đổi)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none"><Mail size={14} className="text-gray-400" /></div>
                      <input type="email" name="email" value={formData.email} className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed focus:outline-none" disabled readOnly />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button type="submit" disabled={saving} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"><Save size={14} /> Lưu thông tin</button>
                  </div>
                </form>
                
                {/* Password Form */}
                <form onSubmit={handleUpdatePassword} className="space-y-3">
                  <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2 mb-3 border-b pb-2"><Lock size={16} className="text-red-500"/> Đổi mật khẩu</h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none"><Lock size={14} className="text-gray-400" /></div>
                      <input type="password" name="current_password" value={formData.current_password} onChange={handleSettingsChange} className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none"><Lock size={14} className="text-gray-400" /></div>
                      <input type="password" name="new_password" value={formData.new_password} onChange={handleSettingsChange} className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500" />
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button type="submit" disabled={saving} className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition disabled:opacity-50"><Save size={14} /> Cập nhật mật khẩu</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
