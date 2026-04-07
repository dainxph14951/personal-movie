import axios from "axios";

const API_BASE_URL = "https://ophim1.com/v1/api";

// Utility function để convert Vietnamese text thành slug
const slugify = (text: string): string => {
  const vietnameseMap: { [key: string]: string } = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ằ: "a",
    ắ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ầ: "a",
    ấ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    đ: "d",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ề: "e",
    ế: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ồ: "o",
    ố: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ờ: "o",
    ớ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ừ: "u",
    ứ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
  };

  let result = text.toLowerCase();

  // Replace Vietnamese characters
  for (const [char, replacement] of Object.entries(vietnameseMap)) {
    result = result.replace(new RegExp(char, "g"), replacement);
  }

  // Replace spaces and special characters with hyphens
  result = result.replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");

  // Remove consecutive hyphens
  result = result.replace(/\-+/g, "-").replace(/^\-|\-$/g, "");

  return result;
};

// Interfaces
export interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface EpisodeServer {
  server_name: string;
  server_data: Episode[];
}

export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name?: string;
  content?: string;
  poster_url?: string;
  thumb_url?: string;
  year?: number;
  type?: string;
  status?: string;
  episode_current?: string;
  episode_total?: string;
  quality?: string;
  lang?: string;
  actor?: string[];
  director?: string[];
  category?: Array<{ id: string; name: string }>;
  country?: Array<{ id: string; name: string }>;
  episodes?: EpisodeServer[];
  time?: number;
}

// Alias for backward compatibility
export type MovieItem = Movie;

export interface OphimResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface MovieDetail {
  item: MovieItem;
  episodes: EpisodeServer[];
}

export interface SearchResult {
  _id: string;
  name: string;
  slug: string;
  origin_name?: string;
  poster_url?: string;
  thumb_url?: string;
  year?: number;
  episode_current?: string;
}

export interface SearchResponse {
  items: SearchResult[];
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    pageRanges: number;
  };
}

export interface HomeResponse {
  items: Movie[];
  params?: {
    type_slug: string;
    filterCategory: Array<string>;
    filterCountry: Array<string>;
    filterYear: string;
    sortField: string;
    pagination: {
      totalItems: number;
      totalItemsPerPage: number;
      currentPage: number;
      pageRanges: number;
    };
    itemsUpdateInDay: number;
    totalSportsVideos: number;
    itemsSportsVideosUpdateInDay: number;
  };
}

