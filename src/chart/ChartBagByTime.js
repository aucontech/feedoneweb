import React, { useEffect, useState } from 'react'
import { ApiAccumulatedFishPond, ContentType, https, listFarmingArea, startAndlimit } from '../Service/ConFigURL';
import { DatePicker, Select, Table, Tabs } from 'antd';
import ReactApexChart from 'react-apexcharts';
import TabPane from 'antd/es/tabs/TabPane';
import { FcPieChart } from "react-icons/fc"
import { AiOutlineTable } from "react-icons/ai";
import moment from 'moment';
import { customLocale } from './DatePickerViVn';
import { BsBarChart } from 'react-icons/bs';
import "./ChartTestAo.css"

export default function ChartBagByTime() {
    const [loadNameFaming, setLoadNameFarming] = useState([]);
    const [pondData, setPondData] = useState([]);

    const [selectedFarmingAreaId, setSelectedFarmingAreaId] = useState();
    const [filteredData, setFilteredData] = useState([]);

    const [nameTable, setNameTable] = useState([])
    const [filteredTableData, setFilteredTableData] = useState([]);
    const currentDates = new Date()
    const endDateChartPond = currentDates.toISOString("en-US")

    const [bagData, setBagData] = useState([])
    console.log('bagData: ', bagData);

    const [selectStartDate, setSelectStartDate] = useState();
    const [selectEndDate, setSelectEndDate] = useState();

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
        fetchPond()
    }, [selectEndDate, selectStartDate, loadNameFaming])


    const fetchPond = async () => {
        if (!selectEndDate || !selectStartDate || !loadNameFaming) return;
        const params = {
            data: {
                startdate: selectStartDate ? selectStartDate : "",
                enddate: selectEndDate ? selectEndDate : ""
            }
        };
        try {
            const token = localStorage.getItem("token");
            const response = await https.post(ApiAccumulatedFishPond, params);
            if (token) {
                setPondData(response.data.data.datachart);

                const processedData = response.data.data.datatable.map((item) => ({
                    feeding: item.createdAt.slice(11, 16),
                    quantity: item.quantity,
                    lotnum: item.lotNum,
                    time: item.timeScan.slice(0, 10),
                    soAo: item.fishPond.name,
                    STT: item.ordinalNum,
                    farmingArea: item.fishPond.farmingArea.name
                }))
                setNameTable(processedData)
            }
        } catch (err) {
            console.log("err: ", err);
        }
    };

    useEffect(() => {
        if (selectedFarmingAreaId) {
            const filteredPonds = pondData.filter(
                (item) =>
                    item.fishPond && item.fishPond.farmingArea.id === selectedFarmingAreaId
            );
            setFilteredData(filteredPonds);
        } else {
            setFilteredData(pondData);
        }
    }, [selectedFarmingAreaId, pondData]);

    const handleSelectChange = (value) => {
        setSelectedFarmingAreaId(value);
    }

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

    const chartLabels = filteredData.map((item) => item.mapCountFeed["450"])
    const chartnameData = filteredData.map((item) => item.fishPond.name)



    const options = {

        chart: {
            type: 'bar',
            zoom: {
                type: "x",
                enabled: true,
            },
        },


        plotOptions: {
            bar: {

                borderRadius: 2,
                dataLabels: {
                    position: "top",
                },
            },
        },
        labels: chartnameData,


        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 1,
            dashArray: [0, 0, 8]
        },
        colors: ['#036E9B'],
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

        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val;
            },
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#FF5252"],
                fontWeight: 400,

            },
            background: {
                enabled: false,
                foreColor: "#fff",
                padding: 4,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#fff",
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

    return (
        <div>
            <div className="   bg-white" style={{ borderRadius: 5 }} >
                <div>
                    <div className="text-lg  text-titleBorder " style={{ color: " white", fontWeight: 400, background: "#036E9B", position: "relative", }} >


                        <p className='' >Thống kê lượng tiêu thụ thức ăn theo khoảng thời gian (Bao) </p>

                    </div>
                    <div className='flex' style={{ position: 'relative', top: 40, zIndex: 9999, width: 450, left: 150 }}>

                        <Select
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
                        <DatePicker.RangePicker
                            value={[selectStartDate, selectEndDate]}
                            onChange={(dates) => {
                                setSelectStartDate(dates[0]);
                                setSelectEndDate(dates[1]);
                            }}
                            locale={customLocale}
                        />
                    </div>
                    <Tabs defaultActiveKey='1' onChange={onChange}  >

                        <TabPane key="1" tab={
                            <span>
                                <BsBarChart size={20} />
                            </span>} >

                            <ReactApexChart

                                options={options}
                                series={[{ name: "450Kg", data: chartLabels }]}
                                type="bar"
                                height={300}
                            />

                        </TabPane>
                        <TabPane tab={
                            <span>
                                <AiOutlineTable size={20} />
                            </span>
                        } key="2">

                            {filteredTableData.length > 0 ? (
                                <Table className="" dataSource={filteredTableData.length > 0 ? filteredTableData : nameTable} pagination={{ pageSize: 5 }} columns={columns} />
                            ) : (
                                <Table className="" dataSource={nameTable} pagination={{ pageSize: 5 }} columns={columns} />
                            )}

                        </TabPane>
                    </Tabs>

                </div>

            </div>
        </div >
    )
}
