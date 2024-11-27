import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouteSummary } from "./RouteSummary";

vi.mock("@/hooks/useCurrentBlock", () => ({
  useCurrentBlock: () => BigInt(1000),
}));

vi.mock("@/hooks/useGasPrices", () => ({
  useGasPrices: () => ({
    gasPrice: BigInt("50000000000"),
    tokenPrice: 2000,
  }),
}));

vi.mock("@/components/ui/tooltip", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  TooltipContent: () => null,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("@/components/ui/card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ui/badge", () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode;
    variant?: string;
  }) => <span data-variant={variant}>{children}</span>,
}));

describe("RouteSummary", () => {
  const mockRoute = {
    gas: "100000",
    amountOut: "1000000000000000000",
    priceImpact: 1.5,
    createdAt: 995,
    route: [
      {
        protocol: "uniswap-v3",
        action: "swap",
        tokenIn: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
        tokenOut: ["0x6b175474e89094c44da98b954eedeac495271d0f"],
      },
    ],
    tx: {
      data: "0x",
      to: "0x123",
      from: "0x456",
      value: "0",
    },
  };

  it("renders expected output", () => {
    render(<RouteSummary route={mockRoute} chainId={1} />);
    expect(screen.getByText("Expected Output")).toBeInTheDocument();
    expect(screen.getByText(/1.000000/)).toBeInTheDocument();
  });

  it("renders gas estimate", () => {
    const { container } = render(
      <RouteSummary route={mockRoute} chainId={1} />
    );

    expect(container.querySelector(".text-green-500")).toBeInTheDocument();

    //check if gas estimate is rendered
    expect(
      screen.getByText((content) => content.includes("100.0K gas"))
    ).toBeInTheDocument();

    //check if ETH cost is rendered
    expect(
      screen.getByText((content) => content.includes("0.005000 ETH"))
    ).toBeInTheDocument();

    //check if USD cost is rendered
    expect(
      screen.getByText((content) => content.includes("$10.00"))
    ).toBeInTheDocument();
  });

  it("renders price impact with correct color", () => {
    render(<RouteSummary route={mockRoute} chainId={1} />);
    const priceImpact = screen.getByText("1.50%");
    expect(priceImpact).toHaveClass("text-green-500");
  });

  it("renders high price impact warning", () => {
    const highImpactRoute = {
      ...mockRoute,
      priceImpact: 5.5,
    };
    render(<RouteSummary route={highImpactRoute} chainId={1} />);
    const priceImpact = screen.getByText("5.50%");
    expect(priceImpact).toHaveClass("text-sm font-bold ml-2 text-red-500");
  });

  it("shows created time", () => {
    render(<RouteSummary route={mockRoute} chainId={1} />);
    expect(screen.getByText("1 minute ago")).toBeInTheDocument();
  });

  it("applies selected styles when selected", () => {
    const { container } = render(
      <RouteSummary route={mockRoute} chainId={1} isSelected={true} />
    );
    expect(container.querySelector(".border-blue-500")).toBeInTheDocument();
  });
});
