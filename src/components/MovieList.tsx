import {
  Box,
  CircularProgress,
  Typography,
  Pagination,
  Button,
} from "@mui/material";
import { Movie } from "@services/ophimService";
import { MovieCard } from "@components/MovieCard";

interface MovieListProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  showLoadMore?: boolean;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  loading,
  error,
  totalPages,
  currentPage,
  onPageChange,
  showLoadMore = false,
}) => {
  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (loading && movies.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (movies.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6">Không tìm thấy phim nào</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
            lg: "repeat(6, 1fr)",
          },
          gap: 3,
        }}
      >
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.slug} />
        ))}
      </Box>

      {showLoadMore && totalPages > currentPage ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
          <Button
            variant="contained"
            sx={{ borderRadius: "20px" }}
            size="large"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Tải thêm"}
          </Button>
        </Box>
      ) : (
        totalPages > 1 &&
        !showLoadMore && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
            <Pagination
              count={Math.min(totalPages, 500)}
              page={currentPage}
              onChange={(_, page) => onPageChange(page)}
              color="primary"
            />
          </Box>
        )
      )}
    </>
  );
};
