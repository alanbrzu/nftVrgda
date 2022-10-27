import { AppBar, Box, Button, Toolbar } from "@mui/material";
import Link from "next/link";

function Nav() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Link href="/app">
            <Button
              sx={{
                fontSize: "11px",
                textTransform: "none",
                borderRadius: "10px",
              }}
              variant="contained"
              disableElevation
            >
              Launch App
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Nav;
