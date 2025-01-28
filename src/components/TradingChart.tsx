import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';

const TradingChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#333',
      },
      grid: {
        vertLines: {
          color: '#e1e1e1',
        },
        horzLines: {
          color: '#e1e1e1',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: '#cccccc',
      },
      timeScale: {
        borderColor: '#cccccc',
      },
    });

    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData([
      { time: '2023-01-01', open: 100, high: 110, low: 90, close: 105 },
      { time: '2023-01-02', open: 105, high: 115, low: 95, close: 100 },
      { time: '2023-01-03', open: 100, high: 120, low: 85, close: 115 },
      // Add more data points here
    ]);

    return () => chart.remove();
  }, []);

  return <div ref={chartContainerRef} style={{ position: 'relative', width: '100%', height: '400px' }} />;
};

export default TradingChart; 
