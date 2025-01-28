import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';

interface PredictionData {
  symbol: string;
  name: string;
  currentPrice: number;
  predictedReversal: string;
  confidence: number;
  direction: 'bullish' | 'bearish';
  potentialReturn: number;
  indicators: {
    rsi: number;
    macd: number;
    volume: string;
  };
}

const mockPredictions: PredictionData[] = [
  {
    symbol: 'MEDICOREM',
    name: 'Medico Remedies',
    currentPrice: 67.46,
    predictedReversal: '2024-02-02',
    confidence: 85,
    direction: 'bullish',
    potentialReturn: 12.5,
    indicators: {
      rsi: 65.42,
      macd: 1.234,
      volume: '2.115M'
    }
  },
  {
    symbol: 'MEFCOM',
    name: 'Mefcom Capital Markets',
    currentPrice: 19.95,
    predictedReversal: '2024-02-03',
    confidence: 78,
    direction: 'bearish',
    potentialReturn: -8.3,
    indicators: {
      rsi: 72.15,
      macd: -0.456,
      volume: '1.876M'
    }
  },
  // Add more mock predictions
];

export default function Predictions() {
  const [loading, setLoading] = useState(false);
  const [modelAccuracy, setModelAccuracy] = useState(82.5);

  useEffect(() => {
    async function trainModel() {
      // Initialize TensorFlow.js model
      const model = tf.sequential({
        layers: [
          tf.layers.lstm({
            units: 50,
            inputShape: [30, 5],
            returnSequences: true
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.lstm({
            units: 50,
            returnSequences: false
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 1 })
        ]
      });

      // In a real application, you would:
      // 1. Load historical data
      // 2. Preprocess data
      // 3. Train the model
      // 4. Make predictions
      // 5. Update UI with real predictions
    }

    trainModel();
  }, []);

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#131722' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Stock Reversal Predictions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI-powered predictions based on technical analysis, market sentiment, and historical patterns
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Model Accuracy
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Typography variant="h4" sx={{ mr: 2 }}>
                      {modelAccuracy}%
                    </Typography>
                    <Box sx={{ width: '200px' }}>
                      <LinearProgress
                        variant="determinate"
                        value={modelAccuracy}
                        color="primary"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ backgroundColor: '#131722' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Stock</TableCell>
                    <TableCell align="right">Current Price</TableCell>
                    <TableCell align="right">Predicted Reversal</TableCell>
                    <TableCell align="right">Confidence</TableCell>
                    <TableCell align="right">Direction</TableCell>
                    <TableCell align="right">Potential Return</TableCell>
                    <TableCell align="right">Technical Indicators</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockPredictions.map((prediction) => (
                    <TableRow key={prediction.symbol}>
                      <TableCell>
                        <Box>
                          <Link to={`/stock/${prediction.symbol}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {prediction.symbol}
                            </Typography>
                          </Link>
                          <Typography variant="body2" color="text.secondary">
                            {prediction.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">₹{prediction.currentPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">{new Date(prediction.predictedReversal).toLocaleDateString()}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Typography sx={{ mr: 1 }}>{prediction.confidence}%</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={prediction.confidence}
                            color={prediction.confidence >= 80 ? 'success' : 'primary'}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={prediction.direction.toUpperCase()}
                          color={prediction.direction === 'bullish' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={prediction.potentialReturn >= 0 ? 'success.main' : 'error.main'}>
                          {prediction.potentialReturn >= 0 ? '+' : ''}{prediction.potentialReturn}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Box>
                          <Typography variant="body2">
                            RSI: {prediction.indicators.rsi}
                          </Typography>
                          <Typography variant="body2">
                            MACD: {prediction.indicators.macd}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Vol: {prediction.indicators.volume}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          component={Link}
                          to={`/stock/${prediction.symbol}`}
                        >
                          Analyze
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 