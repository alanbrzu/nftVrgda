import Link from "next/link";
import styles from "../../styles/Home.module.css";
import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import { useEffect } from "react";
import { ConnectButton } from "web3uikit";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";

function AppNav({
  setChainId,
  setSigner,
  setWeb3Enabled,
  setBalance,
  setAccount,
}: any) {
  const { isWeb3Enabled, account, web3 }: any = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled == true && typeof window !== "undefined") {
      setWeb3Enabled(true);
      setAccount(account);
      setChainId(web3._network.chainId);
      connectSigner();
    } else {
      setChainId(null);
      setAccount(null);
      setSigner(null);
      setWeb3Enabled(false);
    }
  }, [isWeb3Enabled]);

  // Set Signer
  const connectSigner = async () => {
    if (typeof window.ethereum !== "undefined" && account) {
      try {
        await ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(ethereum);
        const _signer = provider.getSigner(account);
        setSigner(_signer);
        const balance = await provider.getBalance(account);
        // console.log("provider ", provider);
        setBalance(parseFloat(ethers.utils.formatEther(balance)).toFixed(4));
      } catch (error) {
        console.log(error);
      }
    }
  };

  function handleConnect() {}

  return (
    <Box sx={{ flexGrow: 1, position: "relative" }}>
      <AppBar sx={{ boxShadow: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Container
            sx={{
              display: "flex",
              gap: "2em",
              width: "fit-content",
              marginLeft: "20px",
            }}
          >
            <Link href="/app/defi">
              <Button
                sx={{
                  fontSize: "12px",
                  textTransform: "none",
                  color: "inherit",
                }}
                variant="text"
                disableElevation
              >
                Defi
              </Button>
            </Link>
            <Link href="/app/nft-pools">
              <Button
                sx={{
                  fontSize: "12px",
                  textTransform: "none",
                  color: "inherit",
                }}
                variant="text"
                disableElevation
              >
                NFT Pools
              </Button>
            </Link>
          </Container>
          <div className={styles.appBtn}>
            <ConnectButton />
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default AppNav;
