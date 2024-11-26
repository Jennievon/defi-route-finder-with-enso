import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TokenList } from "./TokenList";
import type { Token } from "@/types/enso";

interface TokenSearchProps {
  tokens: Token[];
  selectedToken?: string;
  onSelect: (token: Token) => void;
  onSearch: (query: string) => void;
}

export function TokenSearch({
  tokens,
  selectedToken,
  onSelect,
  onSearch,
}: TokenSearchProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tokens..."
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[300px]">
        <TokenList
          tokens={tokens}
          selectedToken={selectedToken}
          onSelect={onSelect}
        />
      </ScrollArea>
    </div>
  );
}
