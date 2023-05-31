import React from 'react';
import Chart from 'react-apexcharts';

const TestChart = () => {
    const chart1Options = {
        chart: {
            id: 'chart1',
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        },
    };

    const chart1Series = [
        {
            name: 'Series 1',
            data: [30, 40, 25, 50, 49, 60],
        },
    ];

    const chart2Options = {
        chart: {
            id: 'chart2',
        },
        xaxis: {
            categories: ['A', 'B', 'C', 'D', 'E', 'F'],
        },
    };

    const chart2Series = [
        {
            name: 'Series 1',
            data: [10, 20, 30, 40, 50, 60],
        },
    ];

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '44%', }}>
                <Chart
                    options={chart1Options}
                    series={chart1Series}
                    type="bar"
                />
            </div>
            <div style={{ width: '44%' }}>
                <Chart
                    options={chart2Options}
                    series={chart2Series}
                    type="line"
                />
            </div>
        </div>
    );
};

export default TestChart;
