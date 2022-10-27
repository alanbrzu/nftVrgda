import { useState, useEffect } from "react";
import { Box, Button, Container, Grid } from "@mui/material";
import {
  boxStyle,
  containerStyle,
  inputStyle,
  formStyle,
  buttonStyle,
  headStyle,
} from "../../utils/styling/styles";
import { abi, contractAddresses } from "../../constants/index";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";
import NftInfo from "../components/NftInfo";
import NftPool from "../components/NftPool";

interface SendNft {
  addressTo: string;
  tokenId: number;
}

// bulkTransfer(address from, uint256[] tokenIds, address to)
interface BulkTransfer {
  // tokenIds: number[];
  tokenIds: any;
  addressTo: string;
}

export interface Info {
  name: string;
  price: number;
  total_minted: number;
  owner_balance: number;
}

export const sideStyle = {
  display: "flex",
  position: "absolute",
  height: "fit-content",
  width: "300px",
  right: 0,
  top: "200px",
};

export const appContStyle = {
  width: "fit-content",
  display: "flex",
  flexDirection: "column",
  alignItems: "start",
  marginLeft: 0,
  marginRight: 0,
  marginTop: "60px",
  gap: "4em",
  padding: 0,
};

function NFTPools({ web3Enabled, signer, chainId, balance, account }: any) {
  const [contractAddress, setContractAddress] = useState<any>();
  const [info, setInfo] = useState<Info>();
  const [sendNftInfo, setSendNftInfo] = useState<SendNft>({});
  const [batchInfo, setBatchInfo] = useState<BulkTransfer>({});
  const [mintAmt, setMintAmt] = useState<any>();

  const dispatch = useNotification();

  const _mintValue = (num: number) => {
    const ethNum = 0.0001 * num;
    return ethers.utils.parseEther(ethNum.toString());
  };

  // Set contract address
  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && chainId) {
      const _address = contractAddresses[chainId][0];
      setContractAddress(_address);
    }
  }, [chainId]);

  // Mint:
  // mintTo(address to, quantity, valueETH .0001)
  const mint = async () => {
    if (typeof window.ethereum !== "undefined" && signer) {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const tx = {
          value: _mintValue(mintAmt),
          gasLimit: ethers.utils.hexlify(500000),
        };
        const _mint = await contract.mint(account, mintAmt, tx);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const receipt = await provider.waitForTransaction(
          _mint.hash,
          1,
          150000
        );

        console.log(receipt);
        console.log(_mint);
        setMintAmt(0);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Transfer:
  // transferFrom(address from, address to, uint256 tokenId)
  // 0xa9fE4A36739c263c156b6ed1d322265043BE74F7
  const transfer = async () => {
    if (typeof window.ethereum !== "undefined" && signer) {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const _transfer = await contract.transferFrom(
          account,
          sendNftInfo.addressTo,
          sendNftInfo.tokenId
        );
        console.log(_transfer);
        setSendNftInfo({});
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Batch Transfer:
  // bulkTransfer(address from, uint256[] tokenIds, address to)
  // 0xa9fE4A36739c263c156b6ed1d322265043BE74F7
  const bulkTransfer = async () => {
    if (typeof window.ethereum !== "undefined" && signer) {
      const contract = new ethers.Contract(contractAddress, abi, signer);
      try {
        const _tokenIds = [];
        for (let i = 0; i < batchInfo.tokenIds.length; i++) {
          _tokenIds.push(parseInt(batchInfo.tokenIds[i]));
        }
        const _bulkTransfer = await contract.bulkTransfer(
          // account,
          _tokenIds,
          batchInfo.addressTo
        );
        console.log(_bulkTransfer);
        setBatchInfo({});
      } catch (error) {
        console.log(error);
        // console.log(_tokenIds)
      }
    }
  };

  const formatBulk = (e: any) => {
    setBatchInfo({
      ...batchInfo,
      tokenIds: e.target.value.split(","),
    });
  };

  useEffect(() => {
    console.log(batchInfo);
  }, [batchInfo]);

  useEffect(() => {
    console.log(mintAmt);
  }, [mintAmt]);

  return (
    <Box sx={boxStyle}>
      <Container
        sx={containerStyle}
        style={{ padding: "2em 0", marginTop: "40px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {" "}
          <h3>Mint</h3>
          <p>Contract Address:</p>
          <p>{contractAddress}</p>
        </div>

        {web3Enabled && account && contractAddress && signer ? (
          <>
            <Container sx={appContStyle}>
              <form onSubmit={(e) => e.preventDefault()} style={formStyle}>
                <p style={headStyle}>Mint</p>
                <input
                  style={inputStyle}
                  type="number"
                  value={mintAmt}
                  placeholder="Mint Amount"
                  required
                  onChange={(e) => {
                    if (mintAmt >= 0 || !mintAmt) {
                      setMintAmt(parseInt(e.target.value));
                    }
                  }}
                />
                <Button
                  sx={buttonStyle}
                  variant="contained"
                  onClick={() => mint()}
                >
                  Mint
                </Button>
              </form>
              <Grid
                container
                spacing={2}
                sx={{ gap: "4em", alignItems: "flex-end", margin: 0 }}
              >
                {/* Transfer */}
                <form onSubmit={(e) => e.preventDefault()} style={formStyle}>
                  <p style={headStyle}>Transfer</p>
                  <input
                    style={inputStyle}
                    type="text"
                    value={sendNftInfo.addressTo}
                    placeholder="Address to send"
                    required
                    onChange={(e) =>
                      setSendNftInfo({
                        ...sendNftInfo,
                        addressTo: e.target.value,
                      })
                    }
                  />
                  <input
                    style={inputStyle}
                    type="number"
                    value={sendNftInfo.tokenId}
                    placeholder="Token ID"
                    required
                    onChange={(e) =>
                      setSendNftInfo({
                        ...sendNftInfo,
                        tokenId: parseInt(e.target.value),
                      })
                    }
                  />
                  <Button
                    sx={buttonStyle}
                    variant="contained"
                    onClick={() => transfer()}
                  >
                    Send
                  </Button>
                </form>
                {/* Bulk Transfer */}
                <form onSubmit={(e) => e.preventDefault()} style={formStyle}>
                  <p style={headStyle}>Bulk Transfer</p>
                  <input
                    style={inputStyle}
                    type="text"
                    value={batchInfo.addressTo}
                    placeholder="Address to send"
                    required
                    onChange={(e) =>
                      setBatchInfo({
                        ...batchInfo,
                        addressTo: e.target.value,
                      })
                    }
                  />
                  <input
                    style={inputStyle}
                    type="text"
                    value={batchInfo.tokenIds}
                    placeholder="Token IDs"
                    required
                    onChange={formatBulk}
                  />

                  <Button
                    sx={buttonStyle}
                    variant="contained"
                    onClick={() => bulkTransfer()}
                  >
                    Send
                  </Button>
                </form>
              </Grid>
            </Container>
            <Container fixed sx={sideStyle}>
              <NftInfo
                signer={signer}
                account={account}
                contractAddress={contractAddress}
                info={info}
                setInfo={setInfo}
              />
            </Container>
            <NftPool info={info} balance={balance} />
          </>
        ) : (
          <p>Connect Wallet</p>
        )}
      </Container>
    </Box>
  );
}

export default NFTPools;
