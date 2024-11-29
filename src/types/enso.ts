export interface Network {
  id: number;
  name: string;
  isConnected?: boolean;
  chainId?: number;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface Token {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  chainId: number;
  logosUri?: string[];
  type?: "base" | "defi";
  project?: string;
  protocol?: string;
  poolAddress?: string;
  primaryAddress?: string;
  underlyingPoolTokens?: string[];
}

export interface TokenResponse {
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
  data: Token[];
}

export interface Protocol {
  slug: string;
  name: string;
  description?: string;
  url: string;
  logosUri?: string[];
  chains: { id: number; name: string }[];
}

export interface RouteStep {
  tokenIn: string[];
  tokenOut: string[];
  protocol: string;
  action: string;
  primary?: string;
  internalRoutes?: string[];
}

export interface Transaction {
  data: string;
  to: string;
  from: string;
  value: string;
}

export interface RouteResponse {
  gas: string;
  amountOut: string;
  priceImpact?: number;
  feeAmount?: string[];
  createdAt: number;
  tx: Transaction;
  route: RouteStep[];
}

export interface RouteRequest {
  chainId: number;
  fromAddress: string;
  routingStrategy?: "ensowallet" | "router" | "delegate";
  receiver?: string;
  spender?: string;
  amountIn: string[];
  tokenIn: string[];
  tokenOut: string[];
  slippage?: string;
  fee?: string[];
  feeReceiver?: string;
  disableRFQs?: boolean;
  priceImpact?: boolean;
  ignoreAggregators?: string[];
  ignoreStandards?: string[];
}

export interface NetworkConfig {
  nativeCurrency: {
    symbol: string;
    decimals: number;
    coingeckoId: string; //for price fetching
  };
  blockTime: number; //avg block time(in sec)
}

export interface GasEstimate {
  units: string;
  nativeCost: string;
  usdCost: string;
}

export interface QuoteResponse {
  amountOut: string;
  gas: string;
  route: RouteStep[];
  feeAmount?: string[];
  priceImpact?: number;
}

export interface QuoteRequest {
  chainId: number;
  fromAddress: string;
  tokenIn: string[];
  tokenOut: string[];
  amountIn: string[];
  fee?: string[];
  feeReceiver?: string;
  priceImpact?: boolean;
}

export const NETWORK_CONFIGS: Record<number, NetworkConfig> = {
  1: {
    //Ethereum Mainnet
    nativeCurrency: {
      symbol: "ETH",
      decimals: 18,
      coingeckoId: "ethereum",
    },
    blockTime: 12,
  },
  10: {
    //Optimism
    nativeCurrency: {
      symbol: "ETH",
      decimals: 18,
      coingeckoId: "ethereum",
    },
    blockTime: 2,
  },
  56: {
    //BNB Chain
    nativeCurrency: {
      symbol: "BNB",
      decimals: 18,
      coingeckoId: "binancecoin",
    },
    blockTime: 3,
  },
  137: {
    //Polygon
    nativeCurrency: {
      symbol: "MATIC",
      decimals: 18,
      coingeckoId: "matic-network",
    },
    blockTime: 2,
  },
  42161: {
    //Arbitrum
    nativeCurrency: {
      symbol: "ETH",
      decimals: 18,
      coingeckoId: "ethereum",
    },
    blockTime: 0.25,
  },
  43114: {
    //Avalanche
    nativeCurrency: {
      symbol: "AVAX",
      decimals: 18,
      coingeckoId: "avalanche-2",
    },
    blockTime: 2,
  },
  8453: {
    //Base
    nativeCurrency: {
      symbol: "ETH",
      decimals: 18,
      coingeckoId: "ethereum",
    },
    blockTime: 2,
  },
};
