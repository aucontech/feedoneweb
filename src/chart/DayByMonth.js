import React, { useEffect, useState } from 'react'
import { getSumByDay, https, listFarmingArea, loadFishPond, loadFishPondData, startAndlimit } from '../Service/ConFigURL'
import { DatePicker, Select, Tabs } from 'antd'
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import "./ChartTestAo.css"
import TabPane from 'antd/es/tabs/TabPane';
import { RiLineChartLine } from "react-icons/ri";

import { BsBarChart } from 'react-icons/bs';
const { Option } = Select;

export default function DayByMonth() {

    const [vungNuoi, setVungNuoi] = useState([])
    const [fishPond, setFishPond] = useState([])

    const [selectedFarmingAreaId, setSelectedFarmingAreaId] = useState()
    const [filteredData, setFilteredData] = useState([]);
    const [showSecondSelect, setShowSecondSelect] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [series, setSeries] = useState([])

    const [selectedMonth, setSelectedMonth] = useState(moment().month());
    const [selectedYear, setSelectedYear] = useState(moment().year());

    useEffect(() => {
        const fetchVungNuoi = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await https.post(listFarmingArea, startAndlimit)
                if (token) {
                    setVungNuoi(res.data.data.list)
                }
            } catch (err) {
                console.log('err: ', err);

            }
        }
        fetchVungNuoi()
    }, [])

    const serie = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310];
    const options = {

        chart: {
            type: "line",
        },
        responsive: [
            {
                breakpoint: 1440,
                options: {
                    chart: {
                        width: 800,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],

        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'asasas',
            colors: undefined,
            width: 2,
        },
        series: series,
        labels: serie.map((value, index) => ` ${index + 1}`),
        dataLabels: {
            enabled: true,
            dropShadow: {
                enabled: false,
            },
            style: {
                fontSize: "12px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 500,
                colors: undefined,
                foreColor: "#fff",

            },
            offsetX: 0,
            offsetY: 0,

            background: {
                enabled: true,
                foreColor: "#fff",
                padding: "",
                borderRadius: 5,
                borderWidth: 2,
                borderColor: "",
                opacity: 1,
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    opacity: 1,
                },
            },

        },

    }

    const onChange = (value) => {
        console.log('value: ', value);

    }



    const handleSelectChange = (value) => {
        setSelectedFarmingAreaId(value)
        setShowDatePicker(true)
        setShowSecondSelect(false);

    }

    const changeValueCallApiNumber3 = (value) => {
        if (Array.isArray(value)) {
            handleGetSumByDay(value[0],);
        } else {
            handleGetSumByDay(value,);
        }

    };

    const handleDateChange = (date) => {
        setSelectedMonth(date.month() + 1);
        setSelectedYear(date.year());
        setShowSecondSelect(false);
    }

    useEffect(() => {
        if (selectedFarmingAreaId) {
            const filteredPonds = fishPond.filter(
                (item) => item.farmingArea && item.farmingArea.id === selectedFarmingAreaId)
            setFilteredData(filteredPonds)
        } else {
            setFilteredData(fishPond)
        }
    }, [selectedFarmingAreaId, fishPond])


    useEffect(() => {
        const fetchPond = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await https.post(loadFishPond, loadFishPondData)
                if (token) {
                    setFishPond(res.data.data.list)
                }
            } catch (err) {
                console.log('err: ', err);

            }
        }
        fetchPond()
    }, [])


    useEffect(() => {
        handleGetSumByDay()
    }, [selectedFarmingAreaId, selectedMonth, selectedYear])


    const handleGetSumByDay = async (id) => {
        const Params = {
            data: {
                month: selectedMonth,
                year: selectedYear,
                aoid: id
            }
        }
        try {
            const token = localStorage.getItem('token')
            const res = await https.post(getSumByDay, Params)
            if (token) {
                const data = res.data.data.lstdatachart?.[0]
                if (data) {
                    const newSeries = { data: data.lstLong }
                    setSeries([newSeries])
                }
            }
        } catch (err) {
            console.log('err: ', err);

        }
    }

    const loadSelected = (item, index) => {
        return (
            <div>
                <div className="flex" style={{ position: "relative" }}>
                    <div>
                        <Select
                            key={index}
                            value={selectedFarmingAreaId}
                            onChange={handleSelectChange}
                            defaultValue="Chọn Vùng Nuôi"
                            style={{ width: 160, }}
                        >
                            {vungNuoi.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    {showDatePicker && <DatePicker
                        picker='month'
                        onChange={handleDateChange}
                    />}

                    <Select
                        defaultValue="Chọn Ao"
                        style={{ width: 160 }}
                        onChange={changeValueCallApiNumber3}
                    >
                        {filteredData.map((item) => (
                            <Select.Option key={item.id} value={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
        );
    };





    return (
        <div>
            {loadSelected()}

            <div className='bg-white' style={{ marginTop: 20, borderRadius: 5 }} >
                <Tabs defaultActiveKey="1" className="bg-white" style={{ borderRadius: 10, }} onChange={onChange}>
                    <TabPane tab={
                        <span >
                            <RiLineChartLine size={24} />
                        </span>
                    } key="1">
                        <ReactApexChart
                            options={options}
                            series={options.series}
                            type="line"
                            width={550}
                            height={300}
                        />
                    </TabPane>

                    <TabPane tab={
                        <span>
                            <BsBarChart size={24} />
                        </span>
                    } key="2">
                        <ReactApexChart
                            options={options}
                            series={options.series}
                            type="bar"
                            width={550}
                            height={300}
                        />
                    </TabPane>


                </Tabs>
            </div>
        </div>

    )
}
