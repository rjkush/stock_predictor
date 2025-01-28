import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PredictionService } from '../../services/PredictionService';
import { StockService } from '../../services/StockService';

const predictionService = new PredictionService();
const stockService = new StockService();

interface Prediction {
  symbol: string;
  date: string;
  confidence: number;
  direction: 'bullish' | 'bearish';
}

interface PredictionsState {
  predictions: { [symbol: string]: Prediction };
  modelAccuracy: number;
  loading: boolean;
  error: string | null;
}

const initialState: PredictionsState = {
  predictions: {},
  modelAccuracy: 82.5, // Mock accuracy
  loading: false,
  error: null,
};

export const initializeModel = createAsyncThunk(
  'predictions/initializeModel',
  async () => {
    await predictionService.initialize();
  }
);

export const predictReversal = createAsyncThunk(
  'predictions/predictReversal',
  async (symbol: string) => {
    const historicalData = await stockService.getHistoricalData(symbol);
    const prediction = await predictionService.predictReversal(historicalData);
    return {
      symbol,
      ...prediction,
    };
  }
);

export const trainModel = createAsyncThunk(
  'predictions/trainModel',
  async (symbol: string) => {
    const historicalData = await stockService.getHistoricalData(symbol, 365);
    await predictionService.trainModel(historicalData);
  }
);

const predictionsSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    updateModelAccuracy: (state, action) => {
      state.modelAccuracy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Model
      .addCase(initializeModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeModel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(initializeModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to initialize model';
      })
      // Predict Reversal
      .addCase(predictReversal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(predictReversal.fulfilled, (state, action) => {
        state.loading = false;
        state.predictions[action.payload.symbol] = action.payload;
      })
      .addCase(predictReversal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to predict reversal';
      })
      // Train Model
      .addCase(trainModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trainModel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(trainModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to train model';
      });
  },
});

export const { updateModelAccuracy } = predictionsSlice.actions;
export default predictionsSlice.reducer; 