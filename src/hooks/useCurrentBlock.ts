import { useEffect } from "react";
import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";

export function useCurrentBlock() {
  const publicClient = usePublicClient();

  const { data: blockNumber, refetch } = useQuery({
    queryKey: ["currentBlock"],
    queryFn: () => publicClient?.getBlockNumber(),
  });

  //polling every 12 seconds - the average block time on Ethereum
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 12000);

    return () => clearInterval(interval);
  }, [refetch]);

  return blockNumber;
}
