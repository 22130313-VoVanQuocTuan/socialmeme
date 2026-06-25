import { useContext, useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../contexts/AuthContext';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../service/notificationApi';

export default function NotificationBell() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) {
      return null;
    }

    const data = await getNotifications();
    setNotifications(data.notifications || []);
    setUnreadCount(data.unread_count || 0);
    return data;
  };

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsOpen(false);
      return undefined;
    }

    fetchNotifications().catch(() => null);

    const intervalId = window.setInterval(() => {
      fetchNotifications().catch(() => null);
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [user]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = async () => {
    if (!user) {
      return;
    }

    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchNotifications();
      if ((data?.unread_count || 0) > 0) {
        await markAllNotificationsRead();
        setNotifications((prev) => prev.map((item) => ({ ...item, is_read: true })));
        setUnreadCount(0);
      }
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      try {
        await markNotificationRead(notification.id);
      } catch (error) {
        // Ignore mark-read errors here and keep navigation responsive.
      }
    }

    setNotifications((prev) =>
      prev.map((item) =>
        item.id === notification.id ? { ...item, is_read: true } : item
      )
    );
    setUnreadCount((prev) => Math.max(0, prev - (notification.is_read ? 0 : 1)));
    setIsOpen(false);

    const memeId = notification.extra_data?.meme_id;
    if (memeId) {
      navigate(`/meme/${memeId}`);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) {
      return '';
    }

    const createdAt = new Date(dateString);
    const diffMinutes = Math.floor((Date.now() - createdAt.getTime()) / 60000);

    if (diffMinutes < 1) return 'Vua xong';
    if (diffMinutes < 60) return `${diffMinutes} phut truoc`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} gio truoc`;

    return createdAt.toLocaleDateString('vi-VN');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100 hover:text-red-600"
        aria-label="Thong bao"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-[11px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-30 mt-3 w-[22rem] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>
            {isLoading && <span className="text-xs text-gray-400">Đang tải...</span>}
          </div>

          {notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              Chưa có thông báo nào.
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`block w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 ${
                    notification.is_read ? 'bg-white' : 'bg-red-50/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
                    )}
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    {formatTime(notification.created_at)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
