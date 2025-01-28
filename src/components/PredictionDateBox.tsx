import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addDays } from 'date-fns';

interface PredictionDate {
  cycle: number;
  monthsFromStart: number;
  date: Date;
  description: string;
}

// Define the pattern of days to add for each step
const DATE_ADJUSTMENTS = [
  { daysToAdd: 0, description: 'Base Date' },
  { daysToAdd: 30, description: '30 Days' },
  { daysToAdd: 60, description: '60 Days' },
  { daysToAdd: 90, description: '90 Days' },
  { daysToAdd: 120, description: '120 Days' },
  { daysToAdd: 180, description: '180 Days' },
  { daysToAdd: 240, description: '240 Days' }
];

export default function PredictionDateBox() {
  const [startDate, setStartDate] = useState<Date | null>(new Date('2022-07-17')); // Default to July 17, 2022
  const [predictionDates, setPredictionDates] = useState<PredictionDate[]>([]);
  const [currentCycle, setCurrentCycle] = useState(1);

  useEffect(() => {
    if (startDate) {
      calculatePredictionDates(startDate);
    }
  }, [startDate, currentCycle]);

  const calculatePredictionDates = (baseDate: Date) => {
    const dates: PredictionDate[] = [];
    let currentBaseDate = baseDate;

    // Calculate dates for the current cycle
    for (let cycle = 1; cycle <= currentCycle; cycle++) {
      DATE_ADJUSTMENTS.forEach(({ daysToAdd, description }) => {
        const adjustedDate = addDays(currentBaseDate, daysToAdd);
        dates.push({
          cycle,
          monthsFromStart: Math.floor(daysToAdd / 30),
          date: adjustedDate,
          description: `${description} (Cycle ${cycle})`
        });
      });
      // Set the last date of the current cycle as the new base date
      currentBaseDate = dates[dates.length - 1].date;
    }

    setPredictionDates(dates);
  };

  const handleNextCycle = () => {
    setCurrentCycle(prev => prev + 1);
  };

  const handlePreviousCycle = () => {
    if (currentCycle > 1) {
      setCurrentCycle(prev => prev - 1);
    }
  };

  return (
    <Paper sx={{ p: 3, backgroundColor: '#131722' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Trading Cycle Calculator
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Calculate trading dates based on cycles starting from the base date
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Base Date"
              value={startDate}
              onChange={(newValue: Date | null) => setStartDate(newValue)}
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper'
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label="Previous Cycle"
              onClick={handlePreviousCycle}
              disabled={currentCycle === 1}
              sx={{ minWidth: 120 }}
            />
            <Typography variant="body1" sx={{ mx: 2 }}>
              Cycle {currentCycle}
            </Typography>
            <Chip
              label="Next Cycle"
              onClick={handleNextCycle}
              color="primary"
              sx={{ minWidth: 120 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
} 