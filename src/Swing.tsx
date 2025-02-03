import React, { useState } from 'react';
import { Paper, TableContainer, Table, TableBody, TableRow, TableCell, Button, Typography, Box } from '@mui/material';

const Swing = () => {
  // swingPrice holds the user input as number or empty string
  const [swingPrice, setSwingPrice] = useState<number | ''>('');
  // submittedPrice holds the confirmed swing price
  const [submittedPrice, setSubmittedPrice] = useState<number | null>(null);
  // pagination state
  const [page, setPage] = useState(1);

  // Helper function to compute supports recursively from given price
  const getSupports = (price: number, start: number, count: number): number[] => {
    const result: number[] = [];
    let current = price;
    for (let i = 0; i < start + count; i++) {
      current = Math.pow(Math.sqrt(current) - 1, 2);
      if (i >= start) {
        result.push(Number(current.toFixed(2)));
      }
    }
    return result;
  };

  // Helper function to compute resistances recursively from given price
  const getResistances = (price: number, start: number, count: number): number[] => {
    const result: number[] = [];
    let current = price;
    for (let i = 0; i < start + count; i++) {
      current = Math.pow(Math.sqrt(current) + 1, 2);
      if (i >= start) {
        result.push(Number(current.toFixed(2)));
      }
    }
    return result;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof swingPrice === 'number') {
      setSubmittedPrice(swingPrice);
      setPage(1);
    }
  };

  let supports: number[] = [];
  let resistances: number[] = [];
  if (submittedPrice !== null) {
    const startIndex = (page - 1) * 10;
    supports = getSupports(submittedPrice, startIndex, 10);
    resistances = getResistances(submittedPrice, startIndex, 10);
  }

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Swing Price Support and Resistance Levels</Typography>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label htmlFor="swingPrice">Swing Price: </label>
        <input
          id="swingPrice"
          type="number"
          value={swingPrice === '' ? '' : swingPrice.toString()}
          onChange={(e) => setSwingPrice(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Enter swing price"
          required
          style={{ marginRight: '10px', padding: '6px' }}
        />
        <Button type="submit" variant="contained" color="primary">Calculate</Button>
      </form>
      {submittedPrice !== null && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Paper sx={{ flex: 1, p: 1 }} elevation={3}>
              <Typography variant="h6" align="center">Supports (Page {page})</Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    {supports.map((value, index) => (
                      <TableRow key={index}>
                        <TableCell align="center" sx={{ px: 1, py: 1, fontSize: '0.8rem' }}>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <Paper sx={{ flex: 1, p: 1 }} elevation={3}>
              <Typography variant="h6" align="center">Resistances (Page {page})</Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    {resistances.map((value, index) => (
                      <TableRow key={index}>
                        <TableCell align="center" sx={{ px: 1, py: 1, fontSize: '0.8rem' }}>{value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button onClick={() => setPage(prev => Math.max(prev - 1, 1))} variant="contained" disabled={page === 1}>Previous Page</Button>
            <Button onClick={() => setPage(prev => prev + 1)} variant="contained" color="primary">Next Page</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Swing; 