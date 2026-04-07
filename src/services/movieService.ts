import axios from "axios";

const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMGUyNTNhYzEyZTUxYmE1NTNmOTJkYjJmMmU5NTM5OCIsIm5iZiI6MTc3NTQ0MzI4NC40NDQsInN1YiI6IjY5ZDMxZDU0MDRjYzQ0YWI0ZDVjNjVmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.HH-lmIMJHgBcyE372tKBr6bvpYirD-95jv2a74_qn7M";
const BASE_URL = "https://api.themoviedb.org/3";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json;charset=utf-8",
  },
});

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  popularity: number;
  genre_ids?: number[];
  original_language?: string;
}

export interface MovieDetails extends Movie {
  genres: Array<{ id: number; name: string }>;
  runtime: number;
  budget: number;
  revenue: number;
  production_countries: Array<{ iso_3166_1: string; name: string }>;
  spoken_languages: Array<{ iso_639_1: string; name: string }>;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface GenreResponse {
  genres: Genre[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface VideoResponse {
  results: Video[];
}

export const movieService = {
  getNowPlaying: async (page = 1): Promise<MovieResponse> => {
    const response = await apiClient.get("/movie/now_playing", {
      params: { page, language: "vi-VN" },
    });
    return response.data;
  },

  getPopular: async (page = 1): Promise<MovieResponse> => {
    const response = await apiClient.get("/movie/popular", {
      params: { page, language: "vi-VN" },
    });
    return response.data;
  },

  getTopRated: async (page = 1): Promise<MovieResponse> => {
    const response = await apiClient.get("/movie/top_rated", {
      params: { page, language: "vi-VN" },
    });
    return response.data;
  },

  getUpcoming: async (page = 1): Promise<MovieResponse> => {
    const response = await apiClient.get("/movie/upcoming", {
      params: { page, language: "vi-VN" },
    });
    return response.data;
  },

  searchMovies: async (
    query: string,
    page = 1,
    genreId?: number,
  ): Promise<MovieResponse> => {
    const response = await apiClient.get("/search/movie", {
      params: {
        query,
        page,
        language: "vi-VN",
        ...(genreId && { with_genres: genreId }),
      },
    });
    return response.data;
  },

  getMoviesByGenre: async (
    genreId: number,
    page = 1,
  ): Promise<MovieResponse> => {
    const response = await apiClient.get("/discover/movie", {
      params: {
        page,
        language: "vi-VN",
        with_genres: genreId,
      },
    });
    return response.data;
  },

  getMovieVideos: async (movieId: number): Promise<VideoResponse> => {
    const response = await apiClient.get(`/movie/${movieId}/videos`, {
      params: { language: "vi-VN" },
    });
    return response.data;
  },
  getGenres: async (): Promise<GenreResponse> => {
    const response = await apiClient.get("/genre/movie/list", {
      params: { language: "vi-VN" },
    });
    return response.data;
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await apiClient.get(`/movie/${movieId}`, {
      params: { language: "vi-VN" },
    });
    return response.data;
  },
};
