import React, { useEffect, useState } from 'react'
import { ApiChartPump, ContentType, https, listFarmingArea, startAndlimit } from '../../Service/ConFigURL';
import ReactApexChart from 'react-apexcharts';
import { DatePicker, Tabs } from 'antd';
import { customLocale } from '../DatePickerViVn';

export default function ChartPumpTime() {
    const [loadNameFaming, setLoadNameFarming] = useState([]);

    const [loadPump, setLoadPump] = useState([])
    const [loadPump1, setLoadPump1] = useState([])
    const [loadNamePump, setLoadNamePump] = useState([])


    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()

    useEffect(
        () => {
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await https.post(listFarmingArea, startAndlimit, {
                        headers: {
                            "Content-Type": ContentType,
                        },
                    });
                    if (token) {
                        setLoadNameFarming(response.data.data.list);
                    }
                } catch (err) {
                    console.log("err: ", err);
                }
            };
            fetchData();
        }, []
    );



    useEffect(() => {
        Chartpump()
    }, [startDate, endDate])
    const Chartpump = async () => {
        if (!startDate || !endDate) return;
        const Params = {
            data: {
                startdate: startDate,
                enddate: endDate,
                vungnuoiid: 2
            }
        }
        try {
            const token = localStorage.getItem('token')
            const response = await https.post(ApiChartPump, Params)

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


        <div >
            <div className='bg-white  ' style={{ borderRadius: 5 }}>
                <div className="text-lg  text-titleBorder " style={{ color: " white", fontWeight: 400, background: "#036E9B", position: "relative", }} >

                    <p >Thống kê trạm bơm theo khoảng thời gian </p>

                </div>
                <div>
                    <DatePicker.RangePicker
                        style={{ position: 'relative', top: 5 }}
                        value={[startDate, endDate]}
                        onChange={(dates) => {
                            setStartDate(dates[0]);
                            setEndDate(dates[1]);
                        }}
                        locale={customLocale}
                    />
                </div>


                <ReactApexChart

                    options={options}
                    series={options.series}
                    type="bar"
                    height={400}

                />


            </div>

        </div >
    )
}
