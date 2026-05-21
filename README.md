# SocialMeme - Tài liệu cấu trúc dự án

Tài liệu này giải thích cấu trúc thư mục hiện tại, mỗi thư mục chứa gì và cách backend, frontend được tổ chức.

## Thư mục gốc

- `docker-compose.yml` - Cấu hình Docker dùng để chạy toàn bộ stack ứng dụng, thường bao gồm backend, database và các dịch vụ phụ.
- `be/` - Ứng dụng backend.
- `fe/` - Ứng dụng frontend.

## `be/` (Backend)

Thư mục này chứa backend FastAPI của SocialMeme.

### Các file cấp cao

- `alembic.ini` - Cấu hình Alembic cho quản lý migration cơ sở dữ liệu.
- `requirements.txt` - Thư viện Python cần thiết cho backend.
- `README` - Ghi chú cài đặt và chạy backend.

### `be/app/`

Mã nguồn backend được đặt dưới `be/app/`.

#### `be/app/main.py`
- Điểm khởi chạy của ứng dụng FastAPI.
- Đăng ký các router, middleware và logic startup/shutdown.

#### `be/app/config.py`
- Cấu hình ứng dụng.
- Chứa chuỗi kết nối database, biến môi trường và cài đặt chung.

#### `be/app/database.py`
- Thiết lập SQLAlchemy.
- Định nghĩa `Base`, engine, session và helper `get_db`.

#### `be/app/routes/`
- Định nghĩa các endpoint API và ánh xạ HTTP route đến controller.
- Chứa các file route chính như:
  - `auth_routes.py`
  - `meme_routes.py`
  - `comment_routes.py`
  - `feed_routes.py`
  - `like_routes.py`
  - `share_routes.py`
  - `view_routes.py`
  - `admin_routes.py`

#### `be/app/controllers/`
- Chứa logic nghiệp vụ của từng tính năng.
- Controller xử lý truy vấn database và xác thực dữ liệu.
- Ví dụ:
  - `meme_controller.py`
  - `comment_controller.py`
  - `auth_controller.py`
  - `behavior_controller.py`

#### `be/app/models/`
- Mô hình ORM SQLAlchemy cho các bảng database.
- Các model quan trọng:
  - `user.py`
  - `meme.py`
  - `comment.py`
  - `like.py`
  - `share.py`
  - `view.py`
  - `notification.py`
  - `report.py`
  - `template.py`
  - `trend_prediction.py`
- `base.py` định nghĩa các thuộc tính chung như timestamp.

#### `be/app/services/`
- Các service hỗ trợ logic dùng chung và chức năng phụ.
- Bao gồm:
  - `jwt_service.py` xử lý xác thực JWT.
  - `password_service.py` xử lý mã hóa mật khẩu.
  - `ranking_service.py` xử lý xếp hạng.
  - `image_service.py` xử lý upload và thêm caption vào ảnh.

#### `be/app/utils/`
- Các module tiện ích được dùng chung trong backend.
- Ví dụ: `time_utils.py`.

#### `be/app/migrations/`
- Các script migration của Alembic.
- Chứa các phiên bản migration và cấu hình môi trường migration.

#### `be/app/static/`
- Tài nguyên tĩnh do backend phục vụ.
- Chứa thư mục upload và temp cho lưu trữ ảnh:
  - `uploads/memes/`
  - `uploads/temp/`

## `fe/` (Frontend)

Thư mục này chứa ứng dụng frontend Vite + React.

### Các file cấp cao

- `package.json` - Thư viện frontend và script chạy.
- `vite.config.js` - Cấu hình build và dev cho Vite.
- `README.md` - Ghi chú riêng cho frontend.
- `index.html` - Entry HTML của ứng dụng.
- `eslint.config.js` - Cấu hình ESLint.

### `fe/src/`

Đây là mã nguồn frontend.

#### `fe/src/main.jsx`
- Bootstrap ứng dụng React.
- Render component gốc và kết nối router.

#### `fe/src/App.jsx`
- Component cấp cao nhất của ứng dụng.
- Định nghĩa route và layout chung.

#### `fe/src/index.css` và `App.css`
- Style toàn cục và style riêng cho app.

#### `fe/src/pages/`
- Các trang chính của ứng dụng.
- Ví dụ:
  - `Home.jsx` - Trang feed và trang chủ.
  - `Login.jsx` - Trang đăng nhập.
  - `Register.jsx` - Trang đăng ký.
  - `CreateMeme.jsx` - Trang tạo meme.
  - `MemeDetail.jsx` - Trang chi tiết meme, bình luận, like, thống kê.
  - `Profile.jsx` - Trang hồ sơ người dùng.

#### `fe/src/components/`
- Component tái sử dụng.
- Có thể chứa card, modal, layout, widget chung.

#### `fe/src/contexts/`
- React context provider.
- `AuthContext.jsx` quản lý trạng thái đăng nhập và thông tin user.

#### `fe/src/service/`
- Các module gọi API.
- `api.js` - Cấu hình Axios và base HTTP client.
- `authApi.js`, `memeApi.js`, `commentApi.js`, `feedApi.js`, `viewApi.js` - các API theo tính năng.

### `fe/public/`
- Tệp tĩnh do Vite phục vụ.
- Chứa hình ảnh, icon và asset công khai.

## Cách tiếp cận project

1. Bắt đầu với backend API:
   - `be/app/routes/` xác định endpoint.
   - `be/app/controllers/` chứa logic chính.
   - `be/app/models/` định nghĩa cấu trúc database.

2. Xem qua frontend:
   - `fe/src/pages/` tương ứng với các màn hình người dùng.
   - `fe/src/service/` chứa các gọi API đến backend.
   - `fe/src/contexts/AuthContext.jsx` kiểm soát trạng thái đăng nhập dùng chung.

3. Kiểm tra migration khi thay đổi database:
   - `be/app/migrations/versions/` chứa các thay đổi schema.
   - Dùng Alembic để tạo và apply migration.

## Ghi chú

- Frontend đang kỳ vọng backend chạy tại `http://localhost:8000`.
- Xác thực người dùng dùng JWT lưu trong `localStorage`.
- Ảnh được upload qua backend và lưu ở `be/app/static/uploads/`.
- Bình luận và thống kê meme được load động trên trang chi tiết meme.
