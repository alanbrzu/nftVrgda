import { useState, useEffect } from "react";
import { defiAbi, defiContracts } from "../../constants/index";
import { Box, Button, Container, Grid } from "@mui/material";
import {
  boxStyle,
  containerStyle,
  inputStyle,
  formStyle,
  buttonStyle,
  headStyle,
} from "../../utils/styling/styles";
import { ethers } from "ethers";
import DefiInfo from "../components/DefiInfo";
import { sideStyle, appContStyle } from "./nft-pools";

export interface DefiInfo {
  name: string;
  symbol: string;
  supply: number;
  wallet_balance: number;
}

function Defi({ web3Enabled, signer, chainId, balance, account }: any) {
  const [contractAddress, setContractAddress] = useState<any>();
  const [info, setInfo] = useState<DefiInfo>();
  const [mintAmt, setMintAmt] = useState<number>();

  // Write functions
  // Mint
  // Transfer

  // Mint mint(address, amount)
  const mint = async () => {
    const contract = new ethers.Contract(contractAddress, defiAbi, signer);
    try {
      const _mint = await contract.mint(account, mintAmt);
      console.log(_mint);
      setMintAmt(0);
    } catch (error) {
      console.log(error);
    }
  };

  // Transfer transfer(address, amount)

  useEffect(() => {
    console.log(contractAddress);
  }, [contractAddress]);

  // Set contract address
  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && chainId) {
      const _address = defiContracts[chainId][0];
      setContractAddress(_address);
    }
  }, [chainId]);

  return (
    <Box sx={boxStyle}>
      <Container
        sx={containerStyle}
        style={{ padding: "2em 0", marginTop: "40px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <h3>ERC20</h3>
          <p>Contract Address:</p>
          <p>{contractAddress}</p>
        </div>
        {web3Enabled && account && contractAddress && signer ? (
          <>
            <Container sx={appContStyle}>
              <form onSubmit={(e) => e.preventDefault()} style={formStyle}>
                <p style={headStyle}>Meow</p>
                <input
                  style={inputStyle}
                  type="number"
                  value={mintAmt}
                  placeholder="Mint Amount"
                  required
                  onChange={(e) => setMintAmt(parseInt(e.target.value))}
                />
                <Button
                  sx={buttonStyle}
                  variant="contained"
                  onClick={() => mint()}
                >
                  Mint
                </Button>
              </form>
            </Container>
            <Container fixed sx={sideStyle}>
              <DefiInfo
                account={account}
                signer={signer}
                contractAddress={contractAddress}
                info={info}
                setInfo={setInfo}
              />
            </Container>
          </>
        ) : (
          <p>Connect Wallet</p>
        )}
      </Container>
    </Box>
  );
}

export default Defi;
