import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { StockService, StockQuote } from '../../services/StockService';

const stockService = new StockService();

interface PortfolioHolding {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  pl: number;
  plPercent: number;
}

interface PortfolioState {
  holdings: { [symbol: string]: PortfolioHolding };
  totalValue: number;
  totalPL: number;
  totalPLPercent: number;
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  holdings: {
    MEDICOREM: {
      symbol: 'MEDICOREM',
      quantity: 1000,
      avgPrice: 65.20,
      currentPrice: 67.46,
      value: 67460,
      pl: 2260,
      plPercent: 3.46
    },
    MEFCOM: {
      symbol: 'MEFCOM',
      quantity: 500,
      avgPrice: 18.75,
      currentPrice: 19.95,
      value: 9975,
      pl: 600,
      plPercent: 6.40
    }
  },
  totalValue: 77435,
  totalPL: 2860,
  totalPLPercent: 3.83,
  loading: false,
  error: null
};

export const updatePortfolioPrices = createAsyncThunk(
  'portfolio/updatePrices',
  async (_, { getState }) => {
    const state = getState() as { portfolio: PortfolioState };
    const symbols = Object.keys(state.portfolio.holdings);
    const quotes = await Promise.all(
      symbols.map(symbol => stockService.getQuote(symbol))
    );
    return quotes;
  }
);

export const addToPortfolio = createAsyncThunk(
  'portfolio/addHolding',
  async ({ symbol, quantity, price }: { symbol: string; quantity: number; price: number }) => {
    const quote = await stockService.getQuote(symbol);
    return {
      symbol,
      quantity,
      avgPrice: price,
      currentPrice: quote.price,
      value: quantity * quote.price,
      pl: quantity * (quote.price - price),
      plPercent: ((quote.price - price) / price) * 100
    };
  }
);

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    removeFromPortfolio: (state, action) => {
      const symbol = action.payload;
      const holding = state.holdings[symbol];
      if (holding) {
        state.totalValue -= holding.value;
        state.totalPL -= holding.pl;
        state.totalPLPercent = (state.totalPL / (state.totalValue - state.totalPL)) * 100;
        delete state.holdings[symbol];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Portfolio Prices
      .addCase(updatePortfolioPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePortfolioPrices.fulfilled, (state, action) => {
        state.loading = false;
        let totalValue = 0;
        let totalPL = 0;

        action.payload.forEach((quote: StockQuote) => {
          const holding = state.holdings[quote.symbol];
          if (holding) {
            const value = holding.quantity * quote.price;
            const pl = value - (holding.quantity * holding.avgPrice);
            const plPercent = (pl / (holding.quantity * holding.avgPrice)) * 100;

            state.holdings[quote.symbol] = {
              ...holding,
              currentPrice: quote.price,
              value,
              pl,
              plPercent
            };

            totalValue += value;
            totalPL += pl;
          }
        });

        state.totalValue = totalValue;
        state.totalPL = totalPL;
        state.totalPLPercent = (totalPL / (totalValue - totalPL)) * 100;
      })
      .addCase(updatePortfolioPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update portfolio prices';
      })
      // Add to Portfolio
      .addCase(addToPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        const holding = action.payload;
        
        if (state.holdings[holding.symbol]) {
          // Update existing holding
          const existingHolding = state.holdings[holding.symbol];
          const totalQuantity = existingHolding.quantity + holding.quantity;
          const totalCost = (existingHolding.quantity * existingHolding.avgPrice) +
                          (holding.quantity * holding.avgPrice);
          
          state.holdings[holding.symbol] = {
            ...holding,
            quantity: totalQuantity,
            avgPrice: totalCost / totalQuantity,
            value: totalQuantity * holding.currentPrice,
            pl: (totalQuantity * holding.currentPrice) - totalCost,
            plPercent: (((totalQuantity * holding.currentPrice) - totalCost) / totalCost) * 100
          };
        } else {
          // Add new holding
          state.holdings[holding.symbol] = holding;
        }

        // Update portfolio totals
        state.totalValue = Object.values(state.holdings)
          .reduce((sum, h) => sum + h.value, 0);
        state.totalPL = Object.values(state.holdings)
          .reduce((sum, h) => sum + h.pl, 0);
        state.totalPLPercent = (state.totalPL / (state.totalValue - state.totalPL)) * 100;
      })
      .addCase(addToPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to portfolio';
      });
  },
});

export const { removeFromPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer; 