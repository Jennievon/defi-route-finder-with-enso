import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatAmount, formatGas } from "@/lib/utils";
import { useGasPrices } from "@/hooks/useGasPrices";
import type { QuoteResponse } from "@/types/enso";

interface QuotePreviewProps {
  quote: QuoteResponse;
  tokenSymbol?: string;
  decimals?: number;
  chainId: number;
}

export function QuotePreview({
  quote,
  tokenSymbol = "tokens",
  decimals = 18,
  chainId,
}: QuotePreviewProps) {
  const { gasPrice, tokenPrice } = useGasPrices(chainId);
  const gasEstimate = formatGas(quote.gas, chainId, gasPrice, tokenPrice);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Quote Preview
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Estimated output before executing the transaction</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Expected Output
            </span>
            <span className="font-medium">
              {formatAmount(quote.amountOut, decimals)} {tokenSymbol}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Estimated Gas</span>
            <div className="text-right">
              <div className="font-medium">{gasEstimate.units}</div>
              <div className="text-sm text-muted-foreground">
                {gasEstimate.nativeCost}
                {gasEstimate.usdCost !== "N/A" && ` (${gasEstimate.usdCost})`}
              </div>
            </div>
          </div>

          {quote.priceImpact !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Price Impact
              </span>
              <span
                className={`font-medium ${
                  quote.priceImpact > 5
                    ? "text-red-500"
                    : quote.priceImpact > 2
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {quote.priceImpact.toFixed(2)}%
              </span>
            </div>
          )}

          <Alert>
            <AlertDescription className="text-sm text-muted-foreground">
              These values are estimates and may change when executing the
              transaction.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
