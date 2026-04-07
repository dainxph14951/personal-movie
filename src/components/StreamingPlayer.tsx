import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  IconButton,
  CircularProgress,
  Typography,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import {
  ophimService,
  SearchResult,
  MovieDetail,
  Episode,
} from "@services/ophimService";

// Hàm convert tiếng Việt có dấu thành không dấu
const removeAccents = (str: string): string => {
  const accents: { [key: string]: string } = {
    á: "a",
    à: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ắ: "a",
    ằ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ấ: "a",
    ầ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    đ: "d",
    é: "e",
    è: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ế: "e",
    ề: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    í: "i",
    ì: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ó: "o",
    ò: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ố: "o",
    ồ: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ớ: "o",
    ờ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ú: "u",
    ù: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ứ: "u",
    ừ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ý: "y",
    ỳ: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
  };

  return str
    .toLowerCase()
    .split("")
    .map((char) => accents[char] || char)
    .join("");
};

// Hàm convert tên phim thành slug
const generateSlug = (title: string): string => {
  return removeAccents(title)
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
};

interface StreamingPlayerProps {
  movieId: string;
  movieTitle: string;
  buttonLabel?: string;
}

export const StreamingPlayer: React.FC<StreamingPlayerProps> = ({
  movieTitle,
  buttonLabel = "Xem Phim",
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<SearchResult | null>(null);
  const [movieDetail, setMovieDetail] = useState<MovieDetail | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState<string>("");

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    setError(null);

    try {
      const slug = generateSlug(movieTitle);
      const detail = await ophimService.getMovieDetail(slug);

      if (detail && detail.episodes && detail.episodes.length > 0) {
        setMovieDetail(detail);
        setSelectedMovie({
          _id: slug,
          name: movieTitle,
          slug: slug,
        });
        const firstEpisode = detail.episodes[0].server_data[0];
        handleSelectEpisode(firstEpisode);
      } else {
        setError(
          `Không tìm thấy phim "${movieTitle}" trên OPhim. Hãy tìm kiếm phim khác!`,
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Lỗi khi tải phim. Hãy thử tìm kiếm!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    resetState();
  };

  const resetState = () => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedMovie(null);
    setMovieDetail(null);
    setSelectedEpisode(null);
    setSelectedServerIndex(0);
    setCurrentEmbedUrl("");
    setError(null);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSearchResults([]);
    setSelectedMovie(null);
    setMovieDetail(null);

    try {
      const response = await ophimService.searchMovies(searchQuery);

      if (!response.items || response.items.length === 0) {
        setError(`Không tìm thấy phim: "${searchQuery}". Hãy thử tên khác!`);
        return;
      }

      setSearchResults(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi tìm kiếm phim");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = async (movie: SearchResult) => {
    setSelectedMovie(movie);
    setMovieDetail(null);
    setSelectedEpisode(null);
    setCurrentEmbedUrl("");
    setError(null);
    setLoading(true);

    try {
      const detail = await ophimService.getMovieDetail(movie.slug);

      if (detail && detail.episodes && detail.episodes.length > 0) {
        setMovieDetail(detail);
        const firstEpisode = detail.episodes[0].server_data[0];
        handleSelectEpisode(firstEpisode);
      } else {
        setError("Không tìm thấy episodes");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi tải phim");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEpisode = (episode: Episode) => {
    setSelectedEpisode(episode);
    const embedUrl = ophimService.getEpisodeLink(episode);
    setCurrentEmbedUrl(embedUrl);
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        startIcon={<PlayArrowIcon />}
        onClick={handleOpen}
        size="small"
      >
        {buttonLabel}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Xem phim từ OPhim
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ color: "inherit" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {/* Loading khi tự động tìm phim */}
          {loading && !selectedMovie && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "400px",
                gap: 2,
              }}
            >
              <CircularProgress />
              <Typography>Đang tìm kiếm "{movieTitle}"...</Typography>
            </Box>
          )}

          {/* Lỗi nếu không tìm thấy - hiển thị tìm kiếm thay thế */}
          {error && !selectedMovie && !currentEmbedUrl && (
            <Box>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Typography variant="body2" sx={{ mb: 2, fontWeight: 500 }}>
                Tìm kiếm phim khác:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tên phim..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  sx={{ minWidth: "120px" }}
                  disabled={loading}
                >
                  Tìm
                </Button>
              </Box>

              {searchResults.length > 0 && !loading && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Kết quả tìm kiếm ({searchResults.length}):
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {searchResults.slice(0, 10).map((result) => (
                      <Button
                        key={result._id}
                        variant="outlined"
                        onClick={() => handleSelectMovie(result)}
                        sx={{
                          textAlign: "left",
                          justifyContent: "flex-start",
                          p: 1.5,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {result.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {result.origin_name && `(${result.origin_name})`}{" "}
                            {result.year && ` - ${result.year}`}{" "}
                            {result.episode_current &&
                              `[${result.episode_current}]`}
                          </Typography>
                        </Box>
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Tìm kiếm phim */}
          {!selectedMovie && !currentEmbedUrl && !loading && !error && (
            <Box>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tên phim..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={handleSearch}
                  sx={{ minWidth: "120px" }}
                  disabled={loading}
                >
                  Tìm
                </Button>
              </Box>

              {searchResults.length > 0 && !loading && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Kết quả tìm kiếm ({searchResults.length}):
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {searchResults.slice(0, 10).map((result) => (
                      <Button
                        key={result._id}
                        variant="outlined"
                        onClick={() => handleSelectMovie(result)}
                        sx={{
                          textAlign: "left",
                          justifyContent: "flex-start",
                          p: 1.5,
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {result.name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {result.origin_name && `(${result.origin_name})`}{" "}
                            {result.year && ` - ${result.year}`}{" "}
                            {result.episode_current &&
                              `[${result.episode_current}]`}
                          </Typography>
                        </Box>
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Chọn tập phim */}
          {selectedMovie && !currentEmbedUrl && movieDetail && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label="← Quay lại"
                  onClick={() => {
                    setSelectedMovie(null);
                    setMovieDetail(null);
                    setError(null);
                  }}
                  sx={{ mb: 1 }}
                />
                <Typography variant="h6">{selectedMovie.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {selectedMovie.origin_name}{" "}
                  {selectedMovie.year && `(${selectedMovie.year})`}
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}

              {movieDetail.episodes.length > 0 && !loading && (
                <Box>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Chọn server</InputLabel>
                    <Select
                      value={selectedServerIndex}
                      label="Chọn server"
                      onChange={(e) =>
                        setSelectedServerIndex(e.target.value as number)
                      }
                    >
                      {movieDetail.episodes.map((server, idx) => (
                        <MenuItem key={idx} value={idx}>
                          {server.server_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                    Danh sách tập:
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(80px, 1fr))",
                      gap: 1,
                    }}
                  >
                    {movieDetail.episodes[selectedServerIndex]?.server_data.map(
                      (episode) => (
                        <Button
                          key={episode.slug}
                          variant={
                            selectedEpisode?.slug === episode.slug
                              ? "contained"
                              : "outlined"
                          }
                          size="small"
                          onClick={() => handleSelectEpisode(episode)}
                        >
                          {episode.name}
                        </Button>
                      ),
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}

          {/* Xem video */}
          {currentEmbedUrl && (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label="← Quay lại tập"
                  onClick={() => {
                    setCurrentEmbedUrl("");
                    setSelectedEpisode(null);
                  }}
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2">
                  {selectedMovie?.name} - {selectedEpisode?.name}
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                sx={{
                  paddingBottom: "56.25%",
                  position: "relative",
                  height: 0,
                  mb: 2,
                }}
              >
                <iframe
                  title={selectedEpisode?.filename}
                  width="100%"
                  height="100%"
                  src={currentEmbedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              </Box>

              {movieDetail &&
                movieDetail.episodes[selectedServerIndex]?.server_data.length >
                  1 && (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Danh sách tập khác:
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(80px, 1fr))",
                        gap: 1,
                      }}
                    >
                      {movieDetail.episodes[
                        selectedServerIndex
                      ]?.server_data.map((episode) => (
                        <Button
                          key={episode.slug}
                          variant={
                            selectedEpisode?.slug === episode.slug
                              ? "contained"
                              : "outlined"
                          }
                          size="small"
                          onClick={() => handleSelectEpisode(episode)}
                        >
                          {episode.name}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}
            </Box>
          )}

          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: "block", mt: 2 }}
          >
            ⚠️ Lưu ý: Dự án cá nhân học tập. Tuân thủ quy định bản quyền!
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};
