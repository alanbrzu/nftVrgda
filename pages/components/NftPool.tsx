import { Button, Container, Grid } from "@mui/material";
import React, { use, useEffect, useState } from "react";
import {
  containerStyle,
  inputStyle,
  formStyle,
  buttonStyle,
  headStyle,
} from "../../utils/styling/styles";
import { useTime } from "../../utils/time/useTime";
import { getVRGDAPrice } from "../../utils/vrgda/vrgda";

export interface VRGDA {
  numSold: number;
  startTime: number;
  targetPrice: number;
  decayPercent: number;
  numPerHour: number;
}

interface ConVRGDA extends VRGDA {
  starting_supply: number;
  time_days: number;
}

export interface Pool {
  price: number;
  starting_supply: number;
  purchased: number;
  available: number;
  time_left: number;
}

function NftPool({ info, balance }: any) {
  const time = useTime();

  // Within the inputs I set all but startTime and numSold
  const [vrgda, setVrgda] = useState<VRGDA>({});
  const [conVrgda, setConVrgda] = useState<ConVRGDA>({});
  const [poolInfo, setPoolInfo] = useState<Pool>({});
  const [poolTime, setPoolTime] = useState<number>();
  const [purchaseAmt, setPurchaseAmt] = useState<number>({});
  const [price, setPrice] = useState<any>();

  // Click button executes this function
  // Which then triggers the useEffect, calling vrgdaLoop
  const executeVrgda = () => {
    const _numPerHour = vrgda.numPerHour / (poolTime * 24);
    setConVrgda({
      numSold: 0,
      startTime: time,
      targetPrice: vrgda.targetPrice,
      decayPercent: vrgda.decayPercent,
      numPerHour: _numPerHour,
      starting_supply: vrgda.numPerHour,
      time_days: poolTime || 1,
    });
    setVrgda({
      numSold: "",
      startTime: "",
      targetPrice: "",
      decayPercent: "",
      numPerHour: "",
    });
    setPoolTime("");
  };
  // Waits 1 sec then runs function
  const vrgdaLoop = () => {
    intervLad();
    const timer = setInterval(() => {
      const price = getVRGDAPrice(conVrgda, Date.now());
      setPrice(price);
    }, 1000);
  };

  const intervLad = () => {
    const interv = setTimeout(() => {
      console.log("waiting");
      console.log(conVrgda);
    }, 1000);
    return () => clearTimeout(interv);
  };

  // Set poolInfo
  const updatePool = () => {
    setPoolInfo({
      price: price,
      starting_supply: conVrgda.starting_supply,
      purchased: conVrgda.numSold,
      available: conVrgda.starting_supply - conVrgda.numSold,
      time_left: conVrgda.time_days,
    });
  };

  // Buy from pool
  const makePurchase = () => {
    setConVrgda({
      ...conVrgda,
      numSold: conVrgda.numSold + purchaseAmt,
    });
    setPurchaseAmt("");
  };

  // Executes vrgdaLoop when startTime is set by executeVrgda
  useEffect(() => {
    if (conVrgda.startTime && vrgda.numSold == 0) {
      vrgdaLoop();
    }
  }, [conVrgda.startTime]);

  // Updates pool whenever numSold changes
  useEffect(() => {
    if (conVrgda.startTime && conVrgda.numSold > 0) {
      vrgdaLoop();
      updatePool();
    }
  }, [price]);

  useEffect(() => {
    console.log(poolInfo);
  }, [poolInfo]);

  return (
    <>
      {info ? (
        <Container
          sx={containerStyle}
          style={{ padding: "1em 0", marginTop: "80px", marginBottom: "100px" }}
        >
          <h3>Swap Pool</h3>
          <p>{info.name}</p>
          <Container
            sx={{ display: "flex", flexDirection: "column", gap: "2em" }}
          >
            <Grid
              container
              spacing={2}
              sx={{ marginTop: "10px", marginBottom: "80px" }}
            >
              {/* Pool info */}
              {conVrgda && price ? (
                <>
                  <Grid item xs={6} md={4} sx={{ display: "grid", gap: "1em" }}>
                    <h4>ETH</h4>
                    <p>Wallet Balance: {info.owner_balance}</p>
                    <p>ETH Balance: {balance} ETH</p>
                    <p>Total Price</p>
                  </Grid>
                  <Grid item xs={6} md={4} sx={{ display: "grid", gap: "1em" }}>
                    <h4>Pool</h4>
                    {poolInfo.numSold > 0 ? (
                      <>
                        <p>Starting Supply: {poolInfo.starting_supply}</p>
                        <p>Available: {poolInfo.available}</p>
                        <p>Time: {poolInfo.time_left * 24} hours left</p>
                        <p>Ask: $ {poolInfo.price.toFixed(2)}</p>
                      </>
                    ) : (
                      <>
                        <p>Starting Supply: {conVrgda.starting_supply}</p>
                        <p>
                          Available:{" "}
                          {conVrgda.starting_supply - conVrgda.numSold}
                        </p>
                        <p>Time: {conVrgda.time_days * 24} hours left</p>
                        <p>Ask: $ {price.toFixed(2)}</p>
                      </>
                    )}
                  </Grid>
                </>
              ) : (
                <Grid item xs={6} md={4} sx={{ display: "grid", gap: "1em" }}>
                  <p>No Pools</p>
                </Grid>
              )}

              {/* Buy from pool */}

              <Grid item xs={6} md={4} sx={{ display: "grid", gap: "1em" }}>
                <>
                  {conVrgda && price ? (
                    <>
                      <form
                        onSubmit={(e) => e.preventDefault()}
                        style={formStyle}
                      >
                        <p style={headStyle}>Make Purchase</p>
                        <input
                          style={inputStyle}
                          type="number"
                          value={purchaseAmt}
                          required
                          onChange={(e) => {
                            if (
                              parseInt(e.target.value) >= 0 ||
                              !e.target.value
                            ) {
                              setPurchaseAmt(parseInt(e.target.value));
                            }
                          }}
                          placeholder="Purchase from pool"
                        />
                        <p style={{ marginTop: "14px", fontSize: "14px" }}>
                          Total Price:
                        </p>
                        <Button
                          sx={buttonStyle}
                          variant="contained"
                          onClick={() => makePurchase()}
                        >
                          Purchase
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <p>No Pools</p>
                    </>
                  )}
                </>
              </Grid>
            </Grid>

            {/* Create Pool */}
            <Grid item xs={6} md={4} sx={{ display: "grid", gap: "1em" }}>
              <form onSubmit={(e) => e.preventDefault()} style={formStyle}>
                <p style={headStyle}>Create Pool</p>
                <input
                  style={inputStyle}
                  type="number"
                  value={vrgda.numPerHour}
                  required
                  onChange={(e) => {
                    if (parseInt(e.target.value) >= 0 || !e.target.value) {
                      setVrgda({
                        ...vrgda,
                        numPerHour: parseInt(e.target.value),
                      });
                    }
                  }}
                  placeholder="Set pool supply"
                />
                <input
                  style={inputStyle}
                  type="number"
                  value={vrgda.targetPrice}
                  required
                  onChange={(e) => {
                    if (parseFloat(e.target.value) >= 0 || !e.target.value) {
                      setVrgda({
                        ...vrgda,
                        targetPrice: parseFloat(e.target.value),
                      });
                    }
                  }}
                  placeholder="Target price"
                />
                <input
                  style={inputStyle}
                  type="text"
                  value={vrgda.decayPercent}
                  required
                  onChange={(e) => {
                    if (parseFloat(e.target.value) >= 0 || !e.target.value) {
                      setVrgda({
                        ...vrgda,
                        decayPercent: parseFloat(e.target.value),
                      });
                    }
                  }}
                  placeholder="Decay percent"
                />
                <input
                  style={inputStyle}
                  type="number"
                  value={poolTime}
                  required
                  onChange={(e) => {
                    if (parseInt(e.target.value) >= 0 || !e.target.value) {
                      setPoolTime(parseInt(e.target.value));
                    }
                  }}
                  placeholder="Time (Days)"
                />
                <Button
                  sx={buttonStyle}
                  variant="contained"
                  onClick={() => executeVrgda()}
                >
                  Send
                </Button>
              </form>
            </Grid>
          </Container>
        </Container>
      ) : (
        <p>Loading</p>
      )}
    </>
  );
}

//   numSold: number;
//   startTime: number;
//   targetPrice: number;
//   decayPercent: number;
//   numPerHour: number;

export default NftPool;
