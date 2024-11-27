import { DollarSign, Activity, Timer, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCreatedAt, formatGas, formatAmount } from "@/lib/utils";
import { useCurrentBlock } from "@/hooks/useCurrentBlock";
import { NETWORK_CONFIGS, type RouteResponse } from "@/types/enso";
import { useGasPrices } from "@/hooks/useGasPrices";

interface RouteSummaryProps {
  route: RouteResponse;
  tokenSymbol?: string;
  decimals?: number;
  chainId?: keyof typeof NETWORK_CONFIGS;
  isSelected?: boolean;
  onClick?: () => void;
}

export function RouteSummary({
  route,
  tokenSymbol = "tokens",
  decimals = 18,
  chainId = 1,
  isSelected = false,
  onClick,
}: RouteSummaryProps) {
  const currentBlock = useCurrentBlock();
  const { gasPrice, tokenPrice } = useGasPrices(chainId);
  const gasEstimate = formatGas(route.gas, chainId, gasPrice, tokenPrice);

  const amount = formatAmount(route.amountOut, decimals);

  return (
    <TooltipProvider>
      <Card
        className={`cursor-pointer transition-all ${
          isSelected ? "border-blue-500 shadow-lg" : "hover:border-blue-200"
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Badge variant={isSelected ? "default" : "secondary"}>
              Best Route
            </Badge>
            <Badge variant="outline">
              {route.route.length} {route.route.length === 1 ? "step" : "steps"}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium">Expected Output</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      The estimated amount of tokens you will receive after the
                      swap, accounting for fees and slippage tolerance.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm font-bold ml-2">
                {amount} {tokenSymbol}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-medium">Estimated Gas</span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-1">
                      <p>Gas Units: {gasEstimate.units}</p>
                      <p>Cost: {gasEstimate.nativeCost}</p>
                      <p>USD Value: {gasEstimate.usdCost}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="text-sm text-right ml-2">
                <div className="font-bold">{gasEstimate.units}</div>
                <div className="text-muted-foreground">
                  {gasEstimate.nativeCost}
                  {gasEstimate.usdCost !== "N/A" && (
                    <span className="ml-1">({gasEstimate.usdCost})</span>
                  )}
                </div>
              </div>
            </div>

            {typeof route.priceImpact === "number" && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  <span className="text-sm font-medium">Price Impact</span>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs p-3">
                      <div className="space-y-2">
                        <p>
                          Price Impact is the change in token price directly
                          caused by your trade.
                        </p>
                        <p>It depends on the size of the liquidity pool:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>High liquidity = smaller impact</li>
                          <li>Low liquidity = larger impact</li>
                        </ul>
                        <p className="text-yellow-500">
                          Higher price impact means you may receive a worse
                          overall price.
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span
                  className={`text-sm font-bold ml-2 ${
                    route.priceImpact > 5
                      ? "text-red-500"
                      : route.priceImpact > 2
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {route.priceImpact.toFixed(2)}%
                </span>
              </div>
            )}

            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Timer className="h-4 w-4 flex-shrink-0" />
                <span className="text-xs">
                  {formatCreatedAt(route.createdAt, currentBlock)}
                </span>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      When this route was calculated, based on the blockchain's
                      current state.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
