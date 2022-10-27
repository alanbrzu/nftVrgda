import { useEffect, useState } from "react";
import { defiAbi, defiContracts } from "../../constants/index";
import { ethers } from "ethers";
import { Container, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { _containerStyle } from "./NftInfo";

function DefiInfo({ signer, account, contractAddress, info, setInfo }: any) {
  // Read functions
  // Name name()
  // Symbol symbol()
  // Total supply totalSupply()
  // Wallet balance balanceOf(address)

  const readFunctions = async () => {
    const contract = new ethers.Contract(contractAddress, defiAbi, signer);
    try {
      const _name = await contract.name();
      const _symbol = await contract.symbol();
      const _supply = await contract.totalSupply();
      const _walletBalance = await contract.balanceOf(account);
      console.log(name, _symbol, _supply, _walletBalance);
      setInfo({
        name: _name,
        symbol: _symbol,
        supply: parseFloat(ethers.utils.formatUnits(_supply, 18)),
        wallet_balance: parseFloat(
          ethers.utils.formatUnits(_walletBalance, 18)
        ),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && contractAddress) {
      readFunctions();
    }
  }, [signer, contractAddress, account]);

  useEffect(() => {
    console.log(info);
  }, [info]);

  return (
    <div style={{ height: "fit-content" }}>
      {info ? (
        <>
          <Stack sx={{ alignItems: "flex-end" }}>
            <RefreshIcon
              sx={{ cursor: "pointer" }}
              //   onClick={() => readFunctions()}
            />
            <Container
              sx={_containerStyle}
              style={{
                flexDirection: "row",
                gap: "10px",
                alignItems: "baseline",
              }}
            >
              <p>{info.name}</p>
              <p style={{ fontSize: "12px" }}>{info.symbol}</p>
            </Container>
            <Container sx={_containerStyle}>
              <p>Total Supply</p>
              <p style={{ fontSize: "14px" }}>{info.supply} BTX</p>
            </Container>
            <Container sx={_containerStyle}>
              <p>Wallet Balance</p>
              <p style={{ fontSize: "14px" }}>{info.wallet_balance} BTX</p>
            </Container>
          </Stack>
        </>
      ) : (
        <p>Connect Wallet</p>
      )}
    </div>
  );
}

export default DefiInfo;
