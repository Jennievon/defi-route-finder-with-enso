import { Zap } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { Network } from "@/types/enso";

interface HeaderProps {
  networks: Network[];
  selectedChainId: number;
  onNetworkChange: (chainId: number) => void;
}

export function Header({
  networks,
  selectedChainId,
  onNetworkChange,
}: HeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">DeFi Route Finder</h1>
        </div>
        <div className="flex items-center gap-4">
          <Select
            value={selectedChainId.toString()}
            onValueChange={(value) => onNetworkChange(parseInt(value, 10))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Network" />
            </SelectTrigger>
            <SelectContent>
              {networks.map((network) => (
                <SelectItem key={network.id} value={network.id.toString()}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <ConnectButton />
        </div>
      </div>

      <Alert>
        <AlertDescription className="text-sm">
          <p className="font-medium mb-2">
            Find the most efficient routes across DeFi protocols to maximize
            your returns.
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            <li>Smart order routing across multiple DEXs and protocols</li>
            <li>Optimized for best rates and lowest gas costs</li>
            <li>Support for complex multi-hop trades and token swaps</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
