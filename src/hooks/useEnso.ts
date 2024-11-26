import { useQuery } from "@tanstack/react-query";
import { ensoService } from "@/services/enso";
import type {
  Network,
  Token,
  Protocol,
  RouteRequest,
  RouteResponse,
  QuoteResponse,
} from "@/types/enso";
import { useAccount } from "wagmi";

export function useNetworks() {
  return useQuery<Network[], Error>({
    queryKey: ["networks"],
    queryFn: () => ensoService.getNetworks(),
  });
}

export function useTokens(chainId: number = 1) {
  return useQuery<Token[], Error>({
    queryKey: ["tokens", chainId],
    queryFn: () => ensoService.getTokens(chainId),
  });
}

export function useProtocols() {
  return useQuery<Protocol[], Error>({
    queryKey: ["protocols"],
    queryFn: () => ensoService.getProtocols(),
  });
}

export function useRoute(params: RouteRequest & { enabled?: boolean }) {
  const { enabled = true, ...routeParams } = params;
  return useQuery<RouteResponse, Error>({
    queryKey: ["route", routeParams],
    queryFn: () => ensoService.getRoute(routeParams),
    enabled,
  });
}

export function useApproval({
  chainId = 1,
  tokenAddress,
  amount,
  enabled = true,
}: {
  chainId?: number;
  tokenAddress?: string;
  amount?: string;
  enabled?: boolean;
}) {
  const { address } = useAccount();

  return useQuery({
    queryKey: ["approval", chainId, address, tokenAddress, amount],
    queryFn: () =>
      ensoService.getApproval({
        chainId,
        fromAddress: address!,
        tokenAddress: tokenAddress!,
        amount: amount!,
      }),
    enabled: enabled && !!address && !!tokenAddress && !!amount,
  });
}

export function useQuote({
  chainId = 1,
  fromAddress,
  tokenIn,
  tokenOut,
  amountIn,
  enabled = true,
}: {
  chainId?: number;
  fromAddress?: string;
  tokenIn?: string[];
  tokenOut?: string[];
  amountIn?: string[];
  enabled?: boolean;
}) {
  return useQuery<QuoteResponse>({
    queryKey: ["quote", chainId, fromAddress, tokenIn, tokenOut, amountIn],
    queryFn: () =>
      ensoService.getQuote({
        chainId,
        fromAddress: fromAddress!,
        tokenIn: tokenIn!,
        tokenOut: tokenOut!,
        amountIn: amountIn!,
        priceImpact: true,
      }),
    enabled:
      enabled &&
      !!fromAddress &&
      !!tokenIn?.length &&
      !!tokenOut?.length &&
      !!amountIn?.length,
  });
}
