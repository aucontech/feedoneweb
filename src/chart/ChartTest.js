import React, { useEffect, useState } from "react";
import {
    ApiFeedByDate,
    ContentType,
    foodBagByDate,
    https,
    listFarmingArea,
    loadFishPond,
    loadFishPondData,
    startAndlimit,
} from "../Service/ConFigURL";
import { AiOutlineTable } from "react-icons/ai";

import { BsBarChart } from 'react-icons/bs';
import { DatePicker, Select, Table, Tabs } from "antd";
import ReactApexChart from "react-apexcharts";
import { customLocale } from "./DatePickerViVn";
import TabPane from "antd/es/tabs/TabPane";
import "./ChartTestAo.css"
const { Option } = Select;

export default function ChartTest() {
    const [loadNameFaming, setLoadNameFarming] = useState([]);/* load Vùng nuôi */
    const [pondData, setPondData] = useState([]);

    const [selectedFarmingAreaId, setSelectedFarmingAreaId] = useState();
    const [showSecondSelect, setShowSecondSelect] = useState(false);
    const [filteredData, setFilteredData] = useState([]);

    const [listQuantities, setListQuantities] = useState([]);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [date, setDate] = useState(null);
    const [dataFishPond, setDataFishPond] = useState([]);
    const [datePickerValue, setDatePickerValue] = useState(null);
    const [nameTable, setNameTable] = useState([]);
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
            title: "Số thứ tự",
            dataIndex: "STT",
            key: "STT",
        },
        {
            title: "Số lô",
            dataIndex: "lotnum",
            key: "lotnum",
        }
    ];




    useEffect(() => {
        handleDateChange(datePickerValue);
    }, [datePickerValue]);

    const currentDates = new Date()
    const endDateChartPond = currentDates.toISOString("en-US")

    const loadChart = async (id) => {
        const params = {
            data: {
                startdate: "2023-01-01",
                enddate: endDateChartPond,
                aoid: id,
            },
        };

        try {
            const token = localStorage.getItem("token");
            const response = await https.post(foodBagByDate, params,);
            if (token) {

                const quantities = response?.data?.data?.lstdatachart?.[0]?.lstDateAndMap?.map(item => {
                    return {
                        date: item.date,
                        "40": item?.mapCountFeed?.["40"],
                        "450": item?.mapCountFeed?.["450"],
                        "500": item?.mapCountFeed?.["500"],
                    }
                })



                setListQuantities(quantities)

                setDataFishPond(response.data.data.lstdatachart?.[0]?.lstDateAndMap);


                const processedData = response.data.data.datatable.map((item) => ({
                    quantity: item.quantity,
                    lotnum: item.lotNum,
                    ordinalnum: item.ordinalNum,
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


    let filterDatas = listQuantities;
    console.log('filterDatas: ', filterDatas);
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
                            {loadNameFaming.map((item) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                    {showSecondSelect &&
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
                    }
                </div>
            </div>
        );
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
                        offsetY: 20,
                        style: {
                            fontSize: "14px",
                            fontWeight: "bold",
                            colors: ["#036E9B"],
                        },
                    }
                },
            },
        },
        xaxis: {
            categories: filterDatas.map((data) => {
                const dateParts = data.date.slice(5, 10).split("-");
                const reveredDates = dateParts.reverse().join("/");
                return reveredDates;
            }),
        },

        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 2,
            dashArray: [0, 0, 8]
        },
        colors: ['#EF4444', '#036E9B', '#EF4444'],
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
            showForSingleSeries: true,
            showForNullSeries: true,
            showForZeroSeries: false,
            position: "top",
            horizontalAlign: "center",
            floating: true,
            fontSize: "13px",
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
                name: "40 Kg",
                data: filterDatas.map((item) => item["40"]),
                strokeWidth: 1,
            },
            {
                name: "450 Kg",
                data: filterDatas.map((item) => item["450"]),
                strokeWidth: 1,
            }
            ,
            {
                name: "500",
                data: filterDatas.map((item) => item["500"]),
                strokeWidth: 1,
            },
        ],
    };


    function onChange(key) {
        console.log(key);
    }

    const renderTabPane = () => {
        return (
            <div className=" container flex "   >
                <Tabs defaultActiveKey="1" className="bg-white" style={{ borderRadius: 10, }} onChange={onChange}>


                    <TabPane tab={
                        <span>
                            <BsBarChart size={24} />
                        </span>
                    } key="1">
                        <ReactApexChart
                            options={options}
                            series={options.series}
                            type="bar"
                            width={550}
                            height={300}
                        />
                    </TabPane>
                    <TabPane tab={
                        <span>
                            <AiOutlineTable size={24} />
                        </span>
                    } key="2">
                        {filteredTableData.length > 0 ? (
                            <Table dataSource={filteredTableData.length > 0 ? filteredTableData : nameTable} pagination={{ pageSize: 5 }} style={{ width: 550 }} columns={columns} />
                        ) : (
                            <Table dataSource={nameTable} style={{ width: 550 }} columns={columns} />
                        )}
                    </TabPane>

                </Tabs>

            </div>)
    }
    return (
        <div>

            <div className="px-20 py-2">

                <div className="flex " style={{ position: "relative", right: 80 }} >
                    {loadSelected()}
                    {showSecondSelect && <DatePicker.RangePicker

                        onChange={handleDateChange}
                        onOk={(dates) => {
                            setStartDate(dates[0]);
                            setEndDate(dates[1]);
                            setDatePickerValue(dates);
                        }}
                        locale={customLocale}
                    />}

                </div>

            </div>

            <div className="tableChart">

                <div className="">
                    <div className="text-sm " style={{ color: "#036E9B", fontWeight: 700, position: "relative", left: 20, top: 40 }} >
                        <p>Biểu đồ thống kê lượng thức ăn theo khoảng thời gian (Bao)</p>
                    </div>
                    {renderTabPane()}
                </div>
            </div>
        </div >
    );
}
