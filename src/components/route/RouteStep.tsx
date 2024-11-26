import { Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatAddress } from "@/lib/utils";
import type { RouteStep as RouteStepType, Protocol } from "@/types/enso";

interface RouteStepProps {
  step: RouteStepType;
  protocol?: Protocol;
  isLast: boolean;
}

export function RouteStep({ step, protocol, isLast }: RouteStepProps) {
  return (
    <TooltipProvider>
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="bg-blue-100 p-2 rounded-full">
              {protocol?.logosUri?.[0] ? (
                <img
                  src={protocol.logosUri[0]}
                  alt={protocol.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <Network className="h-8 w-8 text-blue-600" />
              )}
            </div>
            {!isLast && (
              <div className="absolute top-12 left-1/2 h-12 w-0.5 bg-gray-200" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger>
                  <h3 className="font-semibold text-lg hover:text-blue-500 transition-colors">
                    {protocol?.name || step.protocol}
                  </h3>
                </TooltipTrigger>
                {protocol && (
                  <TooltipContent className="max-w-xs">
                    <div className="space-y-2">
                      <p>{protocol.description}</p>
                      <a
                        href={protocol.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Learn more
                      </a>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
              <Badge variant="outline">{step.action}</Badge>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>From:</span>
                {step.tokenIn.map((token, index) => (
                  <Badge key={index} variant="secondary">
                    {formatAddress(token)}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>To:</span>
                {step.tokenOut.map((token, index) => (
                  <Badge key={index} variant="secondary">
                    {formatAddress(token)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
