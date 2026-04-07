import { useState, useEffect } from "react";
import { ophimService, Movie, SearchResponse } from "@services/ophimService";

interface UseMoviesReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const useMovies = (
  fetchFunction: (page: number) => Promise<SearchResponse>,
  initialPage = 1,
): UseMoviesReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await fetchFunction(currentPage);
        setMovies(data.items);
        setTotalPages(data.pagination?.pageRanges || 1);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tải dữ liệu");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentPage, fetchFunction]);

  return {
    movies,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
  };
};

export const useSearchMovies = (
  query: string,
  initialPage = 1,
): UseMoviesReturn => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await ophimService.searchMovies(query, currentPage);
        setMovies(data.items);
        setTotalPages(data.pagination?.pageRanges || 1);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi khi tìm kiếm");
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [query, currentPage]);

  return {
    movies,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
  };
};
