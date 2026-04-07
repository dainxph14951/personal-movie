import { Box, Typography } from "@mui/material";
import { Movie } from "@services/ophimService";
import { MovieCard } from "./MovieCard";

interface TrendingMoviesProps {
  movies: Movie[];
  updateCountInDay?: number;
}

export const TrendingMovies: React.FC<TrendingMoviesProps> = ({
  movies,
  updateCountInDay = 0,
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            🎬 Mới cập nhật
          </Typography>
          {updateCountInDay > 0 && (
            <Typography variant="body2" color="textSecondary">
              {updateCountInDay} phim cập nhật trong ngày
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.slug} />
        ))}
      </Box>
    </Box>
  );
};
