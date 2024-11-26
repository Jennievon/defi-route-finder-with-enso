import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Token } from "@/types/enso";

interface TokenListProps {
  tokens: Token[];
  selectedToken?: string;
  onSelect: (token: Token) => void;
}

export function TokenList({ tokens, selectedToken, onSelect }: TokenListProps) {
  return (
    <div className="space-y-1">
      {tokens.map((token) => (
        <button
          key={token.address}
          onClick={() => onSelect(token)}
          className={cn(
            "w-full flex items-center space-x-3 px-4 py-2 hover:bg-accent rounded-lg transition-colors bg-muted",
            selectedToken === token.address && "bg-accent"
          )}
        >
          <div className="w-6 h-6 rounded-full overflow-hidden bg-background">
            {token.logosUri?.[0] ? (
              <img
                src={token.logosUri[0]}
                alt={token.symbol}
                width={24}
                height={24}
              />
            ) : (
              <div className="w-6 h-6 bg-background" />
            )}
          </div>
          <div className="flex-1 text-left">
            <div className="font-medium">{token.symbol}</div>
            <div className="text-sm text-muted-foreground">{token.name}</div>
          </div>
          {selectedToken === token.address && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
