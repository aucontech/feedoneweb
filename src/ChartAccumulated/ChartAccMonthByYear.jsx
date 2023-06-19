import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { ContentType, getSumByMonth, https, listFarmingArea, loadFishPond, loadFishPondData, startAndlimit } from '../Service/ConFigURL';
import { DatePicker, Menu, Tabs } from 'antd';
import { customYear } from '../chart/DatePickerViVn';
import ReactApexChart from 'react-apexcharts';
import TabPane from 'antd/es/tabs/TabPane';
import { BsBarChart } from 'react-icons/bs';
import { RiLineChartLine } from 'react-icons/ri';
import SubMenu from 'antd/es/menu/SubMenu';

export default function ChartAccMonthByYear() {
    const [loadNameFaming, setLoadNameFarming] = useState([]);// load vùng nuôi
    const [pondData, setPondData] = useState([]) // load ao nuôi
    const [selectedFarmingAreaId, setSelectedFarmingArea] = useState();// dùng để liên kết ao và chart 
    const [filteredData, setFilteredData] = useState([]);// hàm để hứng , lấy trực tiếp ao nuôi được lấy từ state pondData

    const [series, setSeries] = useState([]);
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [aoIdYear, setAoIdYear] = useState('')

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
        setAoIdYear(Array.isArray(value) ? value[0] : value)


    };

    const handleGetSumByMonth = async () => {
        if (!selectedYear || !aoIdYear) return;
        const Params = {
            data: {
                year: selectedYear,
                aoid: aoIdYear
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

    const optionsYearLine = {

        chart: {
            type: 'area',
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

        labels: ["Th 1", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "Th 8", "Th 9", "Th 10", "Th 11", "Th 12",],

        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 1,
            dashArray: [0, 0, 8]
        },
        colors: ['#0A8FDC'],
        tooltip: {
            enabled: true,
            theme: "dark",
            x: {
                show: false,
                format: "yyyy-MM-dd",
            },
        },

        legend: {
            show: false,
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
            offsetY: 0,
            style: {
                fontSize: '12px',
                colors: ["#FF5252"],
                fontWeight: 400,

            },
            background: {
                enabled: false,
                foreColor: '#fff',
                padding: 4,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#fff',
                opacity: 0.9,
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#000',
                    opacity: 0.45
                }
            },
        },

    }
    const optionsYearBar = {

        chart: {
            type: 'area',
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

        labels: ["Th 1", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "Th 8", "Th 9", "Th 10", "Th 11", "Th 12",],

        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 0.1,
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
            show: false,
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
                foreColor: '#fff',
                padding: 4,
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#fff',
                opacity: 0.9,
                dropShadow: {
                    enabled: false,
                    top: 1,
                    left: 1,
                    blur: 1,
                    color: '#000',
                    opacity: 0.45
                }
            },
        },

    }
    useEffect(() => {
        handleGetSumByMonth()
    }, [selectedYear, aoIdYear])
    const handleDatePickerChange = (date, dateString) => {
        if (date) {
            const year = date.year();
            setSelectedYear(year.toString());
        } else {
            setSelectedYear('');
        }
    }
    function onChange(key) {
        console.log(key);
    }
    return (
        <div>
            <div className='flex py-5   ' >
                <div style={{ width: '1%' }} ></div>

                <div className='menu-wrapper' style={{ width: '15%', position: 'relative' }}  >

                    <Menu
                        style={{ height: "100%", borderRadius: 5, fontSize: 13, fontWeight: 500, }}
                        mode="inline">
                        <div style={{ fontWeight: 400, background: '#036E9B' }} className='text-lg  text-titleBorder'><p style={{ color: '#fff' }} >Chọn Vùng Nuôi</p></div>

                        {loadNameFaming.map((item) => (
                            <SubMenu style={{}} key={item.id} title={item.name}>
                                {filteredData
                                    .filter((pond) => pond.farmingArea.id === item.id)
                                    .map((pond) => (
                                        <Menu.Item style={{ fontWeight: 500 }} key={pond.id}
                                            onClick={() => changeValueCallApiNumber3(pond.id)}
                                        >
                                            {pond.name}
                                        </Menu.Item>
                                    ))}
                            </SubMenu>
                        ))}
                    </Menu>
                </div>
                <div style={{ width: '1%' }} ></div>

                <div className='bg-white' style={{ width: '82%', borderRadius: 5 }}>
                    <div className="text-lg text-titleBorder" style={{ color: "white", fontWeight: 400, background: "#036E9B", }} >
                        {/* renderChartKgTrongThang */}
                        <p>Biểu đồ lượng tiêu thụ thức ăn theo tháng năm {selectedYear} </p>
                    </div>
                    <DatePicker
                        style={{ position: 'relative', top: 40, zIndex: 9999 }}
                        onChange={handleDatePickerChange}
                        picker="year"
                        locale={customYear}
                        allowClear={true}
                    />
                    <Tabs defaultActiveKey="1" onChange={onChange}>
                        <TabPane tab={
                            <span >
                                <BsBarChart size={20} />

                            </span>
                        } key="1">

                            <ReactApexChart
                                options={optionsYearBar}
                                series={series}
                                type="bar"
                                height={400}
                            />
                        </TabPane>

                        <TabPane tab={
                            <span>
                                <RiLineChartLine size={20} />

                            </span>
                        } key="2">

                            <ReactApexChart
                                options={optionsYearLine}
                                series={series}
                                type="area"
                                height={400}
                            />
                        </TabPane>


                    </Tabs>
                </div>
                <div style={{ width: '1%' }} ></div>

            </div>
        </div>
    )
}
