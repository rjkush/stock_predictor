import { configureStore } from '@reduxjs/toolkit';
import stocksReducer from './slices/stocksSlice';
import predictionsReducer from './slices/predictionsSlice';
import portfolioReducer from './slices/portfolioSlice';

export const store = configureStore({
  reducer: {
    stocks: stocksReducer,
    predictions: predictionsReducer,
    portfolio: portfolioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 