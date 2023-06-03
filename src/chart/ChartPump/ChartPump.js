import React, { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { ApiChartPump, ContentType, https, listFarmingArea, startAndlimit } from '../../Service/ConFigURL';

export default function ChartPump() {
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
    }, [])
    const currentDates = new Date()
    const endDateChartPond = currentDates.toISOString("en-US")
    const Chartpump = async () => {
        const Params = {
            data: {
                startdate: "2023-01-01",
                enddate: endDateChartPond,
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


        <div>
            <div className='bg-white  ' style={{ borderRadius: 5 }}>
                <div className="text-lg  text-titleBorder " style={{ color: " white", fontWeight: 400, background: "#036E9B", position: "relative", }} >

                    <p className='' >Thống kê tất cả thời gian bơm và số lần bơm </p>

                </div>
                <div style={{ height: 32 }} ></div>
                <ReactApexChart type='bar' options={options} series={options.series} height={400} />
            </div>

        </div >
    )
}
