import { useEffect } from "react";
import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { NETWORK_CONFIGS } from "@/types/enso";

export function useCurrentBlock(chainId: number) {
  const publicClient = usePublicClient();

  const { data: blockNumber, refetch } = useQuery({
    queryKey: ["currentBlock"],
    queryFn: () => publicClient?.getBlockNumber(),
  });

  //poll based on the blockTime
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, NETWORK_CONFIGS[chainId].blockTime * 1000);

    return () => clearInterval(interval);
  }, [refetch]);

  return blockNumber;
}
