import { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { movieService } from "@services/movieService";

interface FilterPanelProps {
  onGenreChange: (genreId: number | "") => void;
  selectedGenre: number | "";
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  onGenreChange,
  selectedGenre,
}) => {
  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const data = await movieService.getGenres();
        setGenres(data.genres || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tải thể loại");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (error) {
    return <Box sx={{ color: "error.main", mb: 2 }}>{error}</Box>;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <FormControl fullWidth size="small" disabled={loading}>
        <InputLabel>Thể loại</InputLabel>
        <Select
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value as number | "")}
          label="Thể loại"
          startAdornment={
            loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : undefined
          }
        >
          <MenuItem value="">Tất cả thể loại</MenuItem>
          {genres.map((genre) => (
            <MenuItem key={genre.id} value={genre.id}>
              {genre.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
