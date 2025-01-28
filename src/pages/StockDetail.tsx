import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs
} from '@mui/material';
import { createChart } from 'lightweight-charts';
import * as tf from '@tensorflow/tfjs';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function StockDetail() {
  const { symbol } = useParams<{ symbol: string }>();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [tabValue, setTabValue] = useState(0);
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
      height: 500,
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#00C805',
      downColor: '#ff4976',
      borderVisible: false,
      wickUpColor: '#00C805',
      wickDownColor: '#ff4976',
    });

    // Mock candlestick data
    const data = [
      { time: '2024-01-01', open: 67.46, high: 68.66, low: 67.14, close: 68.12 },
      { time: '2024-01-02', open: 68.12, high: 69.35, low: 67.89, close: 69.35 },
      { time: '2024-01-03', open: 69.35, high: 69.45, low: 66.61, close: 66.61 },
      // Add more mock data
    ];

    candlestickSeries.setData(data);

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const volumeData = data.map(item => ({
      time: item.time,
      value: Math.random() * 1000000,
      color: item.close >= item.open ? '#00C805' : '#ff4976',
    }));

    volumeSeries.setData(volumeData);

    return () => {
      chart.remove();
    };
  }, []);

  // Predict reversal using TensorFlow.js
  useEffect(() => {
    async function predictReversal() {
      const model = tf.sequential({
        layers: [
          tf.layers.lstm({ units: 50, inputShape: [30, 5], returnSequences: true }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.lstm({ units: 50, returnSequences: false }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 1 })
        ]
      });

      // Mock prediction date
      const mockPredictionDate = new Date();
      mockPredictionDate.setDate(mockPredictionDate.getDate() + 5);
      setPredictedReversal(mockPredictionDate.toLocaleDateString());
    }

    predictReversal();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, backgroundColor: '#131722' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                {symbol || 'MEDICOREM'} - Medico Remedies
              </Typography>
              <Box>
                <Chip
                  label="₹67.46"
                  color="default"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label="+1.94 (2.96%)"
                  color="success"
                />
              </Box>
            </Box>
            <div ref={chartContainerRef} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ backgroundColor: '#131722' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Overview" />
              <Tab label="Technical Analysis" />
              <Tab label="Predictions" />
              <Tab label="News" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Market Cap</TableCell>
                          <TableCell>₹824.56Cr</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>P/E Ratio</TableCell>
                          <TableCell>22.45</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Book Value</TableCell>
                          <TableCell>₹34.56</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Dividend Yield</TableCell>
                          <TableCell>1.25%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>52 Week High</TableCell>
                          <TableCell>₹72.35</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>52 Week Low</TableCell>
                          <TableCell>₹45.20</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Volume</TableCell>
                          <TableCell>2.115M</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Avg. Volume (30D)</TableCell>
                          <TableCell>1.876M</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Technical Indicators</Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>RSI (14)</TableCell>
                          <TableCell>65.42</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>MACD</TableCell>
                          <TableCell>1.234</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Stochastic %K</TableCell>
                          <TableCell>75.45</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Stochastic %D</TableCell>
                          <TableCell>68.23</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Moving Averages</Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>MA (20)</TableCell>
                          <TableCell>₹65.78</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>MA (50)</TableCell>
                          <TableCell>₹63.45</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>MA (100)</TableCell>
                          <TableCell>₹61.23</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>MA (200)</TableCell>
                          <TableCell>₹58.90</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {predictedReversal && (
                <Box sx={{ p: 2, backgroundColor: 'rgba(0, 200, 5, 0.1)', borderRadius: 1, mb: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Next Predicted Reversal: {predictedReversal}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Based on machine learning analysis of historical patterns, technical indicators, and market sentiment.
                  </Typography>
                </Box>
              )}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Prediction Metrics</Typography>
                  <TableContainer>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell>Confidence Score</TableCell>
                          <TableCell>85%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Historical Accuracy</TableCell>
                          <TableCell>78%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Predicted Direction</TableCell>
                          <TableCell>
                            <Chip label="Bullish" color="success" size="small" />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography variant="body1" color="text.secondary">
                Latest news and updates will appear here...
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 