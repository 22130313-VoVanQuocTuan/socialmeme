// src/pages/CreateMeme.jsx
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, X, ArrowLeft, Image as ImageIcon, Move, RotateCcw, Rocket } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';
import { createMeme } from '../service/memeApi';
import Header from '../components/Header';

const DEFAULT_TEXT_POSITION = { x: 0.5, y: 0.82 };

export default function CreateMeme() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [textPosition, setTextPosition] = useState(DEFAULT_TEXT_POSITION);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const previewRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  const updateTextPosition = (clientX, clientY) => {
    const frame = previewRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    setTextPosition({
      x: clamp((clientX - rect.left) / rect.width, 0.08, 0.92),
      y: clamp((clientY - rect.top) / rect.height, 0.08, 0.92),
    });
  };

  useEffect(() => {
    if (!isDraggingText) return undefined;

    const handlePointerMove = (event) => {
      updateTextPosition(event.clientX, event.clientY);
    };

    const handlePointerUp = () => {
      setIsDraggingText(false);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingText]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setTextPosition(DEFAULT_TEXT_POSITION);
      setIsDraggingText(false);
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
      const result = await createMeme(caption, image, textPosition);
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
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setTextPosition(DEFAULT_TEXT_POSITION);
    setIsDraggingText(false);
  };

  const handleTextPointerDown = (event) => {
    if (!caption.trim()) return;
    event.preventDefault();
    setIsDraggingText(true);
    updateTextPosition(event.clientX, event.clientY);
  };

  const handlePreviewClick = (event) => {
    if (!caption.trim() || isDraggingText) return;
    updateTextPosition(event.clientX, event.clientY);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 antialiased text-gray-900">
      <Header />

      {/* Main Content Container */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Nút quay về trang chủ hoặc trang trước */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 group transition"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Xưởng Chế Meme
          </h1>
          <p className="text-gray-500 text-sm mt-1">Phóng tác những ý tưởng mặn mòi nhất của bạn</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          
          {/* Vùng chọn ảnh / Preview ảnh */}
          <div>
            <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase mb-2 flex items-center gap-1.5">
              <ImageIcon size={14} /> Chọn phôi Meme
            </label>
            
            {!preview ? (
              <div className="rounded-xl border-2 border-dashed border-gray-200 p-10 text-center bg-gray-50/40 hover:bg-gray-50 hover:border-red-400 transition-all cursor-pointer group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center justify-center">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-red-500 group-hover:scale-110 transition-all mb-4">
                    <Upload size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">Tải ảnh lên từ thiết bị</span>
                  <span className="mt-1.5 text-xs text-gray-400">
                    Hỗ trợ định dạng JPG, PNG (Tối đa 10MB)
                  </span>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Khu vực Edit text đè lên ảnh */}
                <div className="flex justify-center bg-neutral-900 rounded-xl overflow-hidden p-2 relative group border border-neutral-800 shadow-inner">
                  <div
                    ref={previewRef}
                    onClick={handlePreviewClick}
                    className="relative inline-block overflow-hidden rounded-lg cursor-crosshair select-none"
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      className="block max-h-[30rem] w-auto max-w-full object-contain"
                    />

                    {/* Lớp text kéo thả */}
                    {caption.trim() && (
                      <div className="pointer-events-none absolute inset-0">
                        <button
                          type="button"
                          onPointerDown={handleTextPointerDown}
                          className={`pointer-events-auto absolute select-none whitespace-pre-wrap text-center font-black tracking-wide text-white transition-shadow p-2 rounded ${
                            isDraggingText ? 'cursor-grabbing scale-105 ring-2 ring-red-500/50 bg-black/10' : 'cursor-grab hover:bg-white/10'
                          }`}
                          style={{
                            left: `${textPosition.x * 100}%`,
                            top: `${textPosition.y * 100}%`,
                            transform: 'translate(-50%, -50%)',
                            fontSize: 'clamp(20px, 3.5vw, 38px)',
                            lineHeight: 1.1,
                            touchAction: 'none',
                            textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0px 4px 10px rgba(0,0,0,0.5)',
                          }}
                        >
                          {caption}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Nút hủy gỡ ảnh góc phải */}
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-4 right-4 rounded-xl bg-black/60 backdrop-blur-md text-white p-2 hover:bg-red-600 transition shadow-md"
                    title="Xóa ảnh chọn lại"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Hướng dẫn nhỏ */}
                <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 border border-gray-100 p-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5 font-medium"><Move size={14} className="text-gray-400" /> Nhấp chuột hoặc kéo chữ để đổi vị trí trên ảnh.</span>
                  <button
                    type="button"
                    onClick={() => setTextPosition(DEFAULT_TEXT_POSITION)}
                    className="inline-flex items-center gap-1 shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                  >
                    <RotateCcw size={12} /> Đặt lại
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Ô nhập Nội dung (Caption) */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-400 tracking-wider uppercase">
                Nhập nội dung Meme
              </label>
              <div className="text-xs font-medium text-gray-400">{caption.length}/200</div>
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 focus:outline-none transition-all resize-none"
              placeholder="Gõ vài câu nói thật 'bá đạo' vào đây..."
              maxLength={200}
            />
          </div>

          {/* Nút bấm Submit gửi bài */}
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl bg-red-600 py-3.5 text-sm font-bold text-white hover:bg-red-700 transition shadow-sm shadow-red-100 disabled:opacity-50"
          >
            {loading ? 'Đang xuất xưởng bài viết...' : <span className="flex items-center gap-2"><Rocket size={18} /> Xuất Bản Meme</span>}
          </button>
          
        </form>
      </div>
    </div>
  );
}