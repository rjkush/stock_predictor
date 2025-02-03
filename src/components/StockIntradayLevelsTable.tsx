import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';

const StockIntradayLevelsTable: React.FC = () => {
    const [openingPrice, setOpeningPrice] = useState<number | "">("");
    const [levels, setLevels] = useState<{ resistance: number; support: number }[]>([]);

    const calculateLevels = () => {
        if (typeof openingPrice === 'number') {
            const newLevels = Array.from({ length: 15 }, (_, i) => ({
                resistance: openingPrice + (i + 1) * 0.5,
                support: openingPrice - (i + 1) * 0.5,
            }));
            setLevels(newLevels);
        }
    };

    return (
        <div>
            <TextField
                label="Opening Price"
                type="number"
                value={openingPrice}
                onChange={(e) => setOpeningPrice(parseFloat(e.target.value))}
                variant="outlined"
                sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" onClick={calculateLevels} sx={{ mb: 2 }}>
                Calculate Levels
            </Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Resistance</TableCell>
                            <TableCell>Support</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {levels.map((level, index) => (
                            <TableRow key={index}>
                                <TableCell>{level.resistance.toFixed(2)}</TableCell>
                                <TableCell>{level.support.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default StockIntradayLevelsTable; 