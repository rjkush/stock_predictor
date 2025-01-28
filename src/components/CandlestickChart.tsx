import React from 'react';
import { Chart, ChartCanvas } from 'react-financial-charts';
import { CandlestickSeries } from 'react-financial-charts/lib/series';
import { XAxis, YAxis } from 'react-financial-charts/lib/axes';
import { timeIntervalBarWidth } from 'react-financial-charts/lib/utils';
import { scaleTime, scaleLinear } from 'd3-scale';
import { utcDay } from 'd3-time';

const data = [
  { date: new Date(2022, 6, 17), open: 100, high: 110, low: 90, close: 105 },
  // Add more data points here
];

const CandlestickChart = () => {
  const xAccessor = (d: any) => d.date;
  const xExtents = [xAccessor(data[0]), xAccessor(data[data.length - 1])];

  return (
    <ChartCanvas
      height={400}
      width={800}
      ratio={3}
      margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
      seriesName="MSFT"
      data={data}
      xScale={scaleTime()}
      xAccessor={xAccessor}
      xExtents={xExtents}
    >
      <Chart id={1} yExtents={(d: any) => [d.high, d.low]}>
        <XAxis axisAt="bottom" orient="bottom" />
        <YAxis axisAt="left" orient="left" ticks={5} />
        <CandlestickSeries width={timeIntervalBarWidth(utcDay)} />
      </Chart>
    </ChartCanvas>
  );
};

export default CandlestickChart; 