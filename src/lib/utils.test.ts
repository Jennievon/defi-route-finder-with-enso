import { describe, it, expect } from "vitest";
import {
  formatAddress,
  formatAmount,
  formatCreatedAt,
  formatGas,
  formatGasUnits,
} from "./utils";

describe("formatAddress", () => {
  it("should format ETH address correctly", () => {
    expect(formatAddress("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")).toBe(
      "ETH"
    );
  });

  it("should format regular address correctly", () => {
    expect(formatAddress("0x1234567890abcdef1234567890abcdef12345678")).toBe(
      "0x1234...5678"
    );
  });

  it("should handle empty address", () => {
    expect(formatAddress("")).toBe("");
  });
});

describe("formatAmount", () => {
  it("should format amount with default decimals", () => {
    expect(formatAmount("1000000000000000000")).toBe("1.000000");
    expect(formatAmount("500000000000000000")).toBe("0.500000");
  });

  it("should format amount with custom decimals", () => {
    expect(formatAmount("1000000", 6)).toBe("1.000000");
  });

  it("should handle zero amount", () => {
    expect(formatAmount("0")).toBe("0.000000");
  });
});

describe("formatCreatedAt", () => {
  it("should format just now", () => {
    const currentBlock = BigInt(1000);
    const blockNumber = 999;
    expect(formatCreatedAt(blockNumber, currentBlock)).toBe("just now");
  });

  it("should format minutes ago", () => {
    const currentBlock = BigInt(1000);
    const blockNumber = 995; // 5 blocks = ~60 seconds
    expect(formatCreatedAt(blockNumber, currentBlock)).toBe("1 minute ago");
  });

  it("should handle missing blocks", () => {
    expect(formatCreatedAt(0)).toBe("");
  });
});

describe("formatGasUnits", () => {
  it("should format gas in millions", () => {
    expect(formatGasUnits(2500000)).toBe("2.50M gas");
  });

  it("should format gas in thousands", () => {
    expect(formatGasUnits(25000)).toBe("25.0K gas");
  });

  it("should format small gas amounts", () => {
    expect(formatGasUnits(500)).toBe("500 gas");
  });
});

describe("formatGas", () => {
  const chainId = 1; // Ethereum Mainnet
  const gasPrice = BigInt("50000000000"); // 50 gwei
  const tokenPrice = 2000; // $2000 per ETH

  it("should format gas estimate with all values", () => {
    const result = formatGas("100000", chainId, gasPrice, tokenPrice);
    expect(result.units).toBe("100.0K gas");
    expect(result.nativeCost).toContain("ETH");
    expect(result.usdCost).toContain("$");
  });

  it("should handle missing gas price", () => {
    const result = formatGas("100000", chainId);
    expect(result.units).toBe("100.0K gas");
    expect(result.nativeCost).toBe("N/A");
    expect(result.usdCost).toBe("N/A");
  });

  it("should handle unsupported chain", () => {
    const result = formatGas("100000", 999);
    expect(result.units).toBe("100.0K gas");
    expect(result.nativeCost).toBe("N/A");
    expect(result.usdCost).toBe("N/A");
  });
});
