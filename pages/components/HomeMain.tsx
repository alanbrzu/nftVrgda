import { Box, Container } from "@mui/material";

function HomeMain() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        padding: "4em 4em",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1em",
          padding: "4em 0",
        }}
      >
        <h3>Meow</h3>
        <p>Welcome to Spring Capital Digital Assets</p>
      </Container>
    </Box>
  );
}

export default HomeMain;
