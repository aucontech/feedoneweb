import React, { useEffect, useState } from 'react'
import { ApiChartPumpYear, https } from '../../Service/ConFigURL'
import moment from 'moment'
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import ReactApexChart from 'react-apexcharts';
const monthFormat = 'YYYY';
export default function ChartPumpYear() {

    const [loadPump, setLoadPump] = useState([])
    const [loadPump1, setLoadPump1] = useState([])
    const [loadNamePump, setLoadNamePump] = useState([])

    const [selectYear, setSelectYear] = useState(moment().year())

    useEffect(() => {
        Chartpump()
    }, [selectYear])
    const Chartpump = async () => {
        const Params = {
            data: {
                year: selectYear,
                vungnuoiid: 2
            }
        }
        try {
            const token = localStorage.getItem('token')
            const response = await https.post(ApiChartPumpYear, Params)

            if (token) {
                const lstNumber = response.data.data.lstdatachart;
                const names = lstNumber.map((item) => item.device.name);
                setLoadNamePump(names);

                const dataPump = lstNumber.map((item) => item.lstNumber[0][0])
                setLoadPump(dataPump)
                const dataPump1 = lstNumber.map((item) => item.lstNumber[0][1])
                setLoadPump1(dataPump1)
            }
        }
        catch (err) {
            console.log('err: ', err);

        }
    }
    const handleDatePickerYear = date => {
        setSelectYear(date.year())
    }
    const options = {
        chart: {
            type: 'bar',
            stacked: false,
        },
        plotOptions: {
            bar: {

                borderRadius: 2,
                dataLabels: {
                    position: "top",
                },
            },
        }, legend: {
            position: 'top',
        },
        xaxis: {
            categories: loadNamePump
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        colors: ['#429D44', '#036E9B',],
        series: [
            {
                name: "Số lần bơm",
                data: loadPump.map(item => item)
            },
            {
                name: "Số giờ bơm",
                data: loadPump1.map(item => item)
            }
        ],
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val;
            },
            offsetY: -20,
            style: {
                fontSize: '13px',
                colors: ["#FF5252"],
                fontWeight: 400,

            },
            background: {
                enabled: false,
                foreColor: '#fff',
                padding: 4,
                borderRadius: 0,
                borderWidth: 0,
                borderColor: '',
                opacity: 0.01,
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#fff',
                    opacity: 0.45
                }
            },
        },


    }
    return (
        <div>
            <div className='bg-white  ' style={{ borderRadius: 5 }}>
                <div className="text-lg  text-titleBorder " style={{ color: " white", fontWeight: 400, background: "#036E9B", position: "relative", }} >

                    <p >Thống kê thời gian bơm theo năm </p>

                </div>
                <div>
                    <DatePicker sdefaultValue={dayjs("2023", monthFormat)} format={monthFormat} picker='year' onChange={handleDatePickerYear} />
                </div>


                <ReactApexChart

                    options={options}
                    series={options.series}
                    type="bar"
                    height={400}

                />


            </div>

        </div>
    )
}

