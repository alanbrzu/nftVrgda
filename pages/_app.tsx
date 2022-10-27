import "../styles/globals.css";
import type { AppProps } from "next/app";
import Nav from "./components/Nav";
import AppNav from "./components/AppNav";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/router";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function App({ Component, pageProps }: AppProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [app, setApp] = useState(false);
  const [web3Enabled, setWeb3Enabled] = useState(false);
  const [chainId, setChainId] = useState<number>();
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (router.pathname != "/") {
      setApp(true);
    } else {
      setApp(false);
    }
  }, [router]);

  useEffect(() => {
    console.log("app is ", app);
  }, [app]);

  const _theme = createTheme({
    palette: {
      primary: {
        main: "#f8f8f8",
        contrastText: "#000",
      },
      secondary: {
        main: "#026cb3",
        contrastText: "#000",
      },
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#448aff",
        contrastText: "#f6f6f6",
      },
      secondary: {
        main: "#026cb3",
        contrastText: "#f6f6f6",
      },
    },
  });

  const theme = !darkMode ? _theme : darkTheme;

  return (
    <ThemeProvider theme={theme}>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          {/* Changes navbar based on route */}
          {app ? (
            <AppNav
              setChainId={setChainId}
              setSigner={setSigner}
              setWeb3Enabled={setWeb3Enabled}
              setBalance={setBalance}
              setAccount={setAccount}
            />
          ) : (
            <Nav />
          )}

          <Component
            {...pageProps}
            chainId={chainId}
            setChainId={setChainId}
            signer={signer}
            setSigner={setSigner}
            web3Enabled={web3Enabled}
            setWeb3Enabled={setWeb3Enabled}
            balance={balance}
            setBalance={setBalance}
            account={account}
            setAccount={setAccount}
          />
        </NotificationProvider>
      </MoralisProvider>
    </ThemeProvider>
  );
}
