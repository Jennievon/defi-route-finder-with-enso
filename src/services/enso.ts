import axios from "axios";
import type {
  Network,
  Token,
  TokenResponse,
  Protocol,
  RouteRequest,
  RouteResponse,
  WalletInfo,
  ApprovalResponse,
  QuoteRequest,
  QuoteResponse,
} from "@/types/enso";

class EnsoService {
  private baseUrl = "https://api.enso.finance/api/v1";
  private apiKey = import.meta.env.VITE_ENSO_API_KEY;

  private axiosInstance = axios.create({
    baseURL: this.baseUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
    },
  });

  async getNetworks(): Promise<Network[]> {
    const { data } = await this.axiosInstance.get<Network[]>("/networks");
    return data;
  }

  async getTokens(chainId: number = 1): Promise<Token[]> {
    const { data } = await this.axiosInstance.get<TokenResponse>(`/tokens`, {
      params: {
        chainId,
        includeMetadata: true,
      },
    });
    return data.data;
  }

  async getProtocols(): Promise<Protocol[]> {
    const { data } = await this.axiosInstance.get<Protocol[]>("/protocols");
    return data;
  }

  async getWallet(params: {
    chainId: number;
    fromAddress: string;
  }): Promise<WalletInfo> {
    const { data } = await this.axiosInstance.get<WalletInfo>("/wallet", {
      params,
    });
    return data;
  }

  async getApproval(params: {
    chainId: number;
    fromAddress: string;
    tokenAddress: string;
    amount: string;
  }): Promise<ApprovalResponse> {
    const { data } = await this.axiosInstance.get<ApprovalResponse>(
      "/wallet/approve",
      {
        params: {
          ...params,
          routingStrategy: "router",
        },
      }
    );
    return data;
  }

  async getRoute(params: RouteRequest): Promise<RouteResponse> {
    const { data } = await this.axiosInstance.get<RouteResponse>(
      "/shortcuts/route",
      {
        params: {
          ...params,
          routingStrategy: "router",
          amountIn: Array.isArray(params.amountIn)
            ? params.amountIn
            : [params.amountIn],
          tokenIn: Array.isArray(params.tokenIn)
            ? params.tokenIn
            : [params.tokenIn],
          tokenOut: Array.isArray(params.tokenOut)
            ? params.tokenOut
            : [params.tokenOut],
        },
      }
    );
    return data;
  }

  async getQuote(params: QuoteRequest): Promise<QuoteResponse> {
    const { data } = await this.axiosInstance.get<QuoteResponse>(
      "/shortcuts/quote",
      {
        params: {
          ...params,
          amountIn: Array.isArray(params.amountIn)
            ? params.amountIn
            : [params.amountIn],
          tokenIn: Array.isArray(params.tokenIn)
            ? params.tokenIn
            : [params.tokenIn],
          tokenOut: Array.isArray(params.tokenOut)
            ? params.tokenOut
            : [params.tokenOut],
        },
      }
    );
    return data;
  }
}

export const ensoService = new EnsoService();
