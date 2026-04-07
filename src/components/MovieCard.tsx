import { useNavigate } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Movie } from "@services/ophimService";
import { getImageUrl } from "@utils/imageUtils";

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const posterUrl = getImageUrl(movie.poster_url || movie.thumb_url);

  const handleCardClick = () => {
    navigate(`/movie/${movie.slug}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 6,
        },
        cursor: "pointer",
      }}
    >
      <CardMedia
        component="img"
        height="300"
        image={posterUrl}
        alt={movie.name}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{ minHeight: "2.5em" }}
        >
          {movie.name}
        </Typography>
        <Box sx={{ mb: 1 }}>
          {movie.year && (
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              Năm: {movie.year}
            </Typography>
          )}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip label={movie.lang} color="primary" size="small" />
            {movie.episode_current && (
              <Typography variant="caption" color="textSecondary">
                {movie.episode_current}
              </Typography>
            )}
          </Box>
        </Box>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          Thời gian: {movie.time}
        </Typography>
      </CardContent>
    </Card>
  );
};
