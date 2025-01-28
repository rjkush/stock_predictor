import { useState } from 'react';
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
  Button,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';

interface PortfolioStock {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  value: number;
  pl: number;
  plPercent: number;
}

const mockPortfolio: PortfolioStock[] = [
  {
    symbol: 'MEDICOREM',
    name: 'Medico Remedies',
    quantity: 1000,
    avgPrice: 65.20,
    currentPrice: 67.46,
    change: 1.94,
    changePercent: 2.96,
    value: 67460,
    pl: 2260,
    plPercent: 3.46
  },
  {
    symbol: 'MEFCOM',
    name: 'Mefcom Capital Markets',
    quantity: 500,
    avgPrice: 18.75,
    currentPrice: 19.95,
    change: 0.24,
    changePercent: 1.22,
    value: 9975,
    pl: 600,
    plPercent: 6.40
  },
  // Add more mock portfolio stocks
];

export default function Portfolio() {
  const [loading, setLoading] = useState(false);

  const totalValue = mockPortfolio.reduce((sum, stock) => sum + stock.value, 0);
  const totalPL = mockPortfolio.reduce((sum, stock) => sum + stock.pl, 0);
  const totalPLPercent = (totalPL / (totalValue - totalPL)) * 100;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#131722' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Portfolio Value
                </Typography>
                <Typography variant="h4">
                  ₹{totalValue.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Today's P&L
                </Typography>
                <Typography variant="h4" color={totalPL >= 0 ? 'success.main' : 'error.main'}>
                  ₹{totalPL.toLocaleString()} ({totalPLPercent.toFixed(2)}%)
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Total Holdings
                </Typography>
                <Typography variant="h4">
                  {mockPortfolio.length}
                </Typography>
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
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Avg Price</TableCell>
                    <TableCell align="right">Current Price</TableCell>
                    <TableCell align="right">Change</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">P&L</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockPortfolio.map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell>
                        <Box>
                          <Link to={`/stock/${stock.symbol}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                              {stock.symbol}
                            </Typography>
                          </Link>
                          <Typography variant="body2" color="text.secondary">
                            {stock.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{stock.quantity}</TableCell>
                      <TableCell align="right">₹{stock.avgPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">₹{stock.currentPrice.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)`}
                          color={stock.change >= 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">₹{stock.value.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        <Typography color={stock.pl >= 0 ? 'success.main' : 'error.main'}>
                          ₹{stock.pl.toLocaleString()}
                          <br />
                          ({stock.plPercent.toFixed(2)}%)
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          component={Link}
                          to={`/stock/${stock.symbol}`}
                        >
                          Trade
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