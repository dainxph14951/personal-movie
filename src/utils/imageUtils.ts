export const IMAGE_BASE_URL = "https://img.ophim.live/uploads/movies";

export const getImageUrl = (path: string | undefined): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${IMAGE_BASE_URL}/${path}`;
};
