import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';

const Intraday = () => {
  const [openingPrice, setOpeningPrice] = useState("");
  const [result, setResult] = useState<{ degree: number; hour: number; hourA: number; timeInterval: string; predictedTimes: string[] } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const op = parseFloat(openingPrice);
    if (!isNaN(op) && op > 0) {
      // Calculate degree using formula: degree = MOD((SQRT(opening price)*180)-225,360)
      const raw = (Math.sqrt(op) * 180) - 225;
      const degree = ((raw % 360) + 360) % 360;
      // Compute hour as degree/60
      const hour = degree / 60;
      // Compute hourA as hour - TRUNC(hour, 0)
      const hourA = hour - Math.trunc(hour);
      
      // Compute timeInterval using: TEXT(degree/(24*60), "[h]:mm")
      // degree/(24*60) equals degree/1440, multiplied by 24 gives total hours (which is same as hour)
      const totalHours = (degree / 1440) * 24;
      const hoursPart = Math.floor(totalHours);
      const minutesPart = Math.round((totalHours - hoursPart) * 60);
      const timeInterval = `${hoursPart}:${minutesPart < 10 ? '0' : ''}${minutesPart}`;
      
      // Generate predicted times from market open (9:15 AM) to market close (3:30 PM)
      const intervalMinutes = hoursPart * 60 + minutesPart; // Convert timeInterval to minutes
      const marketOpen = 9 * 60 + 15;   // 9:15 AM in minutes (555)
      const marketClose = 15 * 60 + 30; // 3:30 PM in minutes (930)
      const predictedTimes: string[] = [];

      if (intervalMinutes > 0) {
        for (let t = marketOpen + intervalMinutes; t <= marketClose; t += intervalMinutes) {
          const hrs = Math.floor(t / 60);
          const mins = t % 60;
          let displayHrs = hrs;
          let period = "AM";
          if (hrs >= 12) {
            period = "PM";
            if (hrs > 12) {
              displayHrs = hrs - 12;
            }
          }
          if (displayHrs === 0) {
            displayHrs = 12;
          }
          const timeStr = `${displayHrs}:${mins < 10 ? '0' : ''}${mins} ${period}`;
          predictedTimes.push(timeStr);
        }
      } else {
        predictedTimes.push("Invalid interval");
      }
      
      console.log('Computed degree:', degree, 'hour:', hour, 'hourA:', hourA, 'timeInterval:', timeInterval, 'predictedTimes:', predictedTimes);
      setResult({ degree, hour, hourA, timeInterval, predictedTimes });
    } else {
      setResult(null);
    }
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Stock Opening Price</Typography>
      <Typography variant="body1" gutterBottom>
        Please enter a valid stock opening price
      </Typography>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mt: 2, display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px', mx: 'auto' }}>
        <TextField
          label="Enter Stock Opening Price"
          type="number"
          value={openingPrice}
          onChange={(e) => setOpeningPrice(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary">Calculate Time</Button>
      </Paper>
      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>Computed Stock Reversal Values</Typography>
          <Paper sx={{ p: 2, mt: 2, maxWidth: '400px', mx: 'auto' }} elevation={3}>
            <Typography variant="h6" align="center" sx={{ mt: 2 }}>
              Predicted Times:
            </Typography>
            {result.predictedTimes.map((time, idx) => (
              <Typography key={idx} variant="body1" align="center">
                {time}
              </Typography>
            ))}
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Intraday; 