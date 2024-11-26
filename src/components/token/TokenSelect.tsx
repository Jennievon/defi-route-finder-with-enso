import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TokenSearch } from "./TokenSearch";
import type { Token } from "@/types/enso";

interface TokenSelectProps {
  tokens: Token[];
  selectedToken?: Token;
  onSelect: (token: Token) => void;
}

export function TokenSelect({
  tokens,
  selectedToken,
  onSelect,
}: TokenSelectProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (token: Token) => {
    onSelect(token);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start">
          {selectedToken ? (
            <div className="flex items-center gap-2">
              {selectedToken.logosUri?.[0] && (
                <img
                  src={selectedToken.logosUri[0]}
                  alt={selectedToken.symbol}
                  className="w-5 h-5 rounded-full"
                />
              )}
              <span>{selectedToken.symbol}</span>
            </div>
          ) : (
            "Select Token"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select a token</DialogTitle>
        </DialogHeader>
        <TokenSearch
          tokens={filteredTokens}
          selectedToken={selectedToken?.address}
          onSelect={handleSelect}
          onSearch={setSearchQuery}
        />
      </DialogContent>
    </Dialog>
  );
}
