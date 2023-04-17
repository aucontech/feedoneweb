import React from "react";
import Chart from "react-apexcharts";
import "./LineChart.css"
const LineChart = () => {
    const options = {
        chart: {
            id: "basic-bar"
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        },



    };

    const series = [
        {
            name: "series-1",
            data: [22, 33, 44, 55, 66, 77, 88, 30]
        },
    ];

    return (

        <div className="row">
            <div className="mixed-chart">
                <Chart options={options} series={series} type="bar" width="600" />

            </div>
        </div>

    );
};

export default LineChart;

