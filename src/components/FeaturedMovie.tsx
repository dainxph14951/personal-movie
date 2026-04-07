import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Chip } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { Movie } from "@services/ophimService";
import { getImageUrl } from "@utils/imageUtils";

interface FeaturedMovieProps {
  movie: Movie;
}

export const FeaturedMovie: React.FC<FeaturedMovieProps> = ({ movie }) => {
  const navigate = useNavigate();
  const imageUrl = getImageUrl(movie.thumb_url || movie.poster_url);

  const handleClick = () => {
    navigate(`/movie/${movie.slug}`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "relative",
        height: "400px",
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: 2,
        overflow: "hidden",
        mb: 4,
        cursor: "pointer",
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
          zIndex: 2,
        }}
      >
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
          {movie.quality && (
            <Chip
              label={movie.quality}
              size="small"
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
            />
          )}
          {movie.lang && (
            <Chip
              label={movie.lang}
              size="small"
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
            />
          )}
          {movie.episode_current && (
            <Chip
              label={movie.episode_current}
              size="small"
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
            />
          )}
        </Box>

        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          {movie.name}
        </Typography>

        {movie.origin_name && (
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.8)",
              mb: 1,
            }}
          >
            {movie.origin_name}
          </Typography>
        )}

        {movie.year && (
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.7)",
              mb: 2,
            }}
          >
            {movie.year}
          </Typography>
        )}

        <Button
          sx={{ borderRadius: "20px" }}
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={handleClick}
        >
          Xem luôn chứ còn gì nữa :)
        </Button>
      </Box>
    </Box>
  );
};
