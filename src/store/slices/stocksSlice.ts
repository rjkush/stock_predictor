import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { StockService, StockData, StockQuote } from '../../services/StockService';

const stockService = new StockService();

interface StocksState {
  quotes: { [symbol: string]: StockQuote };
  historicalData: { [symbol: string]: StockData[] };
  searchResults: StockQuote[];
  loading: boolean;
  error: string | null;
}

const initialState: StocksState = {
  quotes: {},
  historicalData: {},
  searchResults: [],
  loading: false,
  error: null,
};

export const fetchQuote = createAsyncThunk(
  'stocks/fetchQuote',
  async (symbol: string) => {
    return await stockService.getQuote(symbol);
  }
);

export const fetchHistoricalData = createAsyncThunk(
  'stocks/fetchHistoricalData',
  async ({ symbol, days }: { symbol: string; days: number }) => {
    return await stockService.getHistoricalData(symbol, days);
  }
);

export const searchStocks = createAsyncThunk(
  'stocks/searchStocks',
  async (query: string) => {
    return await stockService.searchStocks(query);
  }
);

const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Quote
      .addCase(fetchQuote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuote.fulfilled, (state, action) => {
        state.loading = false;
        state.quotes[action.payload.symbol] = action.payload;
      })
      .addCase(fetchQuote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quote';
      })
      // Fetch Historical Data
      .addCase(fetchHistoricalData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistoricalData.fulfilled, (state, action) => {
        state.loading = false;
        state.historicalData[action.meta.arg.symbol] = action.payload;
      })
      .addCase(fetchHistoricalData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch historical data';
      })
      // Search Stocks
      .addCase(searchStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchStocks.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search stocks';
      });
  },
});

export default stocksSlice.reducer; 