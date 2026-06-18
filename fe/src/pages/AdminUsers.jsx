import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../service/adminApi";
import { ArrowLeft, Shield, User as UserIcon, Lock, Unlock, Search, ChevronLeft, ChevronRight, Eye, Filter } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Tìm kiếm, Phân trang và Lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers();
      const sortedData = response.data.sort((a, b) => a.id - b.id);
      setUsers(sortedData);
    } catch (error) {
      alert("Lỗi tải danh sách: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggle = async (userId) => {
    try {
      await adminApi.toggleUserStatus(userId);
      await fetchUsers(); 
    } catch (error) {
      alert("Lỗi khi đổi trạng thái: " + (error.response?.data?.detail || error.message));
    }
  };

  // Logic Lọc & Tìm kiếm tổng hợp
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" ? true : user.role === roleFilter;
    
    const matchesStatus = statusFilter === "all" 
      ? true 
      : statusFilter === "active" ? user.is_active : !user.is_active;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Xử lý Phân trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Reset về trang 1 nếu thay đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      {/* Header Sticky */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-gray-500 hover:text-red-600 transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-red-600">Quản lý người dùng</h1>
          </div>
          <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
            Tổng cộng: <span className="font-bold text-red-600">{users.length}</span>
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
              placeholder="Tìm tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-500 transition outline-none"
            />
          </div>

          {/* Cụm Bộ lọc */}
          <div className="flex w-full md:w-auto gap-3 items-center">
            <Filter className="text-gray-400 hidden lg:block" size={18} />
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-red-500"
            >
              <option value="all">Tất cả Quyền</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-red-500"
            >
              <option value="all">Tất cả Trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="locked">Đã khóa</option>
            </select>
          </div>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-b-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b text-gray-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">ID</th>
                  <th className="px-6 py-4 font-medium">Người dùng</th>
                  <th className="px-6 py-4 font-medium">Quyền</th>
                  <th className="px-6 py-4 font-medium">Trạng thái</th>
                  <th className="px-6 py-4 font-medium text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 text-gray-500 font-medium">#{user.id}</td>
                    
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-800">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {user.role === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                          <Shield size={14} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <UserIcon size={14} /> User
                        </span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm text-gray-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm text-gray-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span> Đã khóa
                        </span>
                      )}
                    </td>
                    
                    {/* Các Nút Hành động */}
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Link 
                        to={`/profile/${user.id}`}
                        title="Xem trang cá nhân"
                        className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-100"
                      >
                        <Eye size={18} />
                      </Link>

                      <button
                        onClick={() => handleToggle(user.id)}
                        disabled={user.role === "admin"}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                          user.role === "admin"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-transparent"
                            : user.is_active
                            ? "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                            : "bg-red-600 text-white border border-red-600 hover:bg-red-700 shadow-sm"
                        }`}
                        title={user.role === "admin" ? "Không thể khóa Admin" : ""}
                      >
                        {user.is_active ? (
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
          {filteredUsers.length === 0 && (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center">
              <Search size={40} className="text-gray-300 mb-3" />
              <p>Không tìm thấy người dùng nào phù hợp với bộ lọc hiện tại.</p>
              <button 
                onClick={() => { setSearchTerm(""); setRoleFilter("all"); setStatusFilter("all"); }}
                className="mt-4 text-red-600 hover:underline text-sm"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="border-t border-gray-100 p-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Hiển thị <span className="font-medium text-gray-900">{indexOfFirstUser + 1}</span> - <span className="font-medium text-gray-900">{Math.min(indexOfLastUser, filteredUsers.length)}</span> trong số <span className="font-medium text-gray-900">{filteredUsers.length}</span>
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

export default AdminUsers;