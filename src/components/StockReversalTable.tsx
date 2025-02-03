import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays } from 'date-fns';

const REVERSAL_INTERVALS = [0, 30, 60, 90, 120, 180, 240, 360];

const calculateReversalDates = (baseDate: Date, cycles: number) => {
  const dates: { interval: number; date: Date }[] = [];
  let currentBaseDate = baseDate;

  for (let cycle = 0; cycle < cycles; cycle++) {
    REVERSAL_INTERVALS.forEach((days) => {
      const newDate = addDays(currentBaseDate, days);
      dates.push({ interval: days + cycle * 360, date: newDate });
    });
    // Set the last date of the current cycle as the new base date
    currentBaseDate = addDays(currentBaseDate, 360);
  }

  return dates;
};

interface StockReversalTableProps {
  onDatesChange: (dates: Date[]) => void;
}

const StockReversalTable: React.FC<StockReversalTableProps> = ({ onDatesChange }) => {
  const [baseDate, setBaseDate] = useState<Date | null>(new Date());
  const [currentCycle, setCurrentCycle] = useState(0);
  const reversalDates = calculateReversalDates(baseDate || new Date(), 6); // Calculate for 6 cycles

  useEffect(() => {
    const dates = reversalDates.map(entry => entry.date);
    onDatesChange(dates);
  }, [reversalDates, onDatesChange]);

  const handleNextCycle = () => {
    setCurrentCycle((prev) => (prev + 1) % 6);
  };

  return (
    <Paper sx={{ p: 2, backgroundColor: '#131722', width: '45%', float: 'left', marginRight: '5%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Stock Reversal Dates
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Predicted reversal dates based on intervals
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Base Date"
            value={baseDate}
            onChange={(newValue: Date | null) => setBaseDate(newValue)}
            sx={{
              width: '100%',
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper'
              }
            }}
          />
        </LocalizationProvider>
        <Button variant="contained" color="primary" onClick={handleNextCycle} sx={{ mt: 2 }}>
          {currentCycle < 5 ? 'Show Next Cycle' : 'Show First Cycle'}
        </Button>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Interval (Days)</TableCell>
              <TableCell>Reversal Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reversalDates
              .filter((_, index) => Math.floor(index / REVERSAL_INTERVALS.length) === currentCycle)
              .map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.interval}</TableCell>
                  <TableCell>{format(entry.date, 'dd MMM yyyy')}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default StockReversalTable; 
