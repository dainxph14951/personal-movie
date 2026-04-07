import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ophimService } from "@services/ophimService";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`category-tabpanel-${index}`}
      aria-labelledby={`category-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const CategoriesBrowser: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [genres, setGenres] = useState<Array<{ slug: string; name: string }>>(
    [],
  );
  const [countries, setCountries] = useState<
    Array<{ slug: string; name: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [genresData, countriesData] = await Promise.all([
          ophimService.getGenres(),
          ophimService.getCountries(),
        ]);
        setGenres(genresData);
        setCountries(countriesData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Lỗi khi tải danh mục và quốc gia",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCategoryClick = (slug: string, isCountry: boolean = false) => {
    if (isCountry) {
      navigate(`/?country=${slug}`);
    } else {
      navigate(`/?genre=${slug}`);
    }
  };

  const CategoryCard: React.FC<{
    name: string;
    slug: string;
    isCountry?: boolean;
  }> = ({ name, slug, isCountry = false }) => (
    <Card
      sx={{
        height: "100%",
        background:
          "linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(220, 0, 78, 0.15) 100%)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 24px rgba(25, 118, 210, 0.3)",
          borderColor: "rgba(25, 118, 210, 0.5)",
        },
      }}
    >
      <CardActionArea
        onClick={() => handleCategoryClick(slug, isCountry)}
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            minHeight: "140px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
              color: "#fff",
            }}
          >
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Đang tải danh mục...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        Khám Phá Phim
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 0 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="category-tabs"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              minWidth: "150px",
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#1976d2",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1976d2",
            },
          }}
        >
          <Tab
            label="Thể Loại"
            id="category-tab-0"
            aria-controls="category-tabpanel-0"
          />
          <Tab
            label="Quốc Gia"
            id="category-tab-1"
            aria-controls="category-tabpanel-1"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {genres.map((genre) => (
            <CategoryCard
              key={genre.slug}
              name={genre.name}
              slug={genre.slug}
            />
          ))}
        </Box>
        {genres.length === 0 && (
          <Typography
            sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
          >
            Không tìm thấy thể loại nào
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {countries.map((country) => (
            <CategoryCard
              key={country.slug}
              name={country.name}
              slug={country.slug}
              isCountry={true}
            />
          ))}
        </Box>
        {countries.length === 0 && (
          <Typography
            sx={{ textAlign: "center", py: 4, color: "text.secondary" }}
          >
            Không tìm thấy quốc gia nào
          </Typography>
        )}
      </TabPanel>
    </Container>
  );
};
