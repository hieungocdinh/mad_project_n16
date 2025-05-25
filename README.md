# Ứng Dụng Quản lý Gia Phả

## Giới thiệu dự án

Đây là dự án ứng dụng di động **Quản lý Gia Phả**, được phát triển theo nhóm gồm 4 thành viên nhằm giúp người dùng quản lý thông tin gia đình một cách tiện lợi và trực quan.

### Thành viên nhóm

| Mã sinh viên   | Họ và tên          |
| -------------- | ------------------ |
| B21DCCN194     | Trần Phú Cường     |
| B21DCCN170     | Bùi Duy Bình       |
| B21DCCN278     | Nguyễn Văn Dũng    |
| **B21DCCN050** | **Đinh Ngọc Hiếu** |

---

## Cấu trúc dự án

```
.
├── mad_backend/       # Backend Spring Boot
├── mad_frontend/      # Frontend React Native
└── README.md
```

---

## Công nghệ sử dụng

* **Backend**: Java Spring Boot (`./mad_backend`)
* **Frontend**: Typescript với React Native (`./mad_frontend`)
* **Cơ sở dữ liệu**: MySQL
* **Lưu trữ ảnh**: Cloudinary

---

## Vai trò của tôi trong nhóm

Tôi đảm nhận phát triển cả **backend** và **frontend** cho các chức năng:

* Quản lý ảnh và album của gia đình
* Quản lý hồ sơ thành viên trong gia đình

---

## Các tính năng chính

* Tạo, cập nhật, xóa album và ảnh đại diện trong gia đình
* Quản lý chi tiết hồ sơ từng thành viên gia đình: thông tin cá nhân, quan hệ, ảnh...
* Đồng bộ ảnh lên Cloudinary để đảm bảo lưu trữ và tải ảnh nhanh

---

## Hướng dẫn chạy dự án

### Backend

1. Cài đặt JDK 11+ và Maven
2. Cấu hình kết nối MySQL trong `application.yml`
3. Chạy backend:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend

1. Cài đặt Node.js, Yarn hoặc npm
2. Cấu hình biến môi trường trong `.env`
3. Cài dependencies và chạy app:

   ```bash
   cd frontend
   yarn install
   yarn start
   ```

   hoặc

   ```bash
   npm install
   npm start
   ```

---

## Liên hệ

* Email: [hieungocdinhforwork@gmail.com](mailto:hieungocdinhforwork@gmail.com)
* GitHub: [hieungocdinh](https://github.com/hieungocdinh)

---

Cảm ơn bạn đã quan tâm và xem qua dự án của chúng tôi!
