import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, User, LogOut } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import NotificationBell from './NotificationBell';

export default function Header() {
  const { user } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tight bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent hover:opacity-90 transition">
          SocialMeme
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Link
              to="/create"
              className="bg-red-600 text-white font-medium px-4 py-2 rounded-xl hover:bg-red-700 transition shadow-sm shadow-red-100 text-sm whitespace-nowrap"
            >
              + Tạo meme
            </Link>
            {user && (
              <Link
                to="/recommended"
                className="hidden md:inline-flex items-center gap-1 bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 border border-orange-100 px-4 py-2 rounded-xl font-medium text-sm hover:from-orange-100 hover:to-orange-200 transition"
              >
                <Sparkles size={14} className="animate-pulse" />
                Gợi ý cho bạn
              </Link>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-gray-100">
              <NotificationBell />
              
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  {user.avatar_url ? (
                    <img src={`http://localhost:8000${user.avatar_url}`} alt="Avatar" className="w-9 h-9 rounded-full object-cover shadow-sm border border-red-100 group-hover:ring-2 group-hover:ring-red-200 transition-all" />
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm border border-red-100 group-hover:ring-2 group-hover:ring-red-200 transition-all">
                      {user.username?.[0]?.toUpperCase()}
                    </div>
                  )}
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:scale-100 scale-95 z-50">
                  <div className="p-2 space-y-1">
                    <div className="px-3 py-2 border-b border-gray-50 mb-1">
                      <p className="text-sm font-bold text-gray-800 truncate">{user.username}</p>
                      <p className="text-xs text-gray-400 truncate">Thành viên</p>
                    </div>
                    
                    <Link 
                      to={`/profile/${user.id}`} 
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <User size={16} />
                      Trang cá nhân
                    </Link>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                    >
                      <LogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-red-600 border border-gray-200 rounded-xl px-4 py-2 hover:border-red-200 transition">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
