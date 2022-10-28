import { useState, useEffect, useRef } from "react";
import { Button, Container, Grid } from "@mui/material";
import {
  containerStyle,
  inputStyle,
  formStyle,
  buttonStyle,
  headStyle,
} from "../../utils/styling/styles";
import { useTime } from "../../utils/time/useTime";
import { getVRGDAPrice } from "../../utils/vrgda/vrgda";
import { VRGDA } from "./NftPool";

interface PoolCreate {
  price: number;
  starting_supply: number;
  time_left: number;
  purchased: number;
}

interface PoolInfo extends PoolCreate {
  available: number;
}

function DefiPool({ info, balance }: any) {
  const time = useTime();

  const [poolCreate, setPoolCreate] = useState<PoolCreate>({});
  const [poolInfo, setPoolInfo] = useState<PoolInfo>({});
  const [poolTime, setPoolTime] = useState<number>();
  const [vrgda, setVrgda] = useState<VRGDA>({});
  const [price, setPrice] = useState<any>();
  const [purchaseAmt, setPurchaseAmt] = useState<number>();

  const prevAssignmentValue = useRef(vrgda);

  const createPool = () => {
    if (poolCreate.starting_supply > info.wallet_balance) {
      console.log("Not enough coins");
    } else {
      const _available = poolCreate.starting_supply - 0;
      setPoolInfo({
        ...poolCreate,
        price: parseFloat(poolCreate.price),
        purchased: 0,
        available: _available,
      });
      console.log(poolInfo);
    }
  };

  // getVRGDAPrice(vrgda, time) needs
  // numSold, startTime, targetPrice, decayPercent, numPerHour

  // Add loop
  const findVrgda = () => {
    const _numPerHour = poolCreate.starting_supply / (poolTime * 24);
    console.log(poolInfo.purchased);
    setVrgda({
      numSold: poolInfo.purchased,
      startTime: time,
      targetPrice: parseFloat(poolCreate.price),
      decayPercent: 1,
      numPerHour: _numPerHour,
    });
    // vrgdaLoop();
  };

  const vrgdaLoop = () => {
    if (vrgda.numSold != undefined) {
      const timer = setInterval(() => {
        console.log(vrgda);
        const price = getVRGDAPrice(vrgda, Date.now());

        setPrice(price);
      }, 1000);
      if (prevAssignmentValue.current.numSold !== vrgda.numSold) {
        return () => clearInterval(timer);
      }
    } else {
      console.log(vrgda);
    }
  };

  const makePurchase = () => {
    setVrgda({
      ...vrgda,
      numSold: vrgda.numSold + purchaseAmt,
    });
  };

  //   useEffect(() => {
  //     if (
  //       prevAssignmentValue.current.startTime !== vrgda.startTime &&
  //       prevAssignmentValue.current.numSold !== vrgda.numSold
  //     ) {
  //       vrgdaLoop();
  //     }
  //   }, [createPool]);

  useEffect(() => {
    findVrgda();
  }, [poolInfo]);

  useEffect(() => {
    console.log(price);
  }, [price]);

  useEffect(() => {
    // console.log(vrgda);
    // vrgdaLoop();
    if (vrgda.numSold != undefined) {
      const timer = setInterval(() => {
        console.log(vrgda);
        const price = getVRGDAPrice(vrgda, Date.now());

        setPrice(price);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [vrgda.numSold]);

  return (
    <Container
      sx={containerStyle}
      style={{ padding: "1em 0", marginTop: "80px", marginBottom: "100px" }}
    >
      <h3>Coin Swap</h3>
      <Container sx={{ display: "flex", flexDirection: "column", gap: "2em" }}>
        <Grid
          container
          spacing={2}
          sx={{ marginTop: "10px", marginBottom: "80px" }}
        >
          {poolInfo.purchased != undefined && price ? (
            <>
              <Grid item xs={6} md={4} sx={{ display: "grid", gap: "1em" }}>
                <h4>ETH</h4>
                <p>ETH Balance: {balance} ETH</p>
                <p>BTX Balance: {info.owner_balance} ETH</p>
              </Grid>
              <Grid item xs={6} md={4} sx={{ display: "grid", gap: "1em" }}>
                <h4>Pool</h4>
                <p>Starting Supply: {poolInfo.starting_supply}</p>
                <p>Available: {poolInfo.starting_supply - vrgda.numSold}</p>
                <p>Price: {price.toFixed(6)} ETH/BTX</p>
              </Grid>
              <Grid item xs={6} md={4} sx={{ display: "grid", gap: "1em" }}>
                <form onSubmit={(e) => e.preventDefault()} style={formStyle}>
                  <p style={headStyle}>Purchase from Pool</p>
                  <input
                    style={inputStyle}
                    type="number"
                    placeholder="Purchase from pool"
                    value={purchaseAmt}
                    required
                    onChange={(e) => setPurchaseAmt(parseInt(e.target.value))}
                  />

                  <Button
                    sx={buttonStyle}
                    variant="contained"
                    onClick={makePurchase}
                  >
                    Purchase
                  </Button>
                </form>
              </Grid>
            </>
          ) : (
            <Grid>
              <p>No Pools</p>
            </Grid>
          )}
        </Grid>

        {/* Create Pool */}
        <Grid item xs={6} md={4} sx={{ display: "grid", gap: "1em" }}>
          <form onSubmit={(e) => e.preventDefault()} style={formStyle}>
            <p style={headStyle}>Create Pool</p>
            <input
              style={inputStyle}
              type="number"
              value={poolCreate.starting_supply}
              required
              onChange={(e) =>
                setPoolCreate({
                  ...poolCreate,
                  starting_supply: parseInt(e.target.value),
                })
              }
              placeholder="Set pool supply"
            />
            <input
              style={inputStyle}
              type="number"
              value={poolCreate.price}
              required
              onChange={(e) =>
                setPoolCreate({
                  ...poolCreate,
                  price: e.target.value,
                })
              }
              placeholder="Target Price"
            />
            <input
              style={inputStyle}
              type="number"
              value={poolTime}
              required
              onChange={(e) => setPoolTime(parseInt(e.target.value))}
              placeholder="Time (Days)"
            />
            <Button sx={buttonStyle} variant="contained" onClick={createPool}>
              Send
            </Button>
          </form>
        </Grid>
      </Container>
    </Container>
  );
}

export default DefiPool;
