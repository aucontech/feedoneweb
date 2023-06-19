import { ApiFeedByDate, ContentType, foodBagByDate, https, listFarmingArea, loadFishPond, loadFishPondData, startAndlimit } from '../Service/ConFigURL';
import { DatePicker, Menu, Table, Tabs } from 'antd';
import SubMenu from 'antd/es/menu/SubMenu';
import TabPane from 'antd/es/tabs/TabPane';
import { customLocale } from '../chart/DatePickerViVn';
import ReactApexChart from 'react-apexcharts';
import { AiOutlineDashboard, AiOutlineTable } from 'react-icons/ai';
import { BsBarChart } from 'react-icons/bs';
import { RiLineChartLine } from 'react-icons/ri';
import { useState } from 'react';
import { useEffect } from 'react';
export default function ChartBagReport() {
    const [loadNameFaming, setLoadNameFarming] = useState([]);// load vùng nuôi
    const [pondData, setPondData] = useState([]) // load ao nuôi
    const [selectedFarmingAreaId, setSelectedFarmingArea] = useState();// dùng để liên kết ao và chart 
    const [filteredData, setFilteredData] = useState([]);// hàm đ

    const [listQuantityAo, setListQuantityAo] = useState([])// state lấy dữ liệu chart của loadPondBag
    const [nameTableBag, setNameTableBag] = useState([]);
    const [startDateBag, setStartDateBag] = useState(null);
    const [endDateBag, setEndDateBag] = useState(null);
    const [datePickerValueBag, setDatePickerValueBag] = useState(null);
    const [filteredTableDataBag, setFilteredTableDataBag] = useState([]);
    const [dataFishPondBag, setDataFishPondBag] = useState([]);


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

    const currentDates = new Date()//biến lấy ngày tháng trên hệ thống
    const endDateChartPond = currentDates.toISOString("en-US")// tạo ra biến gán vào chart để lấy ngày mới nhất trên hệ thống 

    useEffect(() => {// API tìm tên Ao trùng id với chart
        if (selectedFarmingAreaId) {
            const filteredPonds = pondData.filter((item) => item.farmingArea && item.farmingArea.id === selectedFarmingAreaId);
            setFilteredData(filteredPonds);
        } else {
            setFilteredData(pondData);
        }
    }, [selectedFarmingAreaId, pondData]);
    const changeValueCallApiNumber3 = (value) => {// hàm để gọi id cho Vùng Nuôi và ao để liên kết với chart có ao nuôi


        if (Array.isArray(value)) {
            loadPondBag(value[0]);


        } else {
            loadPondBag(value);

        }
    };
    const loadPondBag = async (id) => {// hàm gọi API load thức ăn theo bao ngày và tháng 
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
                setListQuantityAo(quantities)
                setDataFishPondBag(response.data.data.lstdatachart[0].fishPond);


                const processedData = response.data.data.datatable.map((item) => ({
                    quantity: item.quantity,
                    lotnum: item.lotNum,
                    ordinalnum: item.ordinalNum,
                    time: item.timeScan.slice(0, 10),
                    soAo: item.fishPond.name,
                    STT: item.ordinalNum,
                    farmingArea: item.fishPond.farmingArea.name,
                }));
                setNameTableBag(processedData);

                const defaultEndDate = new Date();
                const defaultStartDate = new Date(
                    defaultEndDate.getTime() - 10 * 24 * 60 * 60 * 1000
                );
                setStartDateBag(defaultStartDate);
                setEndDateBag(defaultEndDate);
                setDatePickerValueBag([defaultStartDate, defaultEndDate]);
            }
        } catch (err) {
            console.log("err: ", err);
        }
    };

    //date Picker
    let filterDatas = listQuantityAo;
    if (startDateBag && endDateBag) {
        filterDatas = listQuantityAo.filter((item) => {
            const date = new Date(item.date);
            return date >= startDateBag && date <= endDateBag;
        });
    }
    const dates = listQuantityAo.map((obj) => {
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
    //end Date picker

    useEffect(() => {
        handleDateChange(datePickerValueBag);
    }, [datePickerValueBag]);
    const handleDateChange = (dates) => {
        if (dates && dates.length >= 1) {
            const newEndDateBag = new Date(dates[1]);
            const start = new Date(dates[0]);

            const end = new Date(newEndDateBag.getUTCFullYear(), newEndDateBag.getUTCMonth(), newEndDateBag.getUTCDate());

            start.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)
            end.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

            setStartDateBag(start);
            setEndDateBag(end);
            setDatePickerValueBag(dates);


            const filteredData = nameTableBag.filter((item) => {
                const date = new Date(item.time);
                date.setHours(0, 0, 0, 0);
                return date >= start && date <= end;
            });
            setFilteredTableDataBag(filteredData);
        }
        else {
            setEndDateBag(new Date());
            setDatePickerValueBag(null);
            setFilteredTableDataBag(nameTableBag);
        }
    };
    const optionsBagBar = { // option chỉnh sửa của loadChart( load thức ăn theo kg, ngày và tháng)
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

            }
        },


    };
    const optionsBagLine = { // option chỉnh sửa của loadChart( load thức ăn theo kg, ngày và tháng)

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
            width: 0.1,
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


    };
    const columns = [// cols chỉnh sửa Table 
        {
            title: "Vùng nuôi",
            dataIndex: "farmingArea",
            key: "farmingArea",
        },
        {
            title: "Tên ao",
            dataIndex: "soAo",
            key: "soAo",
            render: (soAo) => <span >{soAo}</span>
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
    function onChange(key) {
        console.log(key);
    }
    return (
        <div>
            <div className='flex py-5   ' >
                <div style={{ width: '1%' }} ></div>

                <div className='menu-wrapper' style={{ width: '15%', position: 'relative' }}  >

                    <Menu
                        style={{ height: "100%", borderRadius: 5, fontSize: 13, fontWeight: 500, overflowY: 'auto' }}
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

                <div className='bg-white' style={{ borderRadius: 5, width: '82%', }}>
                    <div className="text-lg text-titleBorder " style={{ color: "white", fontWeight: 400, background: "#036E9B", }} >
                        <p>Biểu đồ lượng tiêu thụ thức ăn (Bao) - {dataFishPondBag.name} </p>
                    </div>
                    <DatePicker.RangePicker
                        style={{ position: 'relative', top: 10, left: 0, zIndex: 9999 }}
                        onChange={handleDateChange}
                        onOk={(dates) => {
                            setStartDateBag(dates[0]);
                            setEndDateBag(dates[1]);
                            setDatePickerValueBag(dates);
                        }}
                        locale={customLocale}
                    />
                    <Tabs defaultActiveKey="1" style={{}} onChange={onChange}>
                        <TabPane tab={
                            <span>
                                <BsBarChart size={20} />
                            </span>
                        } key="1">
                            <ReactApexChart
                                options={optionsBagBar}
                                series={[
                                    { name: "450 Kg", data: filterDatas.map((item) => item["450"]), strokeWidth: 1 },
                                ]}
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
                                options={optionsBagLine}
                                series={[
                                    { name: "450 Kg", data: filterDatas.map((item) => item["450"]), strokeWidth: 1 },
                                ]}
                                type="area"
                                height={400}


                            />
                        </TabPane>
                        <TabPane tab={
                            <span>
                                <AiOutlineTable size={20} />
                            </span>
                        } key="3">

                            {filteredTableDataBag.length > 0 ? (
                                <Table className='' dataSource={filteredTableDataBag.length > 0 ? filteredTableDataBag : nameTableBag} pagination={{ pageSize: 10 }} style={{}} columns={columns} />
                            ) : (
                                <Table className='' pagination={{ pageSize: 10 }} dataSource={nameTableBag} style={{}} columns={columns} />
                            )}
                        </TabPane>

                    </Tabs>
                </div>
            </div>
            <div style={{ width: '1%' }} ></div>

        </div>

    )
}
