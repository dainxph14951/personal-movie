# 🎬 Movie App

Một ứng dụng web xem phim được xây dựng với React, TypeScript, Material UI và TheMovieDB API.

## ✨ Tính năng

- 📋 Danh sách phim theo các danh mục: Phổ biến, Đang chiếu, Xếp hạng cao, Sắp chiếu
- 🔍 Tìm kiếm phim theo từ khóa (tiếng Việt)
- 🎭 Lọc phim theo thể loại (genre)
- ⭐ Xem đánh giá và thông tin chi tiết về phim (bằng tiếng Việt)
- 🌍 Hiển thị quốc gia sản xuất
- 💰 Thông tin ngân sách, doanh thu, thời lượng phim
- 📱 Responsive design - tương thích tất cả các thiết bị
- 🌙 Dark theme - giao diện hiện đại và dễ nhìn
- 📄 Phân trang - duyệt qua hàng nghìn bộ phim
- 🎬 Click vào phim để xem chi tiết đầy đủ

## 🚀 Công nghệ sử dụng

- **React 19** - UI library
- **TypeScript** - Ngôn ngữ lập trình
- **Vite** - Build tool
- **Material UI** - UI component library
- **Axios** - HTTP client
- **TheMovieDB API** - Nguồn dữ liệu phim

## 📁 Cấu trúc thư mục

```
movie/
├── src/
│   ├── components/       # React components
│   │   ├── MovieCard.tsx
│   │   └── MovieList.tsx
│   ├── pages/           # Page components
│   │   └── Home.tsx
│   ├── services/        # API services
│   │   └── movieService.ts
│   ├── hooks/           # Custom hooks
│   │   └── useMovies.ts
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Entry point
│   ├── index.css        # Global CSS
│   └── vite-env.d.ts    # Vite environment types
├── public/              # Static assets
├── index.html           # HTML file
├── package.json         # Dependencies
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── README.md            # Documentation
```

## 🛠️ Cài đặt

1. **Clone/Tải dự án**

```bash
cd /Users/nguyenxuandai/Documents/VSII/Dự\ án\ cá\ nhân/movie
```

2. **Cài đặt dependencies**

```bash
npm install
```

## ▶️ Chạy ứng dụng

### Development

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Build cho production

```bash
npm run build
```

### Preview build production

```bash
npm run preview
```

### Type check

```bash
npm run type-check
```

## 🔐 API Configuration

Ứng dụng sử dụng TheMovieDB API. API key đã được cấu hình sẵn trong file:

- `src/services/movieService.ts`

Nếu muốn sử dụng API key khác:

1. Truy cập https://www.themoviedb.org/
2. Tạo tài khoản và tạo API key
3. Thay thế token trong `src/services/movieService.ts`

## 📱 Các tính năng chính

### 1. Danh sách phim

- Xem phim theo danh mục khác nhau
- Hiển thị 20 phim mỗi trang
- Hỗ trợ phân trang

### 2. Thẻ phim (Movie Card)

- Hình poster phim
- Tên phim
- Ngày phát hành
- Đánh giá (IMDb rating)
- Độ phổ biến
- Mô tả ngắn

### 3. Tìm kiếm

- Tìm kiếm phim theo tên
- Kết quả tức thời
- Hỗ trợ phân trang kết quả tìm kiếm

## 🎨 Giao diện

- **AppBar**: Header với tiêu đề ứng dụng
- **Button Group**: Chọn danh mục phim
- **Search Bar**: Tìm kiếm phim
- **Grid Layout**: Hiển thị phim theo lưới
- **Pagination**: Điều hướng giữa các trang
- **Dark Theme**: Giao diện tối làm giảm căng thẳng mắt

## 🔄 Custom Hooks

### `useMovies(fetchFunction, initialPage)`

Hook để fetch danh sách phim từ API.

**Parameters:**

- `fetchFunction`: Hàm fetch phim (getPular, getNowPlaying, v.v.)
- `initialPage`: Trang khởi đầu (mặc định: 1)

**Returns:**

- `movies`: Mảng phim
- `loading`: Trạng thái loading
- `error`: Thông báo lỗi
- `totalPages`: Tổng số trang
- `currentPage`: Trang hiện tại

### `useSearchMovies(query, initialPage)`

Hook để tìm kiếm phim.

**Parameters:**

- `query`: Từ khóa tìm kiếm
- `initialPage`: Trang khởi đầu (mặc định: 1)

## 🐛 Khắc phục sự cố

### Lỗi CORS

Nếu gặp lỗi CORS, API key có thể đã hết hạn. Hãy tạo key mới từ TheMovieDB.

### API không phản hồi

Kiểm tra kết nối internet và đảm bảo API key hợp lệ.

### Component không render

Kiểm tra browser console để xem thông báo lỗi chi tiết.

## 📚 Tài nguyên

- [React Documentation](https://react.dev)
- [Material UI](https://mui.com)
- [TheMovieDB API](https://www.themoviedb.org/settings/api)
- [Vite](https://vitejs.dev)
- [TypeScript](https://www.typescriptlang.org)

## 📝 License

ISC

## 👨‍💻 Tác giả

Nguyễn Xuân Đại

---

**Bắt đầu xem phim ngay bây giờ!** 🍿🎥
