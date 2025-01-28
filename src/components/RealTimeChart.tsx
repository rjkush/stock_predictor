import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode, ISeriesApi, LineData } from 'lightweight-charts';

const RealTimeChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#ffffff' },
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
      timeScale: {
        borderColor: '#cccccc',
      },
    });

    const lineSeries = chart.addLineSeries();
    lineSeriesRef.current = lineSeries;

    // Initial data
    const initialData: LineData[] = [
      { time: '2023-01-01', value: 100 },
      { time: '2023-01-02', value: 105 },
      { time: '2023-01-03', value: 102 },
    ];
    lineSeries.setData(initialData);

    // Simulate real-time data updates
    const interval = setInterval(() => {
      const lastDataPoint = initialData[initialData.length - 1];
      const newTime = new Date(new Date(lastDataPoint.time as string).getTime() + 24 * 60 * 60 * 1000);
      const newValue = lastDataPoint.value + (Math.random() - 0.5) * 10; // Simulate swings with larger changes
      const newDataPoint: LineData = { time: newTime.toISOString().split('T')[0], value: newValue };
      lineSeries.update(newDataPoint);
      initialData.push(newDataPoint); // Keep track of all data points
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div ref={chartContainerRef} style={{ position: 'relative', width: '100%', height: '400px' }} />;
};

export default RealTimeChart; 
