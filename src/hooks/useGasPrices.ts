import { NETWORK_CONFIGS } from "@/types/enso";
import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

export function useGasPrices(chainId: number) {
  const publicClient = usePublicClient();
  const networkConfig = NETWORK_CONFIGS[chainId];

  const { data: gasPrice } = useQuery({
    queryKey: ["gasPrice", chainId],
    queryFn: () => publicClient?.getGasPrice(),
    refetchInterval: 10000,
  });

  const { data: tokenPrice } = useQuery({
    queryKey: ["tokenPrice", chainId],
    queryFn: async () => {
      if (!networkConfig?.nativeCurrency.coingeckoId) return null;
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${networkConfig.nativeCurrency.coingeckoId}&vs_currencies=usd`
      );
      const data = await response.json();
      return data[networkConfig.nativeCurrency.coingeckoId].usd;
    },
    refetchInterval: 60000,
  });

  return { gasPrice, tokenPrice };
}
