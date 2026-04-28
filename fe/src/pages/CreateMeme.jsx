// src/pages/CreateMeme.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, Camera, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import { createMeme } from '../service/memeApi';

export default function CreateMeme() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Vui lòng đăng nhập để tạo meme');
      navigate('/login');
      return;
    }
    if (!image) {
      toast.error('Vui lòng chọn ảnh');
      return;
    }
    if (!caption.trim()) {
      toast.error('Vui lòng nhập caption');
      return;
    }

    setLoading(true);
    try {
      const result = await createMeme(caption, image);
      toast.success('Tạo meme thành công!');
      navigate(`/meme/${result.id}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="text-2xl font-bold text-red-600">
            SocialMeme
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Tạo Meme Mới</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ảnh của bạn
            </label>
            {!preview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <span className="text-gray-500">Click để chọn ảnh</span>
                  <span className="text-xs text-gray-400 mt-1">
                    Hỗ trợ JPG, PNG (tối đa 10MB)
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-lg max-h-96 object-contain bg-gray-100"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Nhập caption cho meme của bạn..."
              maxLength={200}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {caption.length}/200
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Đang tạo...' : '🚀 Tạo Meme'}
          </button>
        </form>
      </div>
    </div>
  );
}