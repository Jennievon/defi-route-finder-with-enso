import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RouteStep } from "./RouteStep";
import { vi } from "vitest";

// mocking these components to avoid rendering them
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

vi.mock("@/components/ui/badge", () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}));

describe("RouteStep", () => {
  const mockStep = {
    protocol: "uniswap-v3",
    action: "swap",
    tokenIn: ["0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"],
    tokenOut: ["0x6b175474e89094c44da98b954eedeac495271d0f"],
  };

  const mockProtocol = {
    slug: "uniswap-v3",
    name: "Uniswap V3",
    description: "Automated market maker",
    url: "https://uniswap.org",
    logosUri: ["https://example.com/logo.png"],
    chains: [{ id: 1, name: "Ethereum" }],
  };

  it("renders protocol name and action", () => {
    render(
      <RouteStep step={mockStep} protocol={mockProtocol} isLast={false} />
    );

    expect(screen.getByText("Uniswap V3")).toBeInTheDocument();
    expect(screen.getByText("swap")).toBeInTheDocument();
  });

  it("renders token addresses", () => {
    render(
      <RouteStep step={mockStep} protocol={mockProtocol} isLast={false} />
    );

    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.getByText("0x6b17...1d0f")).toBeInTheDocument();
  });

  it("shows protocol logo when available", () => {
    render(
      <RouteStep step={mockStep} protocol={mockProtocol} isLast={false} />
    );

    const logo = screen.getByRole("img");
    expect(logo).toHaveAttribute("src", mockProtocol.logosUri[0]);
    expect(logo).toHaveAttribute("alt", mockProtocol.name);
  });

  it("shows fallback icon when no logo is available", () => {
    const protocolWithoutLogo = { ...mockProtocol, logosUri: [] };
    render(
      <RouteStep
        step={mockStep}
        protocol={protocolWithoutLogo}
        isLast={false}
      />
    );

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
