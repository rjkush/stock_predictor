import { useState, useEffect, useRef } from 'react';
import { Box, Grid, Paper, Typography, Button, Chip } from '@mui/material';
import { createChart, ColorType } from 'lightweight-charts';
import * as tf from '@tensorflow/tfjs';

interface StockData {
  time: string;
  value: number;
}

const mockData: StockData[] = [
  { time: '2024-01-01', value: 67.46 },
  { time: '2024-01-02', value: 68.12 },
  { time: '2024-01-03', value: 69.35 },
  { time: '2024-01-04', value: 66.61 },
  // Add more mock data points
];

export default function Dashboard() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [predictedReversal, setPredictedReversal] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#131722' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#1e222d' },
        horzLines: { color: '#1e222d' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
  });

    const lineSeries = chart.addLineSeries({
      color: '#00C805',
      lineWidth: 2,
    });

    lineSeries.setData(mockData);

    // Add price scale margin to ensure the line is visible
    chart.priceScale('right').applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    });

    // Cleanup
    return () => {
      chart.remove();
};
}, []);

  // Predict reversal using TensorFlow.js
  useEffect(() => {
    async function predictReversal() {
      // Create a simple model for demonstration
      const model = tf.sequential({
        layers: [
          tf.layers.dense({ units: 10, inputShape: [5], activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });

      // In a real application, you would:
      // 1. Load pre-trained weights
      // 2. Process historical data
      // 3. Make actual predictions
      
      // For demo, we'll set a mock prediction
      const mockPredictionDate = new Date();
      mockPredictionDate.setDate(mockPredictionDate.getDate() + 5);
      setPredictedReversal(mockPredictionDate.toLocaleDateString());
    }

    predictReversal();
  }, []);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: '#131722' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Medico Remedies (NSE: MEDICOREM)
              </Typography>
              <Box>
                <Chip
                  label={`₹67.46 (+1.94)`}
                  color="success"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label="2.96%"
                  color="success"
                />
              </Box>
            </Box>
            <div ref={chartContainerRef} />
            {predictedReversal && (
              <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(0, 200, 5, 0.1)', borderRadius: 1 }}>
                <Typography variant="subtitle1" color="primary">
                  Predicted Reversal Date: {predictedReversal}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Based on technical analysis and machine learning predictions
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: '#131722' }}>
            <Typography variant="h6" gutterBottom>
              Technical Indicators
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">RSI (14)</Typography>
                <Typography variant="body1">65.42</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">MACD</Typography>
                <Typography variant="body1">1.234</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Moving Avg (20)</Typography>
                <Typography variant="body1">₹65.78</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Volume</Typography>
                <Typography variant="body1">2.115M</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, backgroundColor: '#131722' }}>
            <Typography variant="h6" gutterBottom>
              Market Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                <Typography variant="body1">₹824.56Cr</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">P/E Ratio</Typography>
                <Typography variant="body1">22.45</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">52W High</Typography>
                <Typography variant="body1">₹72.35</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">52W Low</Typography>
                <Typography variant="body1">₹45.20</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 
