import React, { useEffect, useState } from 'react'
import { startAndlimit, ContentType, loadFishPond, loadFishPondData, https, listFarmingArea, ApiQuanTrac } from '../Service/ConFigURL';
import { DatePicker, Select, Table, Tabs } from 'antd';
import ReactApexChart from "react-apexcharts";
import { customLocale } from './DatePickerViVn';
import TabPane from 'antd/es/tabs/TabPane';
import { AiOutlineTable } from "react-icons/ai";
import { RiLineChartLine } from "react-icons/ri";
import { BsBarChart } from 'react-icons/bs';

export default function QuanTrac() {

    const [VungNuoi, setVungNuoi] = useState([])
    const [aoId, setAoId] = useState([])
    const [selectAoId, setSelectAoId] = useState()
    const [filteredData, setFilteredData] = useState([]);
    const [parameter, setParameter] = useState([])
    const [aoid, setAoID] = useState("");
    const [Value, setValue] = useState([])
    const [nameValue, setNameValue] = useState([])


    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [date, setDate] = useState(null);
    const [datePickerValue, setDatePickerValue] = useState(null);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(20);
    const [showSecondSelect, setShowSecondSelect] = useState(false);

    useEffect(() => {
        const vungNuoi = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await https.post(listFarmingArea, startAndlimit, {
                    headers: {
                        "Content-Type": ContentType
                    }
                })
                if (token) {
                    setVungNuoi(res.data.data.list)
                }
            } catch (err) {
                console.log('err: ', err);
            }
        }
        vungNuoi()
    }, [])
    /* API gọi Ao*/
    useEffect(() => {
        const aoId = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await https.post(loadFishPond, loadFishPondData, {
                    headers: {
                        "Content-Type": ContentType
                    }
                })
                if (token) {
                    setAoId(res.data.data.list)
                }
            } catch (err) {
                console.log('err: ', err);

            }
        }
        aoId()
    }, [])

    useEffect(() => {
        if (selectAoId) {
            const filteredPonds = aoId.filter(
                (item) =>
                    item.farmingArea && item.farmingArea.id === selectAoId
            );
            setFilteredData(filteredPonds);
        } else {
            setFilteredData(aoId);
        }
    }, [selectAoId, aoId]);



    const loadChartQuanTrac = async (id, value) => {
        const params = {
            "data": {
                "starttime": "2023-01-01",
                "endtime": endDateChartPond,
                "aoid": id,
                "thongsoid": value
            }
        }
        try {
            const token = localStorage.getItem('token');
            const res = await https.post(ApiQuanTrac, params, {
                headers: {
                    "Content-Type": ContentType
                }
            })
            if (token) {
                setParameter(res.data.data.datachart.lstDate);

            }
        } catch (err) {
            console.log('err: ', err);

        }
    }

    const changeValueCallApiNumber3 = (value) => {
        setAoID(value)
        if (Array.isArray(value)) {
            handleChange(value[0]);
        } else {
            handleChange(value);
        }
    };

    const handleSelectChange = (value) => {
        setSelectAoId(value);
        setShowSecondSelect(true);

    };

    const currentDates = new Date()
    const endDateChartPond = currentDates.toISOString("en-US")

    useEffect(() => {
        handleChange()
    }, [])

    const handleChange = async (value) => {
        const params = {
            "data": {
                "starttime": "2023-04-27",
                "endtime": endDateChartPond,
                "aoid": aoid,
                "thongsoid": value
            }
        }

        try {
            const token = localStorage.getItem('token');
            const res = await https.post(ApiQuanTrac, params, {
                headers: {
                    "Content-Type": ContentType
                }
            })
            if (token) {
                setParameter(res.data.data.datachart.lstDate);
                setNameValue(res.data.data.datatable[0].parameter)

                const processedData = res.data.data.datatable.map((item) => ({
                    value: item.value,
                    ucl: item.ucl,
                    lcl: item.lcl,
                    evaluate: item.evaluate,
                    createdAt: item.createdAt.slice(11, 16),
                    timeStamp: item.timeStamp.slice(0, 11)
                }))
                setValue(processedData)

                const defaultEndDate = new Date();
                const defaultStartDate = new Date(
                    defaultEndDate.getTime() - 1 * 24 * 60 * 60 * 1000
                );
                setStartDate(defaultStartDate);
                setEndDate(defaultEndDate);
                setDatePickerValue([defaultStartDate, defaultEndDate]);
            }

            if (value === 1) {
                setMinValue(3);
                setMaxValue(12)
            } else if (value === 2) {
                setMinValue(3)
                setMaxValue(12)
            }
            else if (value === 3) {
                setMinValue(20);
                setMaxValue(40);
            }
        } catch (err) {
            console.log('err: ', err);
        }
    }

    let filterDatas = parameter;
    if (startDate && endDate) {
        filterDatas = parameter.filter((item) => {
            const date = new Date(item.timeStamp);
            return date >= startDate && date <= endDate;
        });
    }
    const dates = parameter.map((obj) => {
        return new Date(obj.timeStamp);
    });
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date();
    let allDates = [];
    let currDate = new Date(maxDate);
    while (currDate <= minDate) {
        allDates.push(new Date(currDate));
        currDate.setDate(currDate.getDate() + 1);
    }
    useEffect(() => {
        handleDateChange(datePickerValue);
    }, [datePickerValue]);

    const handleDateChange = (dates) => {
        if (dates && dates.length >= 1) {
            const newEndDate = new Date(dates[1]);
            setStartDate(dates[0]);
            setEndDate(newEndDate);
            setDate(dates);
            setDatePickerValue(dates);

            const filteredData = Value.filter((item) => {
                const date = new Date(item.timeStamp);
                return date >= dates[0] && date <= dates[1];
            });
            setFilteredTableData(filteredData);
        }
        else {
            setEndDate(new Date());
            setDatePickerValue(null);
            setFilteredTableData(Value);
        }
    };

    const columns = [
        {
            title: "Ngày giờ",
            dataIndex: "timeStamp",
            key: "timeStamp",
            style: { color: "green" }
        },
        {
            title: "Giờ đo",
            dataIndex: "createdAt",
            key: "createdAt",
        },
        {
            title: nameValue.name,
            dataIndex: "value",
            key: "value",
        },
        {
            title: "LCL",
            dataIndex: "lcl",
            key: "lcl",

        },
        {
            title: "UCL",
            dataIndex: "ucl",
            key: "ucl",
        },
        {
            title: "Đánh giá",
            dataIndex: "evaluate",
            key: "evaluate",
            render: (text) => {
                if (text === "FAIL") {
                    return <p className='bg-red-500 text-white w-24 h-6 text-center' style={{ borderRadius: 3 }} >Không Đạt</p>
                } else if (text === "PASS") {
                    return <p className='bg-green-500 text-center w-24 h-6 text-white' style={{ borderRadius: 3 }} > Đạt</p>
                }
            }
        },
    ];

    const options = {
        chart: {
            type: 'line-chart',
            zoom: {
                type: "x",
                enabled: true,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 1.5,
                dataLabels: {
                    dataLabels: {
                        enabled: true,
                        position: "top",
                        style: {
                            fontSize: "14px",
                            fontWeight: "bold",
                            colors: ["#000"],
                        },
                    },
                },
            },
        },
        xaxis: {
            categories: parameter.map((data) => {
                const dateParts = data.date.slice(5, 10).split("-");
                const reveredDates = dateParts.reverse().join("-");
                return reveredDates;
            }),
        },
        yaxis: {
            show: true,
            min: minValue,
            max: maxValue,
        },
        title: {
            text: "Biểu đồ quan trắc",
            align: "center",
        },

        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 2,
            dashArray: [0, 0, 0]
        },
        colors: ['#EF4444', '#0E9CFF', '#EF4444'],
        tooltip: {
            enabled: true,
            theme: "dark",
            x: {
                show: false,
                format: "yyyy-MM-dd",
            },
        },

        legend: {
            show: true,
            showForSingleSeries: false,
            showForNullSeries: false,
            showForZeroSeries: false,
            position: "top",
            horizontalAlign: "center",
            floating: true,
            fontSize: "10px",
            fontFamily: "Helvetica, Arial",
            fontWeight: 800,
            formatter: undefined,
            inverseOrder: false,
            width: undefined,
            height: undefined,
            tooltipHoverFormatter: undefined,
            customLegendItems: [],
            offsetX: -450,
            offsetY: -30,
        },
        series: [
            {
                name: 'UCL',
                data: parameter.map((item) => item.ucl),
                strokeWidth: 1,
            },

            {
                name: nameValue.name,
                data: parameter.map((item) => item.value),
                strokeWidth: 1,
            },
            {
                name: 'LCL',
                data: parameter.map((item) => item.lcl),
                strokeWidth: 1,
            }
        ],
    };

    const handleLoadAo = (item, index) => {
        return (
            <div className='flex'>
                <div>
                    <Select
                        key={index}
                        value={selectAoId}
                        onChange={handleSelectChange}
                        defaultValue="Chọn Vùng Nuôi"
                        style={{ width: 150, }}
                    >
                        {VungNuoi.map((item) => (
                            <Select.Option key={item.id} value={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>

                {showSecondSelect &&
                    <Select
                        defaultValue="Chọn Ao"
                        style={{ width: 150 }}
                        onChange={changeValueCallApiNumber3}
                    >
                        {filteredData.map((item) => (
                            <Select.Option key={item.id} value={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                }



            </div>
        )
    }

    function onChange(key) {
        console.log(key);
    }


    return (
        <div>
            <div>
                <div className="py-2 flex">
                    {handleLoadAo()}
                    {showSecondSelect &&
                        <DatePicker.RangePicker

                            style={{ paddingRight: 10, }}
                            onChange={handleDateChange}
                            onOk={(dates) => {
                                setStartDate(dates[0]);
                                setEndDate(dates[1]);
                                setDatePickerValue(dates);
                            }}
                            locale={customLocale}
                        />}
                </div>
                {showSecondSelect && <Select
                    defaultValue="Chọn thông số"
                    style={{ width: 150 }}
                    onChange={handleChange}
                >
                    <Select.Option value={1}>pH</Select.Option>
                    <Select.Option value={2}>DO</Select.Option>
                    <Select.Option value={3}>Nhiệt Độ</Select.Option>
                </Select>
                }
                <div className=" container  flex"  >

                    <Tabs defaultActiveKey="1" className="bg-white" style={{ borderRadius: 10 }} onChange={onChange}>


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
                                height={350}
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
                                height={350}
                            />
                        </TabPane>

                        <TabPane tab={
                            <span>
                                <AiOutlineTable size={24} />
                            </span>
                        } key="3">

                            {filteredTableData.length > 0 ? (
                                <Table dataSource={filteredTableData.length > 0 ? filteredTableData : Value} pagination={{ pageSize: 5 }} style={{ width: 550 }} columns={columns} />
                            ) : (
                                <Table dataSource={Value} style={{ width: 550 }} columns={columns} />
                            )}
                        </TabPane>
                    </Tabs>
                </div>

            </div >
        </div>
    )
}