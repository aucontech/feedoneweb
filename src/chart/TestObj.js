import React from 'react'
import ReactApexChart from 'react-apexcharts';

export default function TestObj() {

    const chartOptions = {
        chart: {
            id: 'basic-line',
            toolbar: {
                show: false, // Hide chart toolbar
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        series: [
            {
                name: 'Sales',
                data: [30, 40, 25, 50, 49, 21, 70, 51, 42, 60, 45, 32],
            },
        ],
        responsive: [
            {
                breakpoint: 0, // Set a breakpoint of 0 to make it responsive across all screen sizes
                options: {
                    chart: {
                        width: '80%',
                    },
                },
            },
        ],
    };
    return (
        <div>
            <ReactApexChart options={chartOptions} series={chartOptions.series} type="line" height={400} />
        </div>
    )
}
