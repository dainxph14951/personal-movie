import { MovieList } from "@/components/MovieList";
import { Container } from "@mui/material";
import { ophimService, Movie } from "@services/ophimService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Genres: React.FC = () => {
  const { slug } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genreName, setGenreName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchMoviesByGenre = async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);

      const response: any = await ophimService.getMoviesByGenre(
        slug,
        currentPage,
      );

      const items = response.items || [];

      // Nếu đang ở trang 1 thì ghi mới, các trang sau append
      if (currentPage === 1) {
        setMovies(items);
      } else {
        setMovies((prev) => [...prev, ...items]);
      }

      // Một số endpoint có thể không trả pageRanges; tính dự phòng từ totalItems / totalItemsPerPage
      const pageRanges =
        response.pagination?.pageRanges ||
        (response.pagination &&
        response.pagination.totalItems &&
        response.pagination.totalItemsPerPage
          ? Math.max(
              1,
              Math.ceil(
                response.pagination.totalItems /
                  response.pagination.totalItemsPerPage,
              ),
            )
          : 1);

      setTotalPages(pageRanges);
      setGenreName(response?.breadCrumb?.[0]?.name || slug);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Lỗi khi tải phim theo thể loại",
      );
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoviesByGenre();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, currentPage]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container maxWidth="xl">
      <h2>Phim {genreName}</h2>
      <MovieList
        movies={movies}
        loading={loading}
        error={error}
        totalPages={1995}
        currentPage={currentPage}
        onPageChange={onPageChange}
        showLoadMore={false}
      />
    </Container>
  );
};

export default Genres;
