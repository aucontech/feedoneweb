import React, { useEffect, useState } from 'react'
import { getSumByMonth, https, listFarmingArea, loadFishPond, loadFishPondData, startAndlimit } from '../Service/ConFigURL';
import { Select, Space, Tabs } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { DatePicker } from 'antd';
import moment from 'moment';
import { customYear } from './DatePickerViVn';
import TabPane from 'antd/es/tabs/TabPane';
import { RiLineChartLine } from "react-icons/ri";

import { BsBarChart } from 'react-icons/bs';
const { Option } = Select;

export default function MonthByYear() {

    const [vungNuoi, setLoadVungNuoi] = useState([])
    const [pond, setPond] = useState([])

    const [selectFarmingAreaId, setSelectFarmingAreaId] = useState()
    const [filteredData, setFilteredData] = useState([]);


    const [series, setSeries] = useState([]);
    const [selectedYear, setSelectedYear] = useState(moment().year(2023));
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        const fetchVungNuoi = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await https.post(listFarmingArea, startAndlimit)
                if (token) {
                    setLoadVungNuoi(res.data.data.list)
                }
            } catch (err) {
                console.log('err: ', err);

            }
        }
        fetchVungNuoi()
    }, [])

    useEffect(() => {
        if (selectFarmingAreaId) {
            const filterPond = pond.filter((item) => item.farmingArea && item.farmingArea.id === selectFarmingAreaId
            )
            setFilteredData(filterPond)
        }
    }, [selectFarmingAreaId, pond])

    const handleSelectChange = (value) => {
        setSelectFarmingAreaId(value)
        setShowDatePicker(true)

    }
    useEffect(() => {
        const fetchPond = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await https.post(loadFishPond, loadFishPondData)
                if (token) {
                    setPond(res.data.data.list)
                }
            } catch (err) {
                console.log('err: ', err);

            }
        }
        fetchPond()
    }, [])


    const changeValueCallApiNumber3 = (value) => {
        if (Array.isArray(value)) {
            handleGetSumByMonth(value[0]);
        } else {
            handleGetSumByMonth(value);
        }
    };

    useEffect(() => {
        handleGetSumByMonth()
    }, [selectedYear,])

    const handleDatePickerChange = (date, dateString) => {
        setSelectedYear(date.year());

    }

    const handleGetSumByMonth = async (id) => {
        const Params = {
            data: {
                year: selectedYear,
                aoid: id
            }
        }
        try {
            const token = localStorage.getItem('token');
            const res = await https.post(getSumByMonth, Params);
            if (token) {
                const data = res.data.data.lstdatachart?.[0];
                if (data) {
                    const newSeries = { data: data.lstLong };
                    setSeries([newSeries]);

                }
            }
        } catch (err) {
        }
    }

    const handleSelect = (item, index) => {
        return (
            <div className='flex'>
                <Select
                    key={index}
                    value={selectFarmingAreaId}
                    onChange={handleSelectChange}
                    defaultValue={"Chọn Vùng Nuôi"}
                    style={{ width: 180 }}
                >
                    {vungNuoi.map((item) => (
                        <Select.Option key={item.id} value={item.id} >
                            {item.name}
                        </Select.Option>
                    ))}
                </Select>

                {showDatePicker &&
                    <div >
                        <Space direction="vertical">
                            <DatePicker
                                onChange={handleDatePickerChange}
                                picker="year"
                                locale={customYear}
                            />
                        </Space>
                    </div>
                }
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
        )
    }

    const options = {

        chart: {
            type: "line",
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 400,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
        series: series,
        labels: ["Th 1", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "Th 8", "Th 9", "Th 10", "Th 11", "Th 12",],
        dataLabels: {
            enabled: true,
            dropShadow: {
                enabled: false,
            },
            style: {
                fontSize: "14px",
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
                padding: 4,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#fff",
                opacity: 0.9,
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

    return (
        <div>
            <div className='flex'>
                {handleSelect()}


            </div>
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
            <div>
                <p>Biểu đồ lượng thức ăn theo năm</p>
            </div>
        </div>
    )
}
