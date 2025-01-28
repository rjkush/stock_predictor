import React, { useState } from 'react';
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
import { format } from 'date-fns';

interface ImportantDatesTableProps {
  commonDates: Date[];
}

const ImportantDatesTable: React.FC<ImportantDatesTableProps> = ({ commonDates }) => {
  const [page, setPage] = useState(0);
  const datesPerPage = 5;
  const totalPages = Math.ceil(commonDates.length / datesPerPage);

  const handleNextPage = () => {
    setPage((prev) => (prev + 1) % totalPages);
  };

  const currentDates = commonDates.slice(page * datesPerPage, (page + 1) * datesPerPage);

  return (
    <Paper
      sx={{
        p: 2,
        backgroundColor: '#131722',
        width: '100%',
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Important Dates
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Common dates from both tables
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentDates.map((date, index) => (
              <TableRow key={index}>
                <TableCell
                  align="center"
                  sx={{
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  {format(date, 'dd MMM yyyy')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={handleNextPage} sx={{ mt: 2 }}>
        Next
      </Button>
    </Paper>
  );
};

export default ImportantDatesTable; 
