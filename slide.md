# SmartMeme - Noi dung slide bao cao duoi 20 phut

## Tong the goi y

- So slide: 12
- Tong thoi gian: 16-18 phut
- Cach trinh bay: 13-15 phut noi + 3-4 phut demo
- Luu y: Noi dung duoi day bam sat code hien co trong repo, dong thoi tach ro phan da hoan thanh va phan dang dinh huong phat trien

---

## Slide 1. Gioi thieu de tai

**Tieu de:** SmartMeme - Nen tang chia se meme tich hop AI va ML

- SmartMeme la ung dung web cho phep nguoi dung tao, dang va tuong tac voi meme
- He thong khong chi hien thi meme, ma con ca nhan hoa feed dua tren hanh vi nguoi dung
- Du an huong toi 3 nhom chuc nang chinh: User, Admin, AI/ML

**Cau noi goi y:**
SmartMeme duoc xay dung nhu mot mang xa hoi meme mini. Diem khac biet la he thong khong dung lai o CRUD co ban, ma da tich hop AI goi y noi dung, AI kiem duyet binh luan, va chuan bi du lieu cho bai toan du doan meme xu huong.

**Thoi gian:** 1 phut

---

## Slide 2. Bai toan va muc tieu

**Tieu de:** Bai toan dat ra

- Meme la noi dung ngan, lan truyen nhanh, nhung rat de bi troi trong luong bai dang lon
- Nen tang can giup nguoi dung:
- Tao meme nhanh va don gian
- Tim thay meme phu hop voi so thich
- Tuong tac va nhan thong bao kip thoi
- Quan tri noi dung va tai khoan de giu moi truong lanh manh

**Muc tieu cua de tai:**

- Xay dung he thong web meme full-stack
- Ho tro phan he user va admin
- Tich hop AI de tang trai nghiem ca nhan hoa
- Dat nen mong du lieu cho mo hinh ML du doan trend 24h

**Thoi gian:** 1 phut

---

## Slide 3. Pham vi chuc nang

**Tieu de:** Chuc nang chinh cua he thong

**User**

- Dang ky, dang nhap, xac thuc email
- Tao meme tu anh upload va chen caption len anh
- Xem feed Trending, Latest, Recommended
- Like, share, view, comment
- Xem trang ca nhan va danh sach meme da tao
- Nhan thong bao khi meme duoc like, share, comment

**Admin**

- Xem dashboard thong ke tong quan
- Quan ly danh sach nguoi dung
- Khoa/mo khoa tai khoan
- Xoa meme qua API admin

**AI/ML**

- AI goi y meme dua tren hanh vi like/view
- AI kiem duyet binh luan tuc tiu, xuc pham
- Da thiet ke du lieu cho bai toan du doan meme hot trong 24h

**Thoi gian:** 1.5 phut

---

## Slide 4. Kien truc va cong nghe

**Tieu de:** Cong nghe su dung

- Frontend: React 19 + Vite + Tailwind CSS 4
- Backend: FastAPI + SQLAlchemy + Alembic
- Database: PostgreSQL
- AI: GPT-4.1 thong qua GitHub Models, goi bang OpenAI SDK
- Xu ly anh: Pillow
- ML: Scikit-learn, huong den mo hinh RandomForest

**Kien truc 3 lop**

- Frontend goi REST API
- Backend xu ly nghiep vu, xac thuc, AI service
- PostgreSQL luu user, meme, like, share, view, comment, notification, trend data

**Cau noi goi y:**
Kien truc nay giup tach ro phan giao dien, logic nghiep vu va du lieu. Vi vay he thong de mo rong them AI, thong bao, hoac pipeline ML trong giai doan sau.

**Thoi gian:** 1.5 phut

---

## Slide 5. Thiet ke du lieu

**Tieu de:** Cac bang du lieu noi bat

- `users`: thong tin tai khoan, role, trang thai active, xac thuc email
- `memes`: noi dung meme, caption, thong ke like/view/share, trending_score
- `comments`, `likes`, `shares`, `views`: luu hanh vi tuong tac
- `notifications`: thong bao cho chu meme
- `behaviors`: luu hanh vi de phuc vu phan tich va goi y
- `trend_predictions`: luu feature cho bai toan du doan trend
- `reported_memes`: dat san cho bai toan bao cao noi dung

**Diem nhan trong model `meme`**

- Co `like_count`, `view_count`, `share_count`
- Co `trending_score`, `is_trending`
- Co `predicted_hot_at`, `hot_prediction_probability`

**Thoi gian:** 1.5 phut

---

## Slide 6. Luong nghiep vu nguoi dung

**Tieu de:** User flow chinh

1. Nguoi dung dang ky tai khoan
2. He thong gui email xac thuc
3. Sau khi dang nhap, nguoi dung tao meme bang cach upload anh va nhap caption
4. Meme duoc dua len feed de nguoi khac xem, like, share, comment
5. Hanh vi nay duoc luu lai de phuc vu xep hang va AI goi y
6. Chu meme nhan thong bao khi co tuong tac moi

**Diem thuc te trong code**

- Backend co route `/api/auth/register`, `/api/auth/login`, `/api/auth/verify-email`
- Trang `CreateMeme` cho phep keo-tha vi tri caption truoc khi dang
- Trang `MemeDetail` xu ly like, share, comment, view va xoa bai

**Thoi gian:** 1.5 phut

---

## Slide 7. Feed va kham pha noi dung

**Tieu de:** Co che hien thi meme

**1. Trending feed**

- Hien thi meme co muc do tuong tac cao
- Backend sap xep theo like, view va thoi gian tao

**2. Latest feed**

- Hien thi meme moi nhat
- Giup nguoi dung tiep can noi dung vua dang

