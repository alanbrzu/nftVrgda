import { VRGDA } from "../../pages/components/NftPool";

// Note: This hardcodes a linear VRGDA.
// Maybe we should use a logistic one instead?
export function vrgdaPrice(
  numSold: number,
  msSinceStart: number,
  targetPrice: number,
  priceDecayPercent: number,
  numPerHour: number
) {
  if (
    typeof numSold == "number" &&
    typeof targetPrice == "number" &&
    typeof priceDecayPercent == "number" &&
    typeof numPerHour == "number" &&
    typeof msSinceStart == "number"
  ) {
    return (
      targetPrice *
      Math.pow(
        1.5 - priceDecayPercent,
        msToHours(msSinceStart) - (numSold + 1) / numPerHour
      )
    );
  } else {
    return 0;
  }
}

// 10 * ()

export function getVRGDAPrice(vrgda: VRGDA, time: number) {
  return vrgdaPrice(
    vrgda.numSold,
    time - vrgda.startTime,
    vrgda.targetPrice,
    vrgda.decayPercent,
    vrgda.numPerHour
  );
}

function msToHours(ms: number) {
  return ms / 1000 / 60 / 60;
}
