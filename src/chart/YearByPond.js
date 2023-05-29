import React, { useEffect, useState } from 'react'
import { ContentType, GetSumMassByYear, https, listFarmingArea, startAndlimit } from '../Service/ConFigURL';
import { DatePicker, Select, Tabs } from 'antd';
import ReactApexChart from 'react-apexcharts';
import TabPane from 'antd/es/tabs/TabPane';
import { BsBarChart } from 'react-icons/bs';
import moment from 'moment';
import dayjs from 'dayjs';
const monthFormat = 'YYYY';

export default function YearByPond() {
    const [loadNameFaming, setLoadNameFarming] = useState([]);
    const [pondData, setPondData] = useState([]);

    const [selectedFarmingAreaId, setSelectedFarmingAreaId] = useState();
    const [filteredData, setFilteredData] = useState([]);

    const [selectedYear, setSelectedYear] = useState(moment().year());

    const [selectedFarmingAreaName, setSelectedFarmingAreaName] = useState("");

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
    }, [selectedYear, loadNameFaming])

    const handleDatePickerYear = date => {
        setSelectedYear(date.year())
    }
    const fetchPond = async () => {
        if (!selectedYear || !loadNameFaming) return;
        const Params = {
            data: {
                year: selectedYear
            }
        }
        try {
            const token = localStorage.getItem("token");
            const response = await https.post(GetSumMassByYear, Params);
            if (token) {
                setPondData(response.data.data.lstdatachart);

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
        const selectedArea = loadNameFaming.find((item) => item.id === value);
        if (selectedArea) {
            setSelectedFarmingAreaName(selectedArea.name);
        }
    }

    const chartData = filteredData.map((item) => item.lstLong[0] / 1000);

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
                fontSize: '13px',
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

    function onChange(key) {
        console.log(key);
    }

    return (
        <div>
            <div className=" bg-white" style={{ borderRadius: 5 }} >
                <div className=''>
                    <div className="text-lg  text-titleBorder " style={{ color: " white", fontWeight: 400, background: "#036E9B", position: "relative", }} >


                        <p className='' >Lượng tiêu thụ thức ăn vùng nuôi  {selectedFarmingAreaName}  năm {selectedYear} (Tấn) </p>

                    </div>
                    <div style={{ position: 'relative', top: 40, zIndex: 9999 }} >
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
                        <DatePicker sdefaultValue={dayjs("2023", monthFormat)} format={monthFormat} picker='year' onChange={handleDatePickerYear} />
                    </div>
                    <Tabs defaultActiveKey='1' className='' style={{ position: 'relative', }} onChange={onChange} >
                        <TabPane tab={
                            <span>
                                <BsBarChart size={20} />
                            </span>} >

                            <ReactApexChart

                                options={options}
                                series={[{ data: chartData }]}
                                type="bar"
                                height={300}
                                className="responsive-chart"
                            />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div >
    )
}