**3. Recommended feed**

- Chi danh cho nguoi da dang nhap
- Dua tren lich su like va view
- Neu chua co du lieu hanh vi thi he thong thong bao chua du du lieu goi y

**Mo rong ve ranking**

- He thong co `RankingService` tinh `trending_score`
- Diem duoc tinh tu view, like, share va bonus cho meme moi trong 24h dau

**Thoi gian:** 1.5 phut

---

## Slide 8. AI goi y meme ca nhan hoa

**Tieu de:** AI recommendation voi GPT-4.1

**Muc tieu**

- De xuat meme phu hop voi so thich tung nguoi dung

**Du lieu dau vao**

- Meme da like
- Meme da view
- So luong tuong tac
- Danh sach meme ung vien chua tung tuong tac

**Quy trinh**

1. Backend lay lich su hanh vi tu bang `likes` va `behaviors`
2. Loc candidate meme theo `trending_score`, `like_count`, `view_count`, `created_at`
3. Gui caption da thich va danh sach candidate cho GPT-4.1
4. Model tra ve danh sach meme ID phu hop nhat
5. Neu AI loi hoac user moi, he thong fallback ve danh sach trending

**Gia tri dat duoc**

- Feed ca nhan hoa thay vi chung cho moi nguoi
- Tang kha nang giu chan nguoi dung

**Thoi gian:** 2 phut

---

## Slide 9. AI kiem duyet binh luan va thong bao

**Tieu de:** Bao ve noi dung va tang tuong tac

**AI moderation**

- Khi nguoi dung gui comment, backend goi AI de danh gia noi dung
- AI phat hien comment tuc tiu, chui boi, xuc pham nang
- Neu AI khong kha dung, he thong fallback bang bo tu khoa cam

**Thong bao**

- Khi meme duoc like, share, comment, chu meme nhan thong bao
- Backend da co API lay thong bao, danh dau da doc, va stream thong bao
- Frontend hien thi Notification Bell cho nguoi dung

**Y nghia**

- AI giup giu moi truong lanh manh
- Thong bao giup tang muc do quay lai va tuong tac

**Thoi gian:** 1.5 phut

---

## Slide 10. Phan he Admin

**Tieu de:** Quan tri he thong

**Chuc nang da co**

- Dashboard tong quan: tong user, tong meme, tong luot tuong tac
- Danh sach user
- Tim kiem, loc theo quyen va trang thai
- Khoa/mo khoa tai khoan user

**Diem nghiep vu**

- Tai khoan chua xac thuc email hoac bi khoa se khong dang nhap duoc
- Route admin duoc bao ve bang quyen `admin`

**Nhan xet thuc te tu code**

- Giao dien admin hien da tot cho quan ly user
- Chuc nang quan ly meme chi moi co API xoa, giao dien day du la huong phat trien tiep

**Thoi gian:** 1.5 phut

---

## Slide 11. ML du doan meme xu huong trong 24h

**Tieu de:** Dinh huong RandomForest cho bai toan trend prediction

**Nhung gi da co trong code**

- Da co model `trend_predictions`
- Da thiet ke cac feature:
- `likes_1h`, `views_1h`, `shares_1h`
- `like_rate_1h`, `share_rate_1h`, `view_velocity`
- `hour_post`, `day_of_week`, `user_avg_likes`
- Backend da co cac truong trong `memes` de luu ket qua du doan
- Project da cai `scikit-learn`, `pandas`, `joblib`

**Huong xu ly RandomForest de bao cao**

1. Thu thap du lieu tuong tac cua meme trong 1h dau
2. Tao label: meme co hot trong 24h hay khong
3. Train RandomForest
4. Luu xac suat hot vao `hot_prediction_probability`
5. Ket hop voi feed de uu tien meme co kha nang xu huong

**Cach noi trung thuc**

- Phan AI recommendation da hoat dong
- Phan ML trend prediction hien dang o muc chuan bi schema va pipeline du lieu

**Thoi gian:** 1.5 phut

---

## Slide 12. Demo, ket qua va huong phat trien

**Tieu de:** Tong ket

**Kich ban demo 3 phut**

1. Dang ky hoac dang nhap
2. Tao 1 meme moi, keo vi tri caption tren anh
3. Vao trang chi tiet meme de like, comment, share
4. Mo trang goi y AI de cho thay ca nhan hoa feed
5. Vao admin dashboard de xem thong ke va quan ly user

**Ket qua dat duoc**

- Hoan thanh mot he thong meme full-stack co tinh ung dung
- Co day du cac luong user co ban va tuong tac xa hoi
- AI da duoc dua vao bai toan thuc te, khong chi dung o muc y tuong

**Huong phat trien**

- Hoan thien mo hinh RandomForest du doan trend 24h
- Bo sung giao dien quan ly meme va xu ly report
- Nang cap thong bao real-time day du
- Tiep tuc toi uu ranking va ca nhan hoa

**Cau ket**

SmartMeme khong chi la web dang meme, ma la nen tang co kha nang hoc tu hanh vi nguoi dung de phan phoi noi dung thong minh hon.

**Thoi gian:** 1.5 phut

---

## Ghi chu them de thuyet trinh tot hon

- Neu can chup man hinh, nen chup 5 trang: `Home`, `Create Meme`, `Recommended`, `Meme Detail`, `Admin Dashboard`
- Neu hoi ve AI, nen nhan manh: AI dang duoc dung cho 2 bai toan cu the la goi y meme va kiem duyet comment
- Neu hoi ve ML, nen tra loi trung thuc: da thiet ke data model va san sang cho RandomForest, day la huong hoan thien tiep theo
- Neu can rut ngan de xuong 12-15 phut, co the gop Slide 9 va Slide 10
