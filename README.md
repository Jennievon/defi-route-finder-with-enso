# DeFi Route Finder

A powerful DeFi aggregation tool that finds the most efficient routes across multiple protocols to maximize returns on token swaps. Built with React, Vite, and the Enso Finance API.

![DeFi Route Finder](https://github.com/jennievon/defi-route-finder/raw/main/screenshot.png)

## Features

- 🔄 Smart order routing across multiple DEXs and protocols
- 💰 Best rates and lowest gas costs
- ⚡ Support for complex multi-hop trades
- 🔍 Real-time quotes and price impact analysis
- 🌐 Multi-chain support (Ethereum, Optimism, Polygon, Arbitrum)
- 🔒 Secure wallet integration with RainbowKit
- 📊 Detailed gas estimates and cost breakdowns

## Tech Stack

- **Frontend Framework**: React + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Wallet Integration**: RainbowKit + wagmi
- **API Integration**: Enso Finance API
- **Type Safety**: TypeScript

## Getting Started

### Project Structure
```
src/
├── components/           # React components
│   ├── route/           # Route-related components
│   ├── token/           # Token selection components
│   └── ui/              # Shared UI components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── services/            # API services
├── types/               # TypeScript types
└── test/                # Test utilities
```

### Prerequisites

- Node.js 16+
- npm or yarn
- A Web3 wallet (e.g., MetaMask)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jennievon/defi-route-finder.git
cd defi-route-finder
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_WALLETCONNECT_PROJECT_ID=your_project_id # Get this from the WalletConnect website
VITE_ENSO_API_KEY=your_api_key # Get this from the Enso Finance website
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Testing

Vitest is used for testing. Run the test suite:

#### Run all tests
```bash
npm run test
```

#### Run tests in watch mode
```bash
npm run test:watch
```

#### Run tests with coverage
```bash
npm run test:coverage
```

## Usage

1. Connect your Web3 wallet using the "Connect Wallet" button
2. Select the network you want to trade on
3. Choose the token you want to swap from and enter the amount
4. Select the token you want to receive
5. Adjust slippage tolerance if needed
6. Click "Find Routes" to see the best available trading routes
7. Review the route details, gas costs, and price impact
8. Execute the trade when ready (TBD)

## Features in Detail

### Smart Order Routing
- Automatically finds the most efficient path for your trade
- Compares rates across multiple DEXs and protocols
- Optimizes for both price and gas costs

### Gas Optimization
- Real-time gas estimates in both native tokens and USD
- Detailed breakdown of transaction costs
- Gas-efficient routing to minimize fees

### Price Impact Analysis
- Real-time calculation of trade's market impact
- Visual indicators for high-impact trades
- Helpful tooltips explaining the implications

### Multi-Chain Support
- Seamless trading across multiple networks
- Unified interface for all supported chains
- Real-time network switching

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Enso Finance](https://enso.finance) for their powerful DeFi API
- [RainbowKit](https://www.rainbowkit.com/) for the wallet integration
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [wagmi](https://wagmi.sh/) for the Ethereum hooks