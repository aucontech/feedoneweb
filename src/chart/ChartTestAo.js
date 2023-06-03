import React, { useEffect, useState } from "react";
import {
    ApiFeedByDate,
    ContentType,
    https,
    listFarmingArea,
    loadFishPond,
    loadFishPondData,
    startAndlimit,
} from "../Service/ConFigURL";
import { AiFillHome, AiOutlineTable, AiTwotoneHome } from "react-icons/ai";
import { RiLineChartLine } from "react-icons/ri";

import { BsBarChart } from 'react-icons/bs';
import { DatePicker, Menu, Select, Table, Tabs } from "antd";
import ReactApexChart from "react-apexcharts";
import { customLocale } from "./DatePickerViVn";
import TabPane from "antd/es/tabs/TabPane";
import "./ChartTestAo.css"
import SubMenu from "antd/es/menu/SubMenu";
const { Option } = Select;

export default function ChartTestAo() {
    const [loadNameFaming, setLoadNameFarming] = useState([]);/* load Vùng nuôi */
    const [pondData, setPondData] = useState([]);
    const [selectedFarmingAreaId, setSelectedFarmingAreaId] = useState();

    const [filteredData, setFilteredData] = useState([]);
    const [listQuantities, setListQuantities] = useState([]);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [date, setDate] = useState(null);
    const [dataFishPond, setDataFishPond] = useState([]);
    const [datePickerValue, setDatePickerValue] = useState(null);
    const [nameTable, setNameTable] = useState([]);
    const [filteredTableData, setFilteredTableData] = useState([]);
    const [showSecondSelect, setShowSecondSelect] = useState(false);


    useEffect(() => {
        loadChart();
    }, []);

    useEffect(
        (/* Gọi vùng nuôi */) => {
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
        },
        []
    );
    useEffect(
        () => {
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

    useEffect(() => {
        if (selectedFarmingAreaId) {
            const filteredPonds = pondData.filter(

                (item) =>
                    item.farmingArea && item.farmingArea.id === selectedFarmingAreaId
            );
            setFilteredData(filteredPonds);
        }
        else {
            setFilteredData(pondData);
        }
    }, [selectedFarmingAreaId, pondData]);


    const handleSelectChange = (value) => {
        setSelectedFarmingAreaId(value);
        setShowSecondSelect(true);
    };

    const columns = [
        {
            title: "Vùng nuôi",
            dataIndex: "farmingArea",
            key: "farmingArea",
        },
        {
            title: "Tên ao",
            dataIndex: "soAo",
            key: "soAo",
        },
        {
            title: "Khối Lượng ()",
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity) => <span>{quantity}</span>,
        },
        {
            title: "Ngày tháng",
            dataIndex: "time",
            key: "time",
        },
        {
            title: "Giờ cho ăn",
            dataIndex: "feeding",
            key: "feeding",
        },
        {
            title: "Số thứ tự",
            dataIndex: "STT",
            key: "STT",
        },
        {
            title: "Số lô",
            dataIndex: "lotnum",
            key: "lotnum",
        },
    ];

    let filterDatas = listQuantities;
    if (startDate && endDate) {
        filterDatas = listQuantities.filter((item) => {
            const date = new Date(item.date);
            return date >= startDate && date <= endDate;
        });
    }
    const dates = listQuantities.map((obj) => {
        return new Date(obj.date);
    });
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date();
    let allDates = [];
    let currDate = new Date(maxDate);
    while (currDate.getTime() <= minDate.getTime()) {
        allDates.push(new Date(currDate));
        currDate.setDate(currDate.getDate() - 1);
    }

    const handleDateChange = (dates) => {
        if (dates && dates.length >= 1) {
            const newEndDate = new Date(dates[1]);
            const start = new Date(dates[0]);
            const end = new Date(newEndDate.getUTCFullYear(), newEndDate.getUTCMonth(), newEndDate.getUTCDate());

            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            setStartDate(start);
            setEndDate(end);
            setDate(dates);
            setDatePickerValue(dates);

            const filteredData = nameTable.filter((item) => {
                const date = new Date(item.time);
                date.setHours(0, 0, 0, 0);
                return date >= start && date <= end;
            });
            setFilteredTableData(filteredData);
        } else {
            setEndDate(new Date());
            setDatePickerValue(null);
            setFilteredTableData(nameTable);
        }
    };

    useEffect(() => {
        handleDateChange(datePickerValue);
    }, [datePickerValue]);

    const currentDates = new Date()
    const endDateChartPond = currentDates.toISOString("en-US")

    const loadChart = async (id) => {

        if (!startDate || !endDate || !id) return
        const params = {
            data: {
                startdate: "2023-01-01",
                enddate: endDateChartPond,
                aoid: id,
            },
        };

        try {
            const token = localStorage.getItem("token");
            const response = await https.post(ApiFeedByDate, params, {
                headers: {
                    "Content-Type": ContentType,
                },
            });
            if (token) {
                setListQuantities(response.data.data.datachart?.[0]?.lstDate);
                setDataFishPond(response.data.data.datachart[0].fishPond);

                const processedData = response.data.data.datatable.map((item) => ({
                    feeding: item.createdAt.slice(11, 16),
                    quantity: item.quantity,
                    lotnum: item.lotNum,
                    time: item.timeScan.slice(0, 10),
                    soAo: item.fishPond.name,
                    STT: item.ordinalNum,
                    farmingArea: item.fishPond.farmingArea.name,
                }));
                setNameTable(processedData);

                const defaultEndDate = new Date();
                const defaultStartDate = new Date(
                    defaultEndDate.getTime() - 10 * 24 * 60 * 60 * 1000
                );
                setStartDate(defaultStartDate);
                setEndDate(defaultEndDate);
                setDatePickerValue([defaultStartDate, defaultEndDate]);
            }
        } catch (err) {
            console.log("err: ", err);
        }
    };


    // end----------------------------------------------------------------------------------------------


    const changeValueCallApiNumber3 = (value) => {
        if (Array.isArray(value)) {
            loadChart(value[0]);
        } else {
            loadChart(value);
        }
    };

    const loadSelected = (item, index) => {
        return (
            <div>
                <div className="flex" style={{ position: "relative", }}>
                    <Menu
                        style={{ width: 200 }} mode="inline">
                        {loadNameFaming.map((item) => (
                            <SubMenu className="font-medium" key={item.id} title={item.name}>
                                {filteredData
                                    .filter((pond) => pond.farmingArea.id === item.id)
                                    .map((pond) => (
                                        <Menu.Item className="text-sx" key={pond.id} onClick={() => changeValueCallApiNumber3(pond.id)}>
                                            <div className="flex" style={{ fontWeight: 700 }}>
                                                <span className="text-blue-400 py-3 px-2">  <AiTwotoneHome /></span>  {pond.name}

                                            </div>
                                        </Menu.Item>
                                    ))}
                            </SubMenu>
                        ))}
                    </Menu>


                </div>
            </div>
        );
    };


    const options = {

        chart: {
            type: "line",
        },
        responsive: [
            {
                breakpoint: 0, // Set a breakpoint of 0 to make it responsive across all screen sizes
                options: {
                    chart: {
                        width: '100%', // Adjust chart width to fit the container
                    },
                },
            },
        ],
        series: [
            {
                name: dataFishPond.name,
                data: filterDatas.map((item) => item.quantity),
                strokeWidth: 1,
            },
        ],


        xaxis: {
            categories: filterDatas.map((data) => {
                const dateParts = data.date.slice(5, 10).split("-");
                const reveredDates = dateParts.reverse().join("/");
                return reveredDates;
            }),
        },
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

            },

            offsetX: 0,
            offsetY: 0,

            bacround: {
                enabled: true,
                foreColor: "#fff",
                padding: 2,
                borderRadius: 2,
                borderWidth: 0,
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
    function onChange(key) {
        console.log(key);
    }

    const renderTabPane = () => {
        return (
            <div className=" container flex "   >
                <Tabs defaultActiveKey="1" style={{ borderRadius: 10, }} onChange={onChange}>
                    <TabPane tab={
                        <span >
                            <BsBarChart size={24} />

                        </span>
                    } key="1">
                        <div className="text-lg " style={{ color: "#036E9B", fontWeight: 700, position: "relative", }} >
                            <p>Biểu đồ lượng tiêu thụ thức ăn () </p>
                        </div>
                        <div className="chart-res" >

                            <ReactApexChart
                                options={options}
                                series={options.series}
                                type="bar"
                                width={650}
                                height={300}
                            />
                        </div>
                    </TabPane>

                    <TabPane tab={
                        <span>
                            <RiLineChartLine size={24} />
                        </span>
                    } key="2">

                        <div className="chart-res" >
                            <ReactApexChart
                                options={options}
                                series={options.series}
                                type="line"
                                width={650}
                                height={300}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab={
                        <span>
                            <AiOutlineTable size={24} />
                        </span>
                    } key="3">
                        <div className="text-lg " style={{ color: "#036E9B", fontWeight: 700, position: "relative", }} >
                            <p>Lịch sử cho ăn </p>
                        </div>
                        {filteredTableData.length > 0 ? (
                            <Table dataSource={filteredTableData.length > 0 ? filteredTableData : nameTable} pagination={{ pageSize: 5 }} style={{ width: 550 }} columns={columns} />
                        ) : (
                            <Table dataSource={filteredTableData.length > 0 ? filteredTableData : nameTable} style={{ width: 550 }} columns={columns} />
                        )}
                    </TabPane>

                </Tabs>

            </div>)
    }

    return (
        <div className="">

            <DatePicker.RangePicker
                style={{ height: 40, marginLeft: 80 }}
                onChange={handleDateChange}
                onOk={(dates) => {
                    setStartDate(dates[0]);
                    setEndDate(dates[1]);
                    setDatePickerValue(dates);
                }}
                locale={customLocale}

            />
            <div className="flex "  >
                <div className="">
                    <p style={{ borderRadius: 4, }} className="text-xl ">Tổng quan vùng nuôi</p>

                    {loadSelected()}
                </div>
                <div className="cols">

                    {renderTabPane()}
                </div>

            </div>


        </div >
    );
}
