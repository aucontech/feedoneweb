import React, { useEffect, useState } from 'react'
import { ApiQuanTrac, ContentType, https, listFarmingArea, loadFishPond, loadFishPondData, startAndlimit } from '../../Service/ConFigURL';
import { DatePicker, Menu, Select, Table, Tabs } from 'antd';
import { customLocale } from '../DatePickerViVn';
import TabPane from 'antd/es/tabs/TabPane';
import ReactApexChart from 'react-apexcharts';
import { AiOutlineTable } from 'react-icons/ai';
import { RiLineChartLine } from 'react-icons/ri';
import SubMenu from 'antd/es/menu/SubMenu';

export default function ChartQuanTracDemo() {

    const [loadNameFaming, setLoadNameFarming] = useState([]);// load vùng nuôi
    const [pondData, setPondData] = useState([]) // load ao nuôi
    const [selectedFarmingAreaId, setSelectedFarmingArea] = useState();// dùng để liên kết ao và chart 
    const [filteredData, setFilteredData] = useState([]);// hàm để hứng , lấy trực tiếp ao nuôi được lấy từ state pondData

    const [parameter, setParameter] = useState([])
    const [aoid, setAoID] = useState();
    const [Value, setValue] = useState([])
    const [nameValue, setNameValue] = useState([])
    const [startDateMon, setStartDateMon] = useState(null);
    const [endDateMon, setEndDateMon] = useState(null);
    const [date, setDate] = useState(null);
    const [datePickerValueMon, setDatePickerValueMon] = useState(null);
    const [filteredTableDataMon, setFilteredTableDataMon] = useState([]);
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(20);

    useEffect(() => {//  API load tên vùng nuôi
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await https.post(listFarmingArea, startAndlimit)
                if (token) {
                    setLoadNameFarming(response.data.data.list);
                }
            } catch (err) {
                console.log("err: ", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {// API load tên Ao
        const loadPond = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await https.post(loadFishPond, loadFishPondData, {
                    headers: {
                        "Content-Type": ContentType,
                    },
                });
                if (token) {
                    setPondData(response.data.data.list);
                }
            } catch (err) {
                console.log("err: ", err);
            }
        };
        loadPond();
    }, []);

    useEffect(() => {// API tìm tên Ao trùng id với chart
        if (selectedFarmingAreaId) {
            const filteredPonds = pondData.filter((item) => item.farmingArea && item.farmingArea.id === selectedFarmingAreaId);
            setFilteredData(filteredPonds);
        } else {
            setFilteredData(pondData);
        }
    }, [selectedFarmingAreaId, pondData]);

    const changeValueCallApiNumber3 = (value) => {// hàm để gọi id cho Vùng Nuôi và ao để liên kết với chart có ao nuôi
        setAoID(value)

        if (Array.isArray(value)) {
            handleChange(value[0])

        } else {
            handleChange(value)
        }
    };

    useEffect(() => {
        handleChange()
    }, [])



    const currentDates = new Date()//biến lấy ngày tháng trên hệ thống
    const endDateChartPond = currentDates.toISOString("en-US")// tạo ra biến gán vào chart để lấy ngày mới nhất trên hệ thống 

    const handleChange = async (value) => {
        const params = {
            "data": {
                "starttime": "2022-01-01",
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

                const defaultEndDateMon = new Date();
                const defaultStartDateMon = new Date(
                    defaultEndDateMon.getTime() - 360000
                );
                setStartDateMon(defaultStartDateMon);
                setEndDateMon(defaultEndDateMon);
                setDatePickerValueMon([defaultStartDateMon, defaultEndDateMon]);
            }

            if (value === 1) {
                setMinValue(0);
                setMaxValue(12)
            } else if (value === 2) {
                setMinValue(0)
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

    let filterDataMon = parameter;
    if (startDateMon && endDateMon) {
        filterDataMon = parameter.filter((item) => {
            const date = new Date(item.timeStamp);
            return date >= startDateMon && date <= endDateMon;
        });
    }
    const datesMon = parameter.map((obj) => {
        return new Date(obj.timeStamp);
    });
    const minDateMon = new Date(Math.min(...datesMon));
    const maxDateMon = new Date();
    let allDatesMon = [];
    let currDateMon = new Date(maxDateMon);
    while (currDateMon <= minDateMon) {
        allDatesMon.push(new Date(currDateMon));
        currDateMon.setDate(currDateMon.getDate() + 1);
    }
    useEffect(() => {
        handleDateChangeMon(datePickerValueMon);
    }, [datePickerValueMon]);

    const handleDateChangeMon = (dates) => {
        if (dates && dates.length >= 1) {
            const newEndDateMon = new Date(dates[1]);
            setStartDateMon(dates[0]);
            setEndDateMon(newEndDateMon);
            setDate(dates);
            setDatePickerValueMon(dates);

            const filteredData = Value.filter((item) => {
                const date = new Date(item.timeStamp);
                return date >= dates[0] && date <= dates[1];
            });
            setFilteredTableDataMon(filteredData);
        }
        else {
            setEndDateMon(new Date());
            setDatePickerValueMon(null);
            setFilteredTableDataMon(Value);
        }
    };

    const columnsMon = [
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

    const optionsMon = {
        chart: {
            type: 'line-chart',
            zoom: {
                type: "x",
                enabled: true,
            },
            height: "120"
        },
        plotOptions: {
            bar: {
                borderRadius: 1.5,
                dataLabels: {
                    dataLabels: {
                        enabled: false,
                        position: "top",
                        style: {
                            fontSize: "14px",
                            fontWeight: "bold",
                            colors: [""],
                        },
                    },
                },
            },
        },
        xaxis: {
            categories: parameter.map((data) => {
                const dateParts = data.date.slice(5, 16)
                return dateParts
            }),
        },
        yaxis: {
            show: true,
            min: minValue,
            max: maxValue,
        },

        legend: {
            position: 'top',

        },

        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 2,
            dashArray: [4, 0, 4]
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

    function onChangeQuanTrac(key) {
        console.log(key);
    }

    return (
        <div>

            <div style={{ display: 'flex' }} className='py-5' >
                <div style={{ width: '1%' }} ></div>
                <div className='menu-wrapper bg-white' style={{ width: '15%', position: 'relative', borderRadius: 5 }}  >
                    <Menu
                        className=' bg-white ' style={{ borderRadius: 5, fontSize: 11, fontWeight: 700 }}
                        mode="inline">
                        {loadNameFaming.map((item) => (
                            <SubMenu style={{}} key={item.id} title={item.name}>
                                {filteredData
                                    .filter((pond) => pond.farmingArea.id === item.id)
                                    .map((pond) => (
                                        <Menu.Item style={{ fontWeight: 500 }} key={pond.id} onClick={() => changeValueCallApiNumber3(pond.id)}>
                                            {pond.name}
                                        </Menu.Item>
                                    ))}
                            </SubMenu>
                        ))}
                    </Menu>
                </div>
                <div style={{ width: '1%' }} ></div>

                <div className='bg-white' style={{ width: '82%' }} >
                    <div className="text-lg text-titleBorder" style={{ color: "white", fontWeight: 400, }} >

                        <p>Biểu đồ quan trắc {nameValue.name} </p>
                    </div>
                    <div className="flex" style={{ marginLeft: 400, position: "relative", top: 40, zIndex: 999 }}>
                        <Select
                            defaultValue="Chọn thông số"
                            style={{ width: 150 }}
                            onChange={handleChange}
                        >
                            <Select.Option value={1}>pH</Select.Option>
                            <Select.Option value={2}>DO</Select.Option>
                            <Select.Option value={3}>Nhiệt Độ</Select.Option>
                        </Select>
                        <DatePicker.RangePicker

                            style={{ paddingRight: 10, }}
                            onChange={handleDateChangeMon}
                            onOk={(dates) => {
                                setStartDateMon(dates[0]);
                                setEndDateMon(dates[1]);
                                setDatePickerValueMon(dates);
                            }}
                            locale={customLocale}
                        />
                    </div>


                    <Tabs defaultActiveKey="1" style={{ borderRadius: 10 }} onChange={onChangeQuanTrac}>
                        <TabPane tab={
                            <span >
                                <RiLineChartLine size={20} />

                            </span>
                        } key="1">

                            <ReactApexChart
                                options={optionsMon}
                                series={optionsMon.series}
                                type="line"
                                height={450}
                            />
                        </TabPane>

                        <TabPane tab={
                            <span>
                                <AiOutlineTable size={24} />
                            </span>
                        } key="2">
                            <div className="text-lg" style={{ color: "white", fontWeight: 400, background: "#036E9B", position: "relative", bottom: 125, borderRadius: 5 }} >

                                <p>Lịch sử thông số đo {nameValue.name}  </p>
                            </div>
                            {filteredTableDataMon.length > 0 ? (
                                <Table className='' dataSource={filteredTableDataMon.length > 0 ? filteredTableDataMon : Value} pagination={{ pageSize: 10 }} columns={columnsMon} />
                            ) : (
                                <Table className='' dataSource={Value} pagination={{ pageSize: 10 }} columns={columnsMon} />
                            )}
                        </TabPane>
                    </Tabs>
                </div>
                <div style={{ width: '1%' }} ></div>

            </div>
        </div>
    )
}
