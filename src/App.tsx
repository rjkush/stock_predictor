import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StockDetail from './pages/StockDetail';
import Portfolio from './pages/Portfolio';
import Predictions from './pages/Predictions';
import TestComponent from './components/TestComponent';
import StockReversalTable from './components/StockReversalTable';
import ImportantDatesTable from './components/ImportantDatesTable';
import Swing from './Swing';
import Intraday from './pages/Intraday';
import React, { useState } from 'react';

console.log('App component is rendering'); // Debug log

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00C805',
    },
    background: {
      default: '#1E2023',
      paper: '#131722',
    },
  },
});

function App() {
  console.log('Inside App component'); // Debug log
  
  const [dates1, setDates1] = useState<Date[]>([]);
  const [dates2, setDates2] = useState<Date[]>([]);

  const findCommonDates = (dates1: Date[], dates2: Date[]) => {
    const set1 = new Set(dates1.map(date => date.toDateString()));
    return dates2.filter(date => set1.has(date.toDateString()));
  };

  const commonDates = findCommonDates(dates1, dates2);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Layout>
          <TestComponent />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <StockReversalTable onDatesChange={setDates1} />
            <StockReversalTable onDatesChange={setDates2} />
          </div>
          <ImportantDatesTable commonDates={commonDates} />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock/:symbol" element={<StockDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/swing" element={<Swing />} />
            <Route path="/intraday" element={<Intraday />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
