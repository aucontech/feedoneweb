import React, { useState, useEffect } from 'react';
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css';
import Chart from 'react-apexcharts';
import { ApiFeedByDate, ApiStartEndChart, https } from '../Service/ConFigURL';
import 'moment/locale/vi';
import { customLocale } from './DatePickerViVn';
import "./LineChart.css"

export default function LineChart() {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [data, setData] = useState([]);
    const [date, setDate] = useState(null);
    const [dataFishPond, setDataFishPond] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    console.log('selectedData: ', selectedData);

    useEffect(() => {
        const fetchData = async () => {
            const response = await https.post(ApiFeedByDate, ApiStartEndChart);
            setData(response.data.data.datachart[0].lstDate);
            setDataFishPond(response.data.data.datachart[0].fishPond)
        }
        fetchData();
    }, []);

    const handleDateChange = (dates) => {
        setStartDate(dates[0]);
        setEndDate(dates[1]);
        setDate(dates);
        const filteredData = data.filter((item) => {
            const date = new Date(item.date);
            return date >= dates[0] && date <= dates[1];
        });
        setSelectedData(filteredData);
        const chartData = filteredData.map((item) => item.quantity);
        chartOptions.series[0].data = chartData;
    };

    let filteredData = data;
    if (startDate && endDate) {
        filteredData = data.filter((item) => {
            const date = new Date(item.date);
            return date >= startDate && date <= endDate;
        });
    }

    const dates = data.map((obj) => {
        return new Date(obj.date)
    })
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    let allDates = [];
    let currDate = new Date(minDate);
    while (currDate <= maxDate) {
        allDates.push(new Date(currDate));
        currDate.setDate(currDate.getDate() + 1);

    }
    const result = allDates.map(date => {
        const dateString = date.toISOString().slice(0, 19).replace('T', ' ');
        const foundObj = data.find(obj => obj.date === dateString);
        if (foundObj) {
            return foundObj;
        } else {
            return {
                date: dateString,
                quantity: 0,
                mass: null,
                value: null,
                ucl: null,
                lcl: null,
                count: null
            };
        }
    });
    const mergedData = result.map((obj) => {
        const foundObj = filteredData.find(item => item.date.slice(0, 10) === obj.date.slice(0, 10));
        if (foundObj) {
            return {
                ...obj,
                quantity: foundObj.quantity,
            };
        } else {
            return {
                ...obj,
                quantity: 0,
                mass: null,
                value: null,
                ucl: null,
                lcl: null,
                count: null,
            };
        }
    });
    mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartOptions = {
        chart: {
            id: 'bar-chart',
            animations: {
                enabled: false
            },
            zoom: {
                enabled: false,
            }
        },
        xaxis: {
            categories: mergedData.map((data) => data.date.slice(5, 10)),
        },
        yaxis: {
            title: {
                text: ''
            }
        },
        title: {
            text: 'Biểu đồ lượng thức ăn tiêu thụ (Kg)',
            align: "center"
        },
        legend: {
            show: true,
            showForSingleSeries: true,
            showForNullSeries: false,
            showForZeroSeries: false,
            position: 'top',
            horizontalAlign: 'center',
            floating: false,
            fontSize: '20px',
            fontFamily: 'Helvetica, Arial',
            fontWeight: 800,
            formatter: undefined,
            inverseOrder: false,
            width: undefined,
            height: undefined,
            tooltipHoverFormatter: undefined,
            customLegendItems: [],
            offsetX: 0,
            offsetY: 0,
            labels: {
                colors: undefined,
                useSeriesColors: false
            }
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 1,
            dashArray: 0,
        },

        tooltip: {
            enabled: true,
            theme: 'dark',
            x: {
                show: true,
                format: 'yyyy-MM-dd'
            }
        },
        dataLabels: {
            enabled: true,
        },
        series: [
            {
                name: dataFishPond.name,
                data: mergedData.map((data) => data.quantity),
                strokeWidth: 1,
            }
        ]
    }


    return (
        <div className='bg-gray-100 chart-date'>
            <DatePicker.RangePicker value={[startDate, endDate, date]} onChange={handleDateChange} locale={customLocale} />
            <div className=''>
                <Chart options={chartOptions} series={chartOptions.series} type="line" width={1000} height={500} />
            </div>
        </div >

    );
};
