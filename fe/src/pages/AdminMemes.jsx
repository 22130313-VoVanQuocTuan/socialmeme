import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../service/adminApi";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/image";
import {
  ArrowLeft,
  Image as ImageIcon,
  ShieldAlert,
  CheckCircle,
  Lock,
  Unlock,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react";

const AdminMemes = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Tìm kiếm, Phân trang và Lọc (Giống hệt AdminUsers)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const memesPerPage = 5;

  const fetchMemes = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllMemes();
      // Tùy thuộc vào cấu trúc backend trả về, sort theo ID mới nhất
      const data = response.data || response;
      const sortedData = data.sort((a, b) => b.id - a.id);
      setMemes(sortedData);
    } catch (error) {
      console.error("Lỗi tải danh sách meme:", error);
      toast.error("Không thể tải danh sách meme!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  const handleToggleStatus = async (memeId) => {
    try {
      const res = await adminApi.toggleMemeStatus(memeId);
      const data = res.data || res;
      toast.success(data.message || "Đã cập nhật trạng thái!");
      // Cập nhật lại state tĩnh cho nhanh
      setMemes(
        memes.map((meme) =>
          meme.id === memeId ? { ...meme, status: data.new_status } : meme,
        ),
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      toast.error("Cập nhật thất bại!");
    }
  };



  // Logic Lọc & Tìm kiếm tổng hợp
  const filteredMemes = memes.filter((meme) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (meme.caption || "").toLowerCase().includes(searchLower) ||
      (meme.user_username || "").toLowerCase().includes(searchLower);

    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "active" ? meme.status === "active" : meme.status !== "active";

    return matchesSearch && matchesStatus;
  });

  // Xử lý Phân trang
  const indexOfLastMeme = currentPage * memesPerPage;
  const indexOfFirstMeme = indexOfLastMeme - memesPerPage;
  const currentMemes = filteredMemes.slice(indexOfFirstMeme, indexOfLastMeme);
  const totalPages = Math.ceil(filteredMemes.length / memesPerPage);

  // Reset về trang 1 nếu thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Header Sticky */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-500 hover:text-emerald-600 transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-emerald-600 flex items-center gap-2">
              <ImageIcon size={24} /> Quản lý Meme
            </h1>
          </div>
          <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
            Tổng cộng: <span className="font-bold text-emerald-600">{memes.length}</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        
        {/* Thanh công cụ: Tìm kiếm & Lọc */}
        <div className="bg-white p-4 rounded-t-xl border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
          {/* Cụm Tìm kiếm */}
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề hoặc tác giả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition outline-none"
            />
          </div>

          {/* Cụm Bộ lọc */}
          <div className="flex w-full md:w-auto gap-3 items-center">
            <Filter className="text-gray-400 hidden lg:block" size={18} />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-emerald-500"
            >
              <option value="all">Tất cả Trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Bị khóa (Reported)</option>
            </select>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b text-gray-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Hình ảnh & Tiêu đề</th>
                  <th className="px-6 py-4 font-medium">Tác giả</th>
                  <th className="px-6 py-4 font-medium">Tương tác</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentMemes.map((meme) => (
                  <tr key={meme.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getImageUrl(meme.image_url)}
                          alt="meme"
                          className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/150x150?text=No+Image";
                          }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800 max-w-[200px] truncate" title={meme.caption}>
                            {meme.caption || <span className="text-gray-400 italic">Không có tiêu đề</span>}
                          </p>
                          <p className="text-xs text-gray-500">ID: #{meme.id}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">@{meme.user_username}</span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <p>❤️ {meme.like_count} Likes</p>
                        <p>👁️ {meme.view_count} Views</p>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {meme.status === "active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm text-gray-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm text-gray-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span> Bị khóa
                        </span>
                      )}
                    </td>
                    
                    {/* Các Nút Hành động */}
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Link 
                        to={`/meme/${meme.id}`}
                        title="Xem chi tiết meme"
                        className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-100"
                      >
                        <Eye size={18} />
                      </Link>

                      <button
                        onClick={() => handleToggleStatus(meme.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                          meme.status === "active"
                            ? "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                            : "bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700 shadow-sm"
                        }`}
                      >
                        {meme.status === "active" ? (
                          <><Lock size={16} /> Khóa</>
                        ) : (
                          <><Unlock size={16} /> Mở khóa</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Thông báo nếu rỗng (Search/Filter không có kết quả) */}
          {filteredMemes.length === 0 && (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <Search size={40} className="text-gray-300 mb-3" />
              <p>Không tìm thấy meme nào phù hợp với bộ lọc hiện tại.</p>
              <button 
                onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}
                className="mt-4 text-emerald-600 hover:underline text-sm"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="border-t border-gray-100 p-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Hiển thị <span className="font-medium text-gray-900">{indexOfFirstMeme + 1}</span> - <span className="font-medium text-gray-900">{Math.min(indexOfLastMeme, filteredMemes.length)}</span> trong số <span className="font-medium text-gray-900">{filteredMemes.length}</span>
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMemes;