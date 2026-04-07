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
} from "@mui/material";
import { ophimService, MovieDetail, Episode } from "@services/ophimService";

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

        {/* Episode Selection */}
        {currentServerEpisodes.length > 1 && (
          <FormControl
            size="small"
            sx={{ minWidth: "200px" }}
            variant="outlined"
          >
            <InputLabel>Tập</InputLabel>
            <Select
              value={selectedEpisode?.name || ""}
              onChange={(e) => {
                const episode = currentServerEpisodes.find(
                  (ep) => ep.name === e.target.value,
                );
                if (episode) {
                  setSelectedEpisode(episode);
                }
              }}
              label="Tập"
            >
              {currentServerEpisodes.map((ep) => (
                <MenuItem key={ep.name} value={ep.name}>
                  {ep.name}
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
      </CardContent>
    </Card>
  );
};
