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
import { AiOutlineTable } from "react-icons/ai";
import { RiLineChartLine } from "react-icons/ri";
import { BsBarChart } from 'react-icons/bs';
import { DatePicker, Select, Table, Tabs } from "antd";
import ReactApexChart from "react-apexcharts";
import { customLocale } from "../chart/DatePickerViVn";
import "./Chart.css"
import TabPane from "antd/es/tabs/TabPane";
const { Option } = Select;

export default function ChartTestAo() {
    const [loadNameFaming, setLoadNameFarming] = useState([]);/* load Vùng nuôi */
    const [pondData, setPondData] = useState([]);
    const [selectedFarmingAreaId, setSelectedFarmingAreaId] = useState("");

    const [filteredData, setFilteredData] = useState([]);
    const [listQuantities, setListQuantities] = useState([]);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [date, setDate] = useState(null);
    const [dataFishPond, setDataFishPond] = useState([]);
    const [datePickerValue, setDatePickerValue] = useState(null);
    const [nameTable, setNameTable] = useState([]);
    console.log('nameTable: ', nameTable);
    const [filteredTableData, setFilteredTableData] = useState([]);




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
        } else {
            setFilteredData(pondData);
        }
    }, [selectedFarmingAreaId, pondData]);

    const handleSelectChange = (value) => {
        setSelectedFarmingAreaId(value);
    };

    const currentDates = new Date()
    const endDateChartPond = currentDates.toISOString("en-US")

    const loadChart = async (id) => {
        const params = {
            data: {
                startdate: "2023-02-27",
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
                    defaultEndDate.getTime() - 12 * 24 * 60 * 60 * 1000
                );
                setStartDate(defaultStartDate);
                setEndDate(defaultEndDate);
                setDatePickerValue([defaultStartDate, defaultEndDate]);
            }
        } catch (err) {
            console.log("err: ", err);
        }
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
            title: "Khối Lượng (kg)",
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity) => <span>{quantity}Kg</span>,
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


    /* điều chỉnh Date picker ------------------------------------------------------------------------------------------ */
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
    while (currDate <= minDate) {
        allDates.push(new Date(currDate));
        currDate.setDate(currDate.getDate() + 1);
    }

    // const result = allDates.map((date) => {
    //     const dateString = date.toISOString();
    //     const foundObj = listQuantities.find((obj) => obj.date === dateString);
    //     if (foundObj) {
    //         return foundObj;
    //     } else {
    //         return {
    //             date: dateString,
    //             quantity: 0,
    //             mass: null,
    //             value: null,
    //             ucl: null,
    //             lcl: null,
    //             count: null,
    //         };
    //     }
    // });
    // const mergedData = result.map((obj) => {
    //     const foundObj = filterDatas.find(
    //         (item) => item.date.slice(5, 10) === obj.date.slice(5, 10)
    //     );
    //     if (foundObj) {
    //         return {
    //             ...obj,
    //             quantity: foundObj.quantity,
    //         };
    //     } else {
    //         return {
    //             ...obj,
    //             quantity: 0,
    //             mass: null,
    //             value: null,
    //             ucl: null,
    //             lcl: null,
    //             count: null,
    //         };
    //     }
    // });
    // mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    // let chartData = mergedData;
    // if (startDate && endDate) {
    //     chartData = mergedData.filter((item) => {
    //         const date = new Date(item.date);
    //         return date >= startDate && date <= endDate;
    //     });
    // }

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

            const filteredData = nameTable.filter((item) => {
                const date = new Date(item.time);
                return date >= dates[0] && date <= dates[1];
            });
            setFilteredTableData(filteredData);
        }
        else {
            setEndDate(new Date());
            setDatePickerValue(null);
            setFilteredTableData(nameTable);
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
                    }
                },
            },
        },
        xaxis: {
            categories: filterDatas.map((data) => {
                const dateParts = data.date.slice(5, 10).split("-");
                const reveredDates = dateParts.reverse().join("-");
                return reveredDates;
            }),
        },
        title: {
            text: "Biểu đồ lượng thức ăn tiêu thụ (Kg)",
            align: "center",
        },

        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 2,
        },
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
            fontSize: "25px",
            fontFamily: "Helvetica, Arial",
            fontWeight: 800,
            formatter: undefined,
            inverseOrder: false,
            width: undefined,
            height: undefined,
            tooltipHoverFormatter: undefined,
            customLegendItems: [],
            offsetX: 0,
            offsetY: 0,
        },
        series: [
            {
                name: dataFishPond.name,
                data: filterDatas.map((item) => item.quantity),
                strokeWidth: 1,
            },
        ],
    };

    const loadSelected = (item, index) => {
        return (
            <div className="flex">
                <div>
                    <Select
                        key={index}
                        value={selectedFarmingAreaId}
                        onChange={handleSelectChange}
                        defaultValue="Tất cả Vùng nuôi"
                        style={{ width: 200, }}
                    >
                        {loadNameFaming.map((item) => (
                            <Select.Option key={item.id} value={item.id}>
                                {item.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
                <Select
                    defaultValue="Tất cả ao"
                    style={{ width: 200 }}
                    onChange={changeValueCallApiNumber3}
                >
                    {filteredData.map((item) => (
                        <Select.Option key={item.id} value={item.id}>
                            {item.name}
                        </Select.Option>
                    ))}
                </Select>
            </div>
        );
    };
    function onChange(key) {
        console.log(key);
    }

    return (
        <div>
            <div className="px-20 py-2 flex">
                {loadSelected()}
                <DatePicker.RangePicker

                    style={{ paddingRight: 10 }}
                    onChange={handleDateChange}
                    onOk={(dates) => {
                        setStartDate(dates[0]);
                        setEndDate(dates[1]);
                        setDatePickerValue(dates);
                    }}
                    locale={customLocale}
                />
            </div>
            <div className="px-20 container" >
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
                            width={800}
                            height={500}
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
                            width={800}
                            height={500}
                        />
                    </TabPane>

                    <TabPane tab={
                        <span>

                            <AiOutlineTable size={24} />
                        </span>
                    } key="3">
                        {filteredTableData.length > 0 ? (
                            <Table dataSource={filteredTableData.length > 0 ? filteredTableData : nameTable} pagination={{ pageSize: 8 }} style={{ width: 800 }} columns={columns} />
                        ) : (
                            <Table dataSource={nameTable} style={{ width: 800 }} columns={columns} />
                        )}
                    </TabPane>
                </Tabs>
            </div>
        </div >
    );
}
