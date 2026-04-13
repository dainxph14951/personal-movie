import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  // Theo dõi sự kiện cuộn chuột
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: scrolled ? "rgba(25, 27, 36, 0.9)" : "transparent",
        boxShadow: scrolled ? 4 : 0,
        transition: "all 0.3s ease-in-out",
        backgroundImage: "none",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
        >
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Only Nhung
          </Link>
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/browse"
          sx={{
            textTransform: "none",
            fontSize: "1rem",
            mr: 2,
            padding: "5px 20px",
            backgroundColor: "#fff",
            color: "#191b24",
            borderRadius: "20px",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          Các thể loại 🎬
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
