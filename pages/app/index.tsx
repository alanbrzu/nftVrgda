import { Box, Container } from "@mui/material";
import { useEffect } from "react";
import AppNav from "../components/AppNav";
import AppMain from "../components/AppMain";
import { boxStyle, containerStyle } from "../../utils/styling/styles";

function AppHome({ web3Enabled, signer, account, balance }: any) {
  return (
    <div>
      <Box sx={boxStyle}>
        <Container sx={containerStyle}>
          <AppMain
            web3Enabled={web3Enabled}
            account={account}
            balance={balance}
          />
        </Container>
      </Box>
    </div>
  );
}

export default AppHome;
