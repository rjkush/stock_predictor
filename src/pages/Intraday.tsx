import React from 'react';
import IntradayTable from '../components/IntradayTable';
import StockIntradayLevelsTable from '../components/StockIntradayLevelsTable';

const sampleData = [
    { resistance: 150, support: 145 },
    { resistance: 152, support: 148 },
    { resistance: 155, support: 150 },
];

const Intraday: React.FC = () => {
    return (
        <div>
            <h1>Intraday Page</h1>
            <p>This is the Intraday page content.</p>
            <IntradayTable data={sampleData} />
            <StockIntradayLevelsTable />
        </div>
    );
};

export default Intraday; 