import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { MovieDetail } from "@pages/MovieDetail";
import { Browse } from "@pages/Browse";
import Country from "./pages/Country";
import Header from "./layout/Header";
import Genres from "@pages/Genres";
import { Home } from "@pages/Home";
import Footer from "./layout/Footer";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#282b3a",
      paper: "#2f3346",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
        >
          <Header />

          <Box component="main" sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/the-loai/:slug" element={<Genres />} />
              <Route path="/quoc-gia/:slug" element={<Country />} />
              <Route path="/movie/:movieId" element={<MovieDetail />} />
            </Routes>
          </Box>

          <Footer />
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
