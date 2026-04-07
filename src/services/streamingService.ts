import axios from "axios";

// Consumet API - Một API aggregator hỗ trợ nhiều nguồn streaming
const CONSUMET_BASE_URL = "https://api.consumet.org/movies/flixhq";

export interface StreamSource {
  id: string;
  url: string;
  quality: string;
  isM3u8?: boolean;
}

export interface StreamingData {
  episodeId: string;
  sources: StreamSource[];
  subtitles: Array<{
    lang: string;
    url: string;
  }>;
}

export interface MovieSearchResult {
  id: string;
  title: string;
  url: string;
  image: string;
  releaseDate?: string;
  type?: string;
}

export const streamingService = {
  // Tìm kiếm phim trên nguồn streaming
  searchMovie: async (query: string): Promise<MovieSearchResult[]> => {
    try {
      const response = await axios.get(`${CONSUMET_BASE_URL}/search`, {
        params: { query },
        timeout: 10000,
      });
      return response.data.results || [];
    } catch (error) {
      console.error("Lỗi tìm kiếm phim:", error);
      return [];
    }
  },

  // Lấy thông tin phim chi tiết (bao gồm link xem)
  getMovieInfo: async (movieId: string): Promise<MovieSearchResult | null> => {
    try {
      const response = await axios.get(`${CONSUMET_BASE_URL}/info`, {
        params: { id: movieId },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy thông tin phim:", error);
      return null;
    }
  },

  // Lấy link phát phim (streaming link)
  getStreamingLink: async (
    episodeId: string,
  ): Promise<StreamingData | null> => {
    try {
      const response = await axios.get(`${CONSUMET_BASE_URL}/watch`, {
        params: { episodeId },
        timeout: 10000,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy link streaming:", error);
      return null;
    }
  },
};
