import { Box, Container } from "@mui/material";
import { useEffect } from "react";

function AppMain({ web3Enabled, signer, account, balance }: any) {
  return (
    <>
      <p>Good morning.</p>
      {account ? <p>{account}</p> : <p>Connect Wallet</p>}
    </>
  );
}

export default AppMain;
