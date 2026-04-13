import { Box, Container, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: "auto",
        backgroundColor: "#1e1e1e",
        borderTop: "1px solid #333",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="textSecondary">
          Sản phẩm cá nhân không mang tính chất thương mại
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
