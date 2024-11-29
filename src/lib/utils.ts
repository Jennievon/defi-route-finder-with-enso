import { GasEstimate, NETWORK_CONFIGS } from "@/types/enso";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  if (!address) return "";
  if (address === "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") return "ETH";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAmount(
  amount: string | bigint,
  decimals: number = 18
): string {
  if (!amount) return "0";
  const formatted = formatUnits(BigInt(amount), decimals);
  //rm trailing zeros after decimal point
  return parseFloat(formatted).toFixed(6);
}

export function formatCreatedAt(
  blockNumber: number,
  chainId: number,
  currentBlock?: bigint
): string {
  if (!blockNumber || !currentBlock) return "";

  const blockDifference = Number(currentBlock) - blockNumber;
  const secondsAgo = blockDifference * NETWORK_CONFIGS[chainId].blockTime;

  if (secondsAgo < 60) {
    return "just now";
  }

  if (secondsAgo < 3600) {
    const minutes = Math.floor(secondsAgo / 60);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (secondsAgo < 86400) {
    const hours = Math.floor(secondsAgo / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  const days = Math.floor(secondsAgo / 86400);
  return `${days} ${days === 1 ? "day" : "days"} ago`;
}

export function formatGasUnits(gas: string | number): string {
  const gasNumber = typeof gas === "string" ? parseInt(gas, 10) : gas;
  if (gasNumber > 1_000_000) {
    return `${(gasNumber / 1_000_000).toFixed(2)}M gas`;
  }
  if (gasNumber > 1_000) {
    return `${(gasNumber / 1_000).toFixed(1)}K gas`;
  }
  return `${gasNumber} gas`;
}

export function formatGas(
  gas: string | number,
  chainId: number,
  gasPrice?: bigint,
  tokenPrice?: number
): GasEstimate {
  const networkConfig = NETWORK_CONFIGS[chainId];
  if (!networkConfig) {
    return {
      units: formatGasUnits(gas),
      nativeCost: "N/A",
      usdCost: "N/A",
    };
  }

  const { symbol, decimals } = networkConfig.nativeCurrency;
  const units = formatGasUnits(gas);
  let nativeCost = "N/A";
  let usdCost = "N/A";

  if (gasPrice) {
    const gasCostWei =
      BigInt(typeof gas === "string" ? gas : gas.toString()) * gasPrice;
    nativeCost = `${parseFloat(formatUnits(gasCostWei, decimals)).toFixed(
      6
    )} ${symbol}`;

    if (tokenPrice) {
      const nativeCostNumber = parseFloat(formatUnits(gasCostWei, decimals));
      usdCost = `$${(nativeCostNumber * tokenPrice).toFixed(2)}`;
    }
  }

  return {
    units: `${units}`,
    nativeCost,
    usdCost,
  };
}
