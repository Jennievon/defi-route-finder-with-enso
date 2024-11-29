import { useQuery } from "@tanstack/react-query";
import { ensoService } from "@/services/enso";
import type {
  Network,
  Token,
  Protocol,
  RouteRequest,
  RouteResponse,
} from "@/types/enso";

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
