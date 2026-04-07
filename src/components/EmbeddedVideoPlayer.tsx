import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { ophimService, MovieDetail, Episode } from "@services/ophimService";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

interface EmbeddedVideoPlayerProps {
  movieSlug: string;
  movieTitle: string;
}

export const EmbeddedVideoPlayer: React.FC<EmbeddedVideoPlayerProps> = ({
  movieSlug,
  movieTitle,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedServer, setSelectedServer] = useState<string>("1");

  // Load movie detail khi component mount
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const detail = await ophimService.getMovieDetail(movieSlug);
        if (detail && detail.episodes.length > 0) {
          setMovieDetail(detail);
          // Select first episode of first server
          if (
            detail.episodes[0]?.server_data &&
            detail.episodes[0].server_data.length > 0
          ) {
            setSelectedEpisode(detail.episodes[0].server_data[0]);
            setSelectedServer(detail.episodes[0].server_name || "1");
          }
          setError(null);
        } else {
          setError("Không tìm thấy phim hoặc không có tập phim nào");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Lỗi khi tải chi tiết phim",
        );
      } finally {
        setLoading(false);
      }
    };

    if (movieSlug) {
      fetchDetail();
    }
  }, [movieSlug]);

  if (loading) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  const currentServerEpisodes =
    movieDetail?.episodes.find((ep) => ep.server_name === selectedServer)
      ?.server_data || [];

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          {movieTitle}
        </Typography>

        {/* Video Player */}
        {selectedEpisode && (
          <Box sx={{ mb: 3 }}>
            <Box
              component="iframe"
              src={selectedEpisode.link_embed}
              sx={{
                width: "100%",
                height: "500px",
                border: "none",
                borderRadius: 1,
                mb: 2,
              }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </Box>
        )}

        {/* Server Selection */}
        {movieDetail && movieDetail.episodes.length > 1 && (
          <FormControl
            size="small"
            sx={{ mb: 2, minWidth: "200px", mr: 2 }}
            variant="outlined"
          >
            <InputLabel>Server</InputLabel>
            <Select
              value={selectedServer}
              onChange={(e) => {
                setSelectedServer(e.target.value);
                const newEpisodes = movieDetail.episodes.find(
                  (ep) => ep.server_name === e.target.value,
                )?.server_data;
                if (newEpisodes && newEpisodes.length > 0) {
                  setSelectedEpisode(newEpisodes[0]);
                }
              }}
              label="Server"
            >
              {movieDetail.episodes.map((ep) => (
                <MenuItem key={ep.server_name} value={ep.server_name}>
                  {ep.server_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Episode Info */}
        {selectedEpisode && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Đang xem: <strong>{selectedEpisode.name}</strong> - Server:{" "}
            <strong>{selectedServer}</strong>
          </Typography>
        )}

        {/* Episode Selection */}
        {currentServerEpisodes.length > 1 && (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              mt: 2,
            }}
          >
            {currentServerEpisodes.map((ep) => {
              const isActive = selectedEpisode?.name === ep.name;

              return (
                <Button
                  key={ep.name}
                  variant="contained"
                  size="medium"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => setSelectedEpisode(ep)}
                  sx={{
                    textTransform: "none",
                    borderRadius: "8px",
                    minWidth: "120px",
                    padding: "10px 20px",
                    fontSize: "0.95rem",
                    fontWeight: 500,

                    backgroundColor: isActive ? "#ffd567" : "#2a2e3b",
                    color: isActive ? "#1a1a1a" : "#fff",

                    "&:hover": {
                      backgroundColor: isActive ? "#ffca3a" : "#3d4454",
                    },

                    boxShadow: "none",
                  }}
                >
                  {ep.name}
                </Button>
              );
            })}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
