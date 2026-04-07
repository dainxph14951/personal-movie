# Movie App - Hướng dẫn Copilot

## 🎬 Giới thiệu dự án

Movie App là một ứng dụng web xem phim được phát triển bằng React, TypeScript, Material UI và TheMovieDB API. Ứng dụng cho phép người dùng xem danh sách phim, tìm kiếm phim, xem thông tin chi tiết và đánh giá.

## 📦 Stack công nghệ

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 4.5.0
- **UI Library**: Material UI 7.3.9
- **HTTP Client**: Axios
- **Styling**: Emotion (MUI built-in)
- **Router**: React Router DOM 6
- **Node.js**: 18.20.4+

## 🏗️ Cấu trúc thư mục

```
src/
├── components/           # Reusable React components
│   ├── MovieCard.tsx    # Component hiển thị thông tin phim
│   └── MovieList.tsx    # Component hiển thị danh sách phim
├── pages/               # Page components
│   └── Home.tsx        # Trang chính
├── services/            # API services
│   └── movieService.ts # Gọi API TheMovieDB
├── hooks/               # Custom React hooks
│   └── useMovies.ts    # Hook fetch danh sách và tìm kiếm phim
├── styles/              # Global styles
├── utils/               # Utility functions
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global CSS
```

## 🚀 Lệnh chạy

- `npm run dev` - Chạy development server (http://localhost:5173)
- `npm run build` - Build cho production
- `npm run preview` - Preview build production
- `npm run type-check` - Kiểm tra TypeScript

## 🔑 API Configuration

API sử dụng TheMovieDB API v3 với Read Access Token:

```
Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGUyNTNhYzEyZTUxYmE1NTNmOTJkYjJmMmU5NTM5OCIsIm5iZiI6MTc3NTQ0MzI4NC40NDQsInN1YiI6IjY5ZDMxZDU0MDRjYzQ0YWI0ZDVjNjVmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HH-lmIMJHgBcyE372tKBr6bvpYirD-95jv2a74_qn7M
```

## 📋 Các tính năng chính

1. **Danh sách phim theo danh mục**
   - Phổ biến (Popular)
   - Đang chiếu (Now Playing)
   - Xếp hạng cao (Top Rated)
   - Sắp chiếu (Upcoming)

2. **Tìm kiếm phim** - Tìm phim theo từ khóa

3. **Phân trang** - Duyệt qua nhiều trang kết quả

4. **Thông tin chi tiết**
   - Tên phim
   - Poster
   - Ngày phát hành
   - Đánh giá (Rating)
   - Độ phổ biến
   - Mô tả phim

## 🎨 Thiết kế

- **Theme**: Dark theme (tối) với Primary (#1976d2) và Secondary (#dc004e)
- **Responsive**: Tối ưu cho mobile, tablet, desktop
- **Layout**: Grid responsive (1 cột trên mobile, 2 cột tablet, 3 cột desktop, 4 cột trên large screen)

## 📝 Coding Convention

- **Biến & Hàm**: `lowerCamelCase` (ví dụ: `handleClick`, `movieTitle`)
- **Components**: `PascalCase` (ví dụ: `MovieCard`, `MovieList`)
- **Imports**: Sử dụng path alias (@components, @services, @hooks, @utils)
- **Hooks**: Đặt tên bắt đầu bằng `use` (ví dụ: `useMovies`)
- **Event handlers**: Bắt đầu bằng `handle` (ví dụ: `handleSearch`, `handlePageChange`)

## 🔧 Xử lý lỗi phổ biến

### Dev Server không chạy được

- Kiểm tra port 5173 có đang dùng không
- Clear node_modules và cài lại: `rm -rf node_modules package-lock.json && npm install`

### API Key hết hạn

- Tạo API key mới từ https://www.themoviedb.org/settings/api
- Cập nhật token trong `src/services/movieService.ts`

### Build lỗi

- Chạy `npm run type-check` để kiểm tra TypeScript
- Clear cache: `rm -rf dist && npm run build`

## 📚 Resources

- [TheMovieDB API Documentation](https://developer.themoviedb.org/docs/getting-started)
- [React Documentation](https://react.dev)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)

## 🎯 Tính năng có thể mở rộng

- [ ] Chi tiết phim (click vào phim để xem thêm)
- [ ] Yêu thích phim (Favorite)
- [ ] Bình luận & Rating
- [ ] Trailer hoạt động (từ YouTube)
- [ ] Filters & Sort
- [ ] Dark/Light theme toggle
- [ ] Đăng nhập & User accounts
- [ ] Lịch sử xem phim
- [ ] Wishlist/Watchlist

---

**Cập nhật lần cuối**: 6 tháng 4 năm 2026