export const ophimService = {
  // Lấy trang chủ (danh sách phim mới cập nhật)
  getHome: async (): Promise<HomeResponse> => {
    try {
      const response = await axios.get<OphimResponse<HomeResponse>>(
        `${API_BASE_URL}/home`,
        {
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          params: {
            type_slug: "danh-sach",
            filterCategory: [],
            filterCountry: [],
            filterYear: "",
            sortField: "",
            pagination: {
              totalItems: 0,
              totalItemsPerPage: 0,
              currentPage: 1,
              pageRanges: 1,
            },
            itemsUpdateInDay: 0,
            totalSportsVideos: 0,
            itemsSportsVideosUpdateInDay: 0,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi lấy trang chủ:", error);
      return {
        items: [],
        params: {
          type_slug: "danh-sach",
          filterCategory: [],
          filterCountry: [],
          filterYear: "",
          sortField: "",
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
          itemsUpdateInDay: 0,
          totalSportsVideos: 0,
          itemsSportsVideosUpdateInDay: 0,
        },
      };
    }
  },

  // Nút phim lẻ mới cập nhật
  getNowPlaying: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await axios.get<OphimResponse<SearchResponse>>(
        `${API_BASE_URL}/danh-sach/phim-le`,
        {
          params: { page },
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi lấy phim lẻ mới:", error);
      return {
        items: [],
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 0,
          currentPage: 1,
          pageRanges: 1,
        },
      };
    }
  },

  // Phim xem nhiều
  getPopular: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await axios.get<OphimResponse<SearchResponse>>(
        `${API_BASE_URL}/danh-sach/phim-bo`,
        {
          params: { page },
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi lấy phim phổ biến:", error);
      return {
        items: [],
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 0,
          currentPage: 1,
          pageRanges: 1,
        },
      };
    }
  },

  // Phim lẻ xếp hạng cao (tối tân)
  getTopRated: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await axios.get<OphimResponse<SearchResponse>>(
        `${API_BASE_URL}/danh-sach/phim-le`,
        {
          params: { page },
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi lấy phim xếp hạng cao:", error);
      return {
        items: [],
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 0,
          currentPage: 1,
          pageRanges: 1,
        },
      };
    }
  },

  // Phim bộ sắp chiếu
  getUpcoming: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await axios.get<OphimResponse<SearchResponse>>(
        `${API_BASE_URL}/danh-sach/phim-bo`,
        {
          params: { page },
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi lấy phim sắp chiếu:", error);
      return {
        items: [],
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 0,
          currentPage: 1,
          pageRanges: 1,
        },
      };
    }
  },

  // Tìm kiếm phim theo keyword
  searchMovies: async (
    keyword: string,
    page: number = 1,
  ): Promise<SearchResponse> => {
    try {
      const response = await axios.get<OphimResponse<SearchResponse>>(
        `${API_BASE_URL}/danh-sach/phim-bo`,
        {
          params: { keyword, page },
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi tìm kiếm phim:", error);
      return {
        items: [],
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 0,
          currentPage: 1,
          pageRanges: 1,
        },
      };
    }
  },

  // Lấy chi tiết phim (bao gồm episodes)
  getMovieDetail: async (slug: string): Promise<MovieDetail | null> => {
    try {
      const response = await axios.get<OphimResponse<MovieDetail>>(
        `${API_BASE_URL}/phim/${slug}`,
        {
          timeout: 10000,
        },
      );

      if (response.data.data) {
        return {
          item: response.data.data.item,
          episodes: response.data.data.item.episodes || [],
        };
      }
      return null;
    } catch (error) {
      console.error("Lỗi lấy chi tiết phim:", error);
      return null;
    }
  },

  // Danh sách phim bộ (có phân trang)
  getSeriesList: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await axios.get<OphimResponse<SearchResponse>>(
        `${API_BASE_URL}/danh-sach/phim-bo`,
        {
          params: { page },
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi lấy danh sách phim bộ:", error);
      return {
        items: [],
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 0,
          currentPage: 1,
          pageRanges: 1,
        },
      };
    }
  },

  // Danh sách phim lẻ (có phân trang)
  getMovieList: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await axios.get<OphimResponse<SearchResponse>>(
        `${API_BASE_URL}/danh-sach/phim-le`,
        {
          params: { page },
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi lấy danh sách phim lẻ:", error);
      return {
        items: [],
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 0,
          currentPage: 1,
          pageRanges: 1,
        },
      };
    }
  },

  // Lấy embed link của 1 tập
  getEpisodeLink: (episode: Episode): string => {
    return episode.link_embed;
  },

  // Lấy m3u8 link của 1 tập (nếu cần)
  getM3u8Link: (episode: Episode): string => {
    return episode.link_m3u8;
  },

  // Lấy danh sách phim mới cập nhật (có phân trang)
  getNewMovies: async (page: number = 1): Promise<SearchResponse> => {
    try {
      const response = await axios.get<OphimResponse<SearchResponse>>(
        `${API_BASE_URL}/danh-sach/phim-moi-cap-nhat`,
        {
          params: { page },
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi lấy danh sách phim mới cập nhật:", error);
      return {
        items: [],
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 0,
          currentPage: 1,
          pageRanges: 1,
        },
      };
    }
  },

  // Lấy danh sách thể loại
  getGenres: async (): Promise<Array<{ slug: string; name: string }>> => {
    try {
      const response = await axios.get<any>(`${API_BASE_URL}/the-loai`, {
        timeout: 10000,
      });
      // Response shape may vary; try to map common patterns
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        return data.map((g: any) => ({
          slug: g.slug || g.name || "",
          name: g.name || g.slug,
        }));
      }
      if (data && Array.isArray(data.items)) {
        return data.items.map((g: any) => ({
          slug: g.slug || g.name || "",
          name: g.name || g.slug,
        }));
      }
      return [];
    } catch (error) {
      console.error("Lỗi lấy danh sách thể loại:", error);
      return [];
    }
  },

  // Lấy danh sách quốc gia
  getCountries: async (): Promise<Array<{ slug: string; name: string }>> => {
    try {
      const response = await axios.get<any>(`${API_BASE_URL}/quoc-gia`, {
        timeout: 10000,
      });
      const data = response.data?.data || response.data;
      if (Array.isArray(data)) {
        return data.map((c: any) => ({
          slug: c.slug || c.name || "",
          name: c.name || c.slug,
        }));
      }
      if (data && Array.isArray(data.items)) {
        return data.items.map((c: any) => ({
          slug: c.slug || c.name || "",
          name: c.name || c.slug,
        }));
      }
      return [];
    } catch (error) {
      console.error("Lỗi lấy danh sách quốc gia:", error);
      return [];
    }
  },

  // Lấy phim theo thể loại
  getMoviesByGenre: async (
    genreName: string | undefined,
    page: number,
  ): Promise<SearchResponse> => {
    try {
      const genreSlug = slugify(genreName || "");
      const response = await axios.get<OphimResponse<SearchResponse>>(
        `${API_BASE_URL}/the-loai/${genreSlug}`,
        {
          params: { page },
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi lấy phim theo thể loại:", error);
      return {
        items: [],
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 0,
          currentPage: 1,
          pageRanges: 1,
        },
      };
    }
  },

  // Lấy phim theo quốc gia
  getMoviesByCountry: async (
    countryName: string | undefined,
    page: number,
  ): Promise<SearchResponse> => {
    try {
      const countrySlug = slugify(countryName || "");
      const response = await axios.get<OphimResponse<SearchResponse>>(
        `${API_BASE_URL}/quoc-gia/${countrySlug}`,
        {
          params: { page },
          timeout: 10000,
        },
      );
      return (
        response.data.data || {
          items: [],
          pagination: {
            totalItems: 0,
            totalItemsPerPage: 0,
            currentPage: 1,
            pageRanges: 1,
          },
        }
      );
    } catch (error) {
      console.error("Lỗi lấy phim theo quốc gia:", error);
      return {
        items: [],
        pagination: {
          totalItems: 0,
          totalItemsPerPage: 0,
          currentPage: 1,
          pageRanges: 1,
        },
      };
    }
  },
};
