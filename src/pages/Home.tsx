import { FeaturedMovie } from "@components/FeaturedMovie";
import { MovieList } from "@components/MovieList";
import { useMovies, useSearchMovies } from "@hooks/useMovies";
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Movie, ophimService } from "@services/ophimService";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type MovieCategory =
  | "home"
  | "nowPlaying"
  | "popular"
  | "topRated"
  | "upcoming";

const MOVIE_CATEGORIES = [
  { key: "home", label: "🏠 Nhà tình thương" },
] as const;

export const Home: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<MovieCategory>("home");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [homeMovies, setHomeMovies] = useState<Movie[]>([]);
  const [homeLoading, setHomeLoading] = useState(true);
  const [homeError, setHomeError] = useState<string | null>(null);
  const [allCategoryMovies, setAllCategoryMovies] = useState<Movie[]>([]);
  const [homeMoviesPaginated, setHomeMoviesPaginated] = useState<Movie[]>([]);
  const [homeTotalPages, setHomeTotalPages] = useState<number>(1);

  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  const [filterGenres, setFilterGenres] = useState<
    Array<{ slug: string; name: string }>
  >([]);
  const [filterCountries, setFilterCountries] = useState<
    Array<{ slug: string; name: string }>
  >([]);

  // Xử lý query parameters từ URL
  useEffect(() => {
    const genreParam = searchParams.get("genre");
    const countryParam = searchParams.get("country");

    if (genreParam) {
      setSelectedGenre(genreParam);
      setCurrentPage(1);
      setAllCategoryMovies([]);
    } else if (countryParam) {
      setSelectedCountry(countryParam);
      setCurrentPage(1);
      setAllCategoryMovies([]);
    }
  }, [searchParams]);

  // Gọi API home khi component lần đầu mount
  useEffect(() => {
    const fetchHome = async () => {
      try {
        setHomeLoading(true);
        const data = await ophimService.getHome();
        const genres = await ophimService.getGenres();
        const countries = await ophimService.getCountries();

        setHomeMovies(data.items);
        setHomeMoviesPaginated(data.items);
        setFilterGenres(genres);
        setFilterCountries(countries);
        setHomeTotalPages(data.params?.pagination?.pageRanges || 1);
        setCurrentPage(1);
        setHomeError(null);
      } catch (error) {
        setHomeError(
          error instanceof Error ? error.message : "Lỗi khi tải trang chủ",
        );
        setHomeMovies([]);
      } finally {
        setHomeLoading(false);
      }
    };

    if (category === "home") {
      fetchHome();
    }
  }, [category]);

  // Gọi API danh sách phim mới cập nhật khi loadMore trên home
  useEffect(() => {
    const fetchHomeMore = async () => {
      if (category === "home" && currentPage > 1) {
        try {
          setHomeLoading(true);
          // Gọi API danh sách phim mới cập nhật: https://ophim1.com/v1/api/danh-sach/phim-moi-cap-nhat?page=X
          const response = await ophimService.getNewMovies(currentPage);
          const items = response.items || [];
          setHomeMoviesPaginated((prev) => [...prev, ...items]);
          setHomeTotalPages(response.pagination?.pageRanges || 1);
        } catch (error) {
          console.error("Lỗi tải phim home:", error);
        } finally {
          setHomeLoading(false);
        }
      }
    };

    if (category === "home") {
      fetchHomeMore();
    }
  }, [category, currentPage]);

  // Xử lý khi thay đổi filter thể loại hoặc quốc gia
  useEffect(() => {
    if (selectedGenre) {
      setCurrentPage(1);
      setAllCategoryMovies([]);
      navigate(`/the-loai/${selectedGenre}`);
    }
    if (selectedCountry) {
      setCurrentPage(1);
      setAllCategoryMovies([]);
      navigate(`/quoc-gia/${selectedCountry}`);
    }
  }, [selectedGenre, selectedCountry, navigate]);

  const getCategoryFunction = useCallback(
    (cat: MovieCategory) => {
      // // Ưu tiên filter theo thể loại hoặc quốc gia
      // if (selectedGenre) {
      //   return (page: number = 1) =>
      //     ophimService.getMoviesByGenre(selectedGenre, page);
      // }
      // if (selectedCountry) {
      //   return (page: number = 1) =>
      //     ophimService.getMoviesByCountry(selectedCountry, page);
      // }

      switch (cat) {
        case "nowPlaying":
          return ophimService.getNowPlaying;
        case "topRated":
          return ophimService.getTopRated;
        case "upcoming":
          return ophimService.getUpcoming;
        case "home":
          return async () => ({
            items: homeMovies,
            pagination: {
              totalItems: homeMovies.length,
              totalItemsPerPage: homeMovies.length,
              currentPage: 1,
              pageRanges: 1,
            },
          });
        default:
          return ophimService.getPopular;
      }
    },
    [homeMovies, selectedGenre, selectedCountry],
  );

  const {
    movies: searchMovies,
    loading: searchLoading,
    error: searchError,
    totalPages: searchTotalPages,
  } = useSearchMovies(searchQuery, currentPage);

  const {
    movies: categoryMovies,
    loading: categoryLoading,
    error: categoryError,
    totalPages: categoryTotalPages,
  } = useMovies(getCategoryFunction(category), currentPage);

  // Cập nhật allCategoryMovies khi fetch category movies mới
  useEffect(() => {
    if (category !== "home" && !isSearching) {
      if (currentPage === 1) {
        setAllCategoryMovies(categoryMovies);
      } else {
        // Append movies khi load thêm
        setAllCategoryMovies((prev) => [
          ...prev,
          ...categoryMovies.filter(
            (m) => !prev.some((existing) => existing.slug === m.slug),
          ),
        ]);
      }
    }
  }, [categoryMovies, category, isSearching, currentPage]);

  const isSearchActive = searchQuery.trim().length > 0;
  const displayMovies = isSearchActive
    ? searchMovies
    : category === "home"
      ? homeMoviesPaginated
      : allCategoryMovies;
  const loading = isSearchActive
    ? searchLoading
    : category === "home"
      ? homeLoading
      : categoryLoading;
  const error = isSearchActive
    ? searchError
    : category === "home"
      ? homeError
      : categoryError;
  const totalPages = isSearchActive
    ? searchTotalPages
    : category === "home"
      ? homeTotalPages
      : categoryTotalPages;

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
    setIsSearching(!isSearching);
  };

  const handleCategoryChange = (newCategory: MovieCategory) => {
    if (category !== newCategory) {
      setCategory(newCategory);
      setCurrentPage(1);
      setSearchQuery("");
      setIsSearching(false);
      setAllCategoryMovies([]);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const featuredMovie =
    category === "home" && displayMovies.length > 0 ? displayMovies[0] : null;

  return (
    <>
      {/* Spotlight - chỉ hiển thị trên home */}
      {category === "home" && featuredMovie && (
        <FeaturedMovie movie={featuredMovie} />
      )}
      <Box
        component="form"
        onSubmit={handleSearch}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            width: { xs: "100%", sm: "500px" },
          }}
        >
          <TextField
            fullWidth
            placeholder="Tìm kiếm phim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
          />
          {/* <Button type="submit" variant="contained">
            {searchLoading ? <CircularProgress size={24} /> : "Tìm"}
          </Button> */}
        </Box>
      </Box>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Tìm kiếm */}

        {/* Danh mục (ẩn khi đang tìm kiếm) */}
        {!isSearchActive && (
          <Box sx={{ mb: 4 }}>
            {/* Category + Filters inline on one row (responsive) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                alignItems: "center",
              }}
            >
              <ButtonGroup
                variant="outlined"
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  "& .MuiButton-root": {
                    textTransform: "none",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    borderRadius: "8px",
                  },
                  mr: 1,
                }}
              >
                {MOVIE_CATEGORIES.map((cat) => (
                  <Button
                    key={cat.key}
                    variant={category === cat.key ? "contained" : "outlined"}
                    onClick={() =>
                      handleCategoryChange(cat.key as MovieCategory)
                    }
                  >
                    {cat.label}
                  </Button>
                ))}
              </ButtonGroup>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  width: { xs: "100%", sm: "auto" },
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Thể Loại</InputLabel>
                  <Select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    label="Thể Loại"
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="">
                      <em>Tất cả</em>
                    </MenuItem>
                    {filterGenres.map((genre) => (
                      <MenuItem key={genre.slug} value={genre.slug}>
                        {genre.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Quốc Gia</InputLabel>
                  <Select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    label="Quốc Gia"
                    sx={{ borderRadius: "8px" }}
                  >
                    <MenuItem value="">
                      <em>Tất cả</em>
                    </MenuItem>
                    {filterCountries.map((country) => (
                      <MenuItem key={country.slug} value={country.slug}>
                        {country.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        )}

        {/* Danh sách phim chính */}
        <MovieList
          movies={displayMovies}
          loading={loading}
          error={error}
          totalPages={35094}
          currentPage={currentPage}
          onPageChange={handleLoadMore}
          showLoadMore={true}
        />
      </Container>
    </>
  );
};
