import { useState } from "react";
import { useAccount } from "wagmi";
import { parseUnits } from "viem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowUpDown, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TokenSelect } from "./token/TokenSelect";
import { Header } from "./Header";
import {
  useTokens,
  useNetworks,
  useProtocols,
  useApproval,
  useRoute,
  useQuote,
} from "@/hooks/useEnso";
import { RouteStep } from "./route/RouteStep";
import { RouteSummary } from "./route/RouteSummary";
import { formatAmount, formatGas } from "@/lib/utils";
import type { Token, Protocol } from "@/types/enso";
import { QuotePreview } from "./QuotePreview";
import { useGasPrices } from "@/hooks/useGasPrices";

export default function ProtocolPathfinder() {
  const { address } = useAccount();
  const [chainId, setChainId] = useState(1);
  const [fromToken, setFromToken] = useState<Token | undefined>();
  const [toToken, setToToken] = useState<Token | undefined>();
  const [amount, setAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<string>("0.5");
  const [shouldFindRoute, setShouldFindRoute] = useState(false);

  const slippageBasisPoints = Math.round(
    parseFloat(slippage || "0.5") * 100
  ).toString();

  const { data: networks, isLoading: isLoadingNetworks } = useNetworks();
  const { data: tokens, isLoading: isLoadingTokens } = useTokens(chainId);
  const { data: protocols, isLoading: isLoadingProtocols } = useProtocols();
  const { gasPrice, tokenPrice } = useGasPrices(chainId);

  const { data: quote } = useQuote({
    chainId,
    fromAddress: address,
    tokenIn: fromToken?.address ? [fromToken.address] : undefined,
    tokenOut: toToken?.address ? [toToken.address] : undefined,
    amountIn: amount
      ? [parseUnits(amount, fromToken?.decimals || 18).toString()]
      : undefined,
    enabled:
      !!address && !!fromToken && !!toToken && !!amount && !shouldFindRoute,
  });

  const { data: route, isLoading: isLoadingRoute } = useRoute({
    chainId,
    fromAddress: address || "",
    tokenIn: [fromToken?.address || ""],
    tokenOut: [toToken?.address || ""],
    amountIn: [
      amount ? parseUnits(amount, fromToken?.decimals || 18).toString() : "0",
    ],
    slippage: slippageBasisPoints,
    priceImpact: true,
    enabled:
      shouldFindRoute && !!address && !!fromToken && !!toToken && !!amount,
  });

  const { data: approval } = useApproval({
    chainId,
    tokenAddress: fromToken?.address,
    amount: amount
      ? parseUnits(amount, fromToken?.decimals || 18).toString()
      : undefined,
    enabled:
      !!fromToken &&
      !!amount &&
      fromToken.address !== "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  });

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleFindRoutes = () => {
    setShouldFindRoute(true);
  };

  const getProtocolInfo = (protocolSlug: string): Protocol | undefined => {
    return protocols?.find((p) => p.slug === protocolSlug);
  };

  const isInitializing =
    isLoadingNetworks || isLoadingTokens || isLoadingProtocols;

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Header
        networks={networks || []}
        selectedChainId={chainId}
        onNetworkChange={setChainId}
      />

      <Card>
        <CardHeader>
          <CardTitle>Swap Tokens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-start">
              <div className="space-y-2">
                <label className="text-sm font-medium">From</label>
                <div className="flex gap-2">
                  <TokenSelect
                    tokens={tokens || []}
                    selectedToken={fromToken}
                    onSelect={setFromToken}
                  />
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex justify-center -mt-2 md:mt-8">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSwapTokens}
                  className="rounded-full hover:bg-muted"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">To</label>
                <div className="flex gap-2">
                  <TokenSelect
                    tokens={tokens || []}
                    selectedToken={toToken}
                    onSelect={setToToken}
                  />
                  {/* <div className="flex-1 bg-muted rounded-md opacity-50">
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={amount}
                      disabled
                    />
                  </div> */}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">
                    Slippage Tolerance (%)
                  </label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Maximum percentage difference between expected and
                          actual output amounts that you're willing to accept.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  type="number"
                  placeholder="0.5"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
            </div>

            {approval && (
              <Alert>
                <AlertDescription className="flex items-center justify-between">
                  <span>Token approval required</span>
                  <div className="text-right">
                    <div className="font-medium">
                      {
                        formatGas(approval.gas, chainId, gasPrice, tokenPrice)
                          .units
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {
                        formatGas(approval.gas, chainId, gasPrice, tokenPrice)
                          .nativeCost
                      }
                      {formatGas(approval.gas, chainId, gasPrice, tokenPrice)
                        .usdCost !== "N/A" && (
                        <span className="ml-1">
                          (
                          {
                            formatGas(
                              approval.gas,
                              chainId,
                              gasPrice,
                              tokenPrice
                            ).usdCost
                          }
                          )
                        </span>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              onClick={handleFindRoutes}
              disabled={
                !address || !fromToken || !toToken || !amount || isLoadingRoute
              }
            >
              {isLoadingRoute ? "Finding Routes..." : "Find Routes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {quote && !route && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Quote Preview</h2>
            <QuotePreview
              quote={quote}
              chainId={chainId}
              tokenSymbol={toToken?.symbol}
              decimals={toToken?.decimals}
            />
          </div>
        </div>
      )}

      {route && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-4">Route Summary</h2>
            <RouteSummary
              route={route}
              tokenSymbol={toToken?.symbol}
              decimals={toToken?.decimals}
              chainId={chainId}
              isSelected={true}
            />
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Route Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {route.route.map((step, index) => (
                    <RouteStep
                      key={index}
                      step={step}
                      protocol={getProtocolInfo(step.protocol)}
                      isLast={index === route.route.length - 1}
                    />
                  ))}

                  <Alert className="mt-6">
                    <AlertDescription className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Expected Output:</span>
                        <span>
                          {formatAmount(
                            route.amountOut[toToken?.address || ""],
                            toToken?.decimals
                          )}{" "}
                          {toToken?.symbol}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {
                            formatGas(route.gas, chainId, gasPrice, tokenPrice)
                              .units
                          }
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {
                            formatGas(route.gas, chainId, gasPrice, tokenPrice)
                              .nativeCost
                          }
                          {formatGas(route.gas, chainId, gasPrice, tokenPrice)
                            .usdCost !== "N/A" && (
                            <span className="ml-1">
                              (
                              {
                                formatGas(
                                  route.gas,
                                  chainId,
                                  gasPrice,
                                  tokenPrice
                                ).usdCost
                              }
                              )
                            </span>
                          )}
                        </div>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
