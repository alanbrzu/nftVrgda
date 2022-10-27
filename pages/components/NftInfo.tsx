import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi, contractAddresses } from "../../constants/index";
import { Container, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

export const _containerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  padding: "1em",
};

function NftInfo({ signer, account, contractAddress, info, setInfo }: any) {
  // name
  // MINT_PRICE = price
  // currentTokenId = total_minted
  // balanceOf() = owner_balance

  const readFunctions = async () => {
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const nftName = await contract.name();
      const mintPrice = await contract.MINT_PRICE();
      const amtMinted = await contract.totalSupply();
      const walletNftBalance = await contract.balanceOf(account);
      setInfo({
        name: nftName,
        price: parseFloat(ethers.utils.formatEther(mintPrice)),
        total_minted: parseFloat(amtMinted.toString()),
        owner_balance: parseFloat(walletNftBalance.toString()),
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
              onClick={() => readFunctions()}
            />
            <Container sx={_containerStyle}>
              <p>Collection</p>
              <p style={{ fontSize: "14px" }}>{info.name}</p>
            </Container>
            <Container sx={_containerStyle}>
              <p>Mint Price</p>
              <p style={{ fontSize: "14px" }}>{info.price} ETH</p>
            </Container>
            <Container sx={_containerStyle}>
              <p>Total Supply</p>
              <p style={{ fontSize: "14px" }}>10,000</p>
            </Container>
            <Container sx={_containerStyle}>
              <p>Total Minted</p>

              <p style={{ fontSize: "14px" }}>{info.total_minted}</p>
            </Container>
            <Container sx={_containerStyle}>
              <p>Wallet Balance</p>
              <p style={{ fontSize: "14px" }}>{info.owner_balance}</p>
            </Container>
          </Stack>
        </>
      ) : (
        <p>Connect Wallet</p>
      )}
    </div>
  );
}

export default NftInfo;
