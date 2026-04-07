import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ophimService, Movie } from "@services/ophimService";
import { EmbeddedVideoPlayer } from "@components/EmbeddedVideoPlayer";
import { getImageUrl } from "@utils/imageUtils";

export const MovieDetail: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const movieData = await ophimService.getMovieDetail(movieId);
        if (movieData) {
          setMovie(movieData.item);
          setError(null);
        } else {
          setError("Không tìm thấy phim");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Lỗi khi tải thông tin phim",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>
        <Typography color="error">{error || "Không tìm thấy phim"}</Typography>
      </Container>
    );
  }

  const posterUrl = getImageUrl(movie.poster_url || movie.thumb_url);
  const thumbUrl = getImageUrl(movie.thumb_url);

  return (
    <Box sx={{ pb: 4 }}>
      {thumbUrl && (
        <Box
          sx={{
            width: "100%",
            height: "400px",
            backgroundImage: `url(${thumbUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            mb: 3,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        />
      )}

      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Quay lại
        </Button>

        {/* Video Player Section - Full Width */}
        <Box sx={{ mb: 4 }}>
          <EmbeddedVideoPlayer movieSlug={movie.slug} movieTitle={movie.name} />
        </Box>

        {/* Info Section - 2 Columns */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "300px 1fr" },
            gap: 3,
          }}
        >
          {posterUrl && (
            <Card>
              <Box
                component="img"
                src={posterUrl}
                alt={movie.name}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 1,
                }}
              />
            </Card>
          )}

          <Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                {movie.name}
              </Typography>
              {movie.origin_name && (
                <Typography
                  variant="body1"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  {movie.origin_name}
                </Typography>
              )}
            </Box>

            {movie.content && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Nội dung
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {movie.content}
                </Typography>
              </Box>
            )}

            {movie.category && movie.category.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Thể loại
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {movie.category.map((cat) => (
                    <Chip key={cat.id} label={cat.name} />
                  ))}
                </Box>
              </Box>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 3,
              }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Năm phát hành
                  </Typography>
                  <Typography variant="body1">{movie.year || "N/A"}</Typography>
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Trạng thái
                  </Typography>
                  <Typography variant="body1">
                    {movie.status || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 3,
              }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Số tập
                  </Typography>
                  <Typography variant="body1">
                    {movie.episode_current || "N/A"} /{" "}
                    {movie.episode_total || "?"}
                  </Typography>
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Chất lượng
                  </Typography>
                  <Typography variant="body1">
                    {movie.quality || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {movie.director && movie.director.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Đạo diễn
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {movie.director.map((dir, idx) => (
                    <Chip key={idx} label={dir} />
                  ))}
                </Box>
              </Box>
            )}

            {movie.actor && movie.actor.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Diễn viên
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {movie.actor.slice(0, 10).map((actor, idx) => (
                    <Chip key={idx} label={actor} />
                  ))}
                </Box>
              </Box>
            )}

            {movie.country && movie.country.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Quốc gia
                </Typography>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {movie.country.map((country) => (
                    <Chip key={country.id} label={country.name} />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};
