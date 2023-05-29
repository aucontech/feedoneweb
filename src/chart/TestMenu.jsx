import React, { useEffect, useState } from 'react';
import { DatePicker, Menu, Select, Table, Tabs } from 'antd';
import { ApiFeedByDate, ApiQuanTrac, ContentType, foodBagByDate, getSumByDay, getSumByMonth, https, listFarmingArea, loadFishPond, loadFishPondData, startAndlimit } from '../Service/ConFigURL';
import ReactApexChart from 'react-apexcharts';
import TabPane from 'antd/es/tabs/TabPane';
import { BsBarChart } from 'react-icons/bs';
import { AiOutlineDashboard, AiOutlineTable } from 'react-icons/ai';
import { customLocale, customYear } from './DatePickerViVn';
import { RiLineChartLine } from 'react-icons/ri';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { MdOutlineCalculate } from 'react-icons/md';

import moment from 'moment';
import "./ChartTestAo.css"
import YearByPond from './YearByPond';
import AccumulatedChart from './AccumulatedChart';
import ChartBagByTime from './ChartBagByTime';
const dateFormat = 'YYYY/MM/DD';
const { SubMenu } = Menu;
export default function TestMenu() {

    const [loadNameFaming, setLoadNameFarming] = useState([]);// load vùng nuôi
    const [pondData, setPondData] = useState([]) // load ao nuôi
    const [selectedFarmingAreaId] = useState();// dùng để liên kết ao và chart 
    const [filteredData, setFilteredData] = useState([]);// hàm để hứng , lấy trực tiếp ao nuôi được lấy từ state pondData

    // --------------------------------------------useState của loadChart --------------------------------------------------------------------
    const [listQuantities, setListQuantities] = useState([]); // state lấy dữ liệu chart của loadChart
    const [startDateKg, setStartDateKg] = useState(null);
    const [endDateKg, setEndDateKg] = useState(null);
    const [datekg, setDateKg] = useState(null);
    const [dataFishPondKg, setDataFishPondKg] = useState([]);
    const [datePickerValueKg, setDatePickerValueKg] = useState(null);
    const [nameTableKg, setNameTableKg] = useState([]);
    const [filteredTableDataKg, setFilteredTableDataKg] = useState([]);
    // --------------------------------------------end useState của loadChart ------------------------------------------------------------------


    //------------------------------------------- useState của LoadPondBag --------------------------------------------------------------------
    const [listQuantityAo, setListQuantityAo] = useState([])// state lấy dữ liệu chart của loadPondBag
    const [dataFishPondBag, setDataFishPondBag] = useState([]);
    const [nameTableBag, setNameTableBag] = useState([]);
    const [startDateBag, setStartDateBag] = useState(null);
    const [endDateBag, setEndDateBag] = useState(null);
    const [datePickerValueBag, setDatePickerValueBag] = useState(null);
    const [dateBag, setDateBag] = useState(null);
    const [filteredTableDataBag, setFilteredTableDataBag] = useState([]);
    //---------------------------------------------- end useState của LoadPondBag ----------------------------------------------------


    //---------------------------------------------- Start useState của handleGetSumByMonth -----------------------------------------------------------------------
    const [series, setSeries] = useState([]);
    const [selectedYear, setSelectedYear] = useState(moment().year());
    const [aoIdYear, setAoIdYear] = useState('')
    //---------------------------------------------- End useState của handleGetSumByMonth------------------------------------------------------------------------


    //---------------------------------------------- Start useState Chart Quan Trac ----------------------------------------------------------
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

    //---------------------------------------------- End useState Chart Quan Trac -----------------------------------------------------------------------

    //---------------------------------------------- Start useState Chart tháng trong năm ----------------------------------------------------------

    const [seriesMonthByYear, setSeriesMonthByYear] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
    const [selectedMonthByYear, setSelectedMonthByYear] = useState(moment().year());
    const [aoIDMonthByYear, setAoIDMonthByYear] = useState('');

    //---------------------------------------------- End useState Chart tháng trong năm ----------------------------------------------------------
    ;

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
        setAoIDMonthByYear(Array.isArray(value) ? value[0] : value);
        setAoIdYear(Array.isArray(value) ? value[0] : value)

        if (Array.isArray(value)) {
            loadChart(value[0]);
            loadPondBag(value[0])
            loadChartQuanTrac(value[0])

        } else {
            loadChart(value);
            loadPondBag(value)
            loadChartQuanTrac(value)
        }
    };
    const handleFarmingName = (id) => {


    }

    const currentDates = new Date()//biến lấy ngày tháng trên hệ thống
    const endDateChartPond = currentDates.toISOString("en-US")// tạo ra biến gán vào chart để lấy ngày mới nhất trên hệ thống 

    //----------------------------------------------- Start LOAD CHART tổng tháng trong năm  -----------------------------------------------
    const handleGetSumMonthByYear = async () => {
        if (!selectedMonth || !selectedMonthByYear || !aoIDMonthByYear) return;
        const Params = {
            data: {
                month: selectedMonth,
                year: selectedMonthByYear,
                aoid: aoIDMonthByYear,
            },
        };
        try {
            const token = localStorage.getItem('token');
            const res = await https.post(getSumByDay, Params);
            if (token) {
                const data = res.data.data.lstdatachart?.[0];
                if (data) {
                    const newSeries = { data: data.lstLong };
                    setSeriesMonthByYear([newSeries]);
                }
            }
        } catch (err) {
            console.log('err: ', err);
        }
    };

    const handleDateChangeMonthByYear = date => {
        setSelectedMonth(date.month() + 1);
        setSelectedMonthByYear(date.year());
    };

    useEffect(() => {
        handleGetSumMonthByYear();
    }, [aoIDMonthByYear, selectedMonth, selectedMonthByYear]);

    const serie = [
        10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310,
    ];


    const optionsMonthByYearLine = { // option chỉnh sửa của loadChart( load thức ăn theo kg, ngày và tháng)
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

        labels: serie.map((value, index) => ` ${index + 1}`),

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


    };
    const optionsMonthByYearBar = { // option chỉnh sửa của loadChart( load thức ăn theo kg, ngày và tháng)
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

        labels: serie.map((value, index) => ` ${index + 1}`),

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
            showForSingleSeries: false,
            showForNullSeries: false,
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
                colors: ["#DE5B6D"],
                fontWeight: 400,

            },

        },


    };
    const onChangeMonthByYear = value => {
        console.log('value: ', value);
    };
    //----------------------------------------------- End LOAD CHART tổng tháng trong năm  -----------------------------------------------


    //===================================================================================================================================================


    //----------------------------------------------- Start LOAD CHART KG  -----------------------------------------------
    const loadChart = async (id) => {// hàm gọi API load thức ăn theo kg, ngày và tháng 
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
                setDataFishPondKg(response.data.data.datachart[0].fishPond);

                const processedData = response.data.data.datatable.map((item) => ({
                    feeding: item.createdAt.slice(11, 16),
                    quantity: item.quantity,
                    lotnum: item.lotNum,
                    time: item.timeScan.slice(0, 10),
                    soAo: item.fishPond.name,
                    STT: item.ordinalNum,
                    farmingArea: item.fishPond.farmingArea.name,
                    barcode: item.barCode
                }));
                setNameTableKg(processedData);

                const defaultEndDateKg = new Date();
                const defaultStartDateKg = new Date(
                    defaultEndDateKg.getTime() - 10 * 24 * 60 * 60 * 1000
                );
                setStartDateKg(defaultStartDateKg);
                setEndDateKg(defaultEndDateKg);
                setDatePickerValueKg([defaultStartDateKg, defaultEndDateKg]);
            }
        } catch (err) {
            console.log("err: ", err);
        }
    };


    //Date Picker ------------------------------------------------------------
    let filterDataKg = listQuantities;
    if (startDateKg && endDateKg) {
        filterDataKg = listQuantities.filter((item) => {
            const date = new Date(item.date);
            return date >= startDateKg && date <= endDateKg;
        });
    }

    const dateKg = listQuantities.map((obj) => {
        return new Date(obj.date);
    });
    const minDateKg = new Date(Math.min(...dateKg));
    const maxDateKg = new Date();
    let allDateKg = [];
    let currDateKg = new Date(maxDateKg);
    while (currDateKg.getTime() <= minDateKg.getTime()) {
        allDateKg.push(new Date(currDateKg));
        currDateKg.setDate(currDateKg.getDate() - 1);
    }

    const handleDateChangeKg = (dates) => {
        if (dates && dates.length >= 1) {
            const newEndDateKg = new Date(dates[1]);
            const start = new Date(dates[0]);
            const end = new Date(newEndDateKg.getUTCFullYear(), newEndDateKg.getUTCMonth(), newEndDateKg.getUTCDate());

            start.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)
            end.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

            setStartDateKg(start);
            setEndDateKg(end);
            setDate(dates);
            setDatePickerValueKg(dates);


            const filteredData = nameTableKg.filter((item) => {
                const date = new Date(item.time);
                date.setHours(0, 0, 0, 0);
                return date >= start && date <= end;
            });
            setFilteredTableDataKg(filteredData);
        }
        else {
            setEndDateKg(new Date());
            setDatePickerValueKg(null);
            setFilteredTableDataKg(nameTableKg);
        }
    };
    // End Date Picker -------------------------------------------------------------------

    useEffect(() => {
        handleDateChangeKg(datePickerValueKg);
    }, [datePickerValueKg]);

    const columnKg = [

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
        }



    ];
    const optionsKgBar = { // option chỉnh sửa của loadChart( load thức ăn theo kg, ngày và tháng)
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
            categories: filterDataKg.map((data) => {
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

        },


    };

    const optionsKgLine = { // option chỉnh sửa của loadChart( load thức ăn theo kg, ngày và tháng)
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
            categories: filterDataKg.map((data) => {
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

    };

    //------------------------------------------------End LOAD CHART KG -----------------------------------------------------------------


    //===================================================================================================================================================


    //------------------------------------------------Start Quan Trắc ----------------------------------------------------------------------

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

                const defaultEndDateMon = new Date();
                const defaultStartDateMon = new Date(
                    defaultEndDateMon.getTime() - 3600000
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


    //------------------------------------------------End Quan Trắc ----------------------------------------------------------------------


    /*=========================================================================================================================================================*/


    //-----------------------------------------------LOAD POND BAG ---------------------------------------------------------------------
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
            setDate(dates);
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
            render: (soAo) => <span className='text-blue-500'>{soAo}</span>
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
    //----------------------------------------------------end load pond bag -----------------------------------------------------------------------------

    //---------------------------------------------------- Start Chart load tháng trong năm  -------------------------------------------------------------
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
    useEffect((id) => {
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
    //---------------------------------------------------- End Chart load tháng trong năm  -------------------------------------------------------------



    const renderLoadChartKg = () => {
        return <div className='bg-white ' style={{ borderRadius: 5 }} >
            <div className="text-lg text-titleBorder " style={{ color: "white", fontWeight: 400, background: "#036E9B", position: "relative", }} >
                <p>Biểu đồ lượng tiêu thụ thức ăn (Kg) - {dataFishPondKg.name} </p>
            </div>
            <DatePicker.RangePicker

                style={{ position: 'relative', top: 40, zIndex: 9999 }}
                onChange={handleDateChangeKg}
                onOk={(dates) => {
                    setStartDateKg(dates[0]);
                    setEndDateKg(dates[1]);
                    setDatePickerValueKg(dates);
                }}
                locale={customLocale}

            />
            <div className=" container flex "   >
                <Tabs defaultActiveKey="1" style={{ borderRadius: 5, }} onChange={onChange}>
                    <TabPane tab={
                        <span className='' >
                            <BsBarChart size={20} />

                        </span>
                    } key="1">

                        <div className="chart-res" >

                            <ReactApexChart

                                options={optionsKgBar}
                                series={[{ name: dataFishPondKg.name, data: filterDataKg.map((item) => item.quantity), strokeWidth: 1 }]}
                                type="bar"
                                className="responsive-chart"
                                height={300}

                            />
                        </div>
                    </TabPane>

                    <TabPane tab={
                        <span>
                            <RiLineChartLine size={20} />
                        </span>
                    } key="2">

                        <div className="chart-res"  >
                            <ReactApexChart

                                options={optionsKgLine}
                                series={[{ name: dataFishPondKg.name, data: filterDataKg.map((item) => item.quantity), strokeWidth: 1 }]}
                                type="area"
                                className="responsive-chart"
                                height={300}
                            />
                        </div>
                    </TabPane>
                    <TabPane tab={
                        <span>
                            <AiOutlineTable size={20} />
                        </span>
                    } key="3">
                        <div className="text-lg text-titleBorder" style={{ color: "white", fontWeight: 400, background: "#036E9B", position: "relative", bottom: 120, }} >

                            <p>Lịch sử cho ăn - {dataFishPondKg.name}  </p>
                        </div>
                        {filteredTableDataKg.length > 0 ? (
                            <Table className='responsive-chart bg-blue-500' dataSource={filteredTableDataKg.length > 0 ? filteredTableDataKg : nameTableKg} pagination={{ pageSize: 5 }} style={{}} columns={columns} />
                        ) : (
                            <Table className='responsive-chart' dataSource={nameTableKg} pagination={{ pageSize: 5 }} style={{}} columns={columnKg} />
                        )}
                    </TabPane>

                </Tabs>

            </div>
        </div >
    }

    const renderloadChartBag = () => {
        return <div className='bg-white ' style={{ borderRadius: 5 }}>
            <div className="text-lg text-titleBorder" style={{ color: "white", fontWeight: 400, background: "#036E9B", position: "relative", }} >

                <p>Biểu đồ lượng tiêu thụ thức ăn (bao) - {dataFishPondKg.name}  </p>
            </div>
            <DatePicker.RangePicker
                style={{ position: 'relative', top: 40, left: 0, zIndex: 9999 }}
                onChange={handleDateChange}
                onOk={(dates) => {
                    setStartDateBag(dates[0]);
                    setEndDateBag(dates[1]);
                    setDatePickerValueBag(dates);
                }}
                locale={customLocale}
            />
            <div className=" container flex"   >
                <Tabs defaultActiveKey="1" style={{ borderRadius: 10, }} onChange={onChange}>


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
                            className="responsive-chart"
                            height={300}
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
                            className="responsive-chart"
                            height={300}
                        />
                    </TabPane>
                    <TabPane tab={
                        <span>
                            <AiOutlineTable size={20} />
                        </span>
                    } key="3">
                        <div className="text-lg text-titleBorder" style={{ color: "white", fontWeight: 400, background: "#036E9B", position: "relative", bottom: 120, }} >

                            <p>Lịch sử cho ăn - {dataFishPondKg.name}  </p>
                        </div>
                        {filteredTableDataBag.length > 0 ? (
                            <Table className='responsive-chart' dataSource={filteredTableDataBag.length > 0 ? filteredTableDataBag : nameTableBag} pagination={{ pageSize: 5 }} style={{}} columns={columns} />
                        ) : (
                            <Table className='responsive-chart' dataSource={nameTableBag} style={{}} columns={columns} />
                        )}
                    </TabPane>

                </Tabs>

            </div>

        </div>
    }

    const renderLoadChartYear = () => {
        return <div className=''  >
            <div className='bg-white' style={{ borderRadius: 5 }}>
                <div className="text-lg text-titleBorder" style={{ color: "white", fontWeight: 400, background: "#036E9B", }} >

                    <p>Biểu đồ lượng tiêu thụ thức ăn theo tháng năm {selectedYear} - {dataFishPondKg.name} </p>
                </div>
                <DatePicker
                    style={{ position: 'relative', top: 40, zIndex: 9999 }}
                    onChange={handleDatePickerChange}
                    picker="year"
                    locale={customYear}
                    allowClear={true}
                />
                <div className=' container bg-white  ' style={{ borderRadius: 5 }}>
                    <Tabs defaultActiveKey="1" className="flex  bg-white" style={{ borderRadius: 10, }} onChange={onChange}>


                        <TabPane className='' tab={
                            <span className='' >
                                <BsBarChart size={20} />

                            </span>
                        } key="1">

                            <ReactApexChart
                                options={optionsYearBar}
                                series={series}
                                type="bar"
                                className="responsive-chart"
                                height={300}
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
                                className="responsive-chart"
                                height={300}
                            />
                        </TabPane>


                    </Tabs>
                </div>
            </div>
        </div>
    }

    const renderLoadChartQuanTrac = () => {
        return <div className='bg-white responsive-MonByYear' style={{ borderRadius: 5, }}>
            <div className="text-lg text-titleBorder" style={{ color: "white", fontWeight: 400, }} >

                <p>Biểu đồ quan trắc {nameValue.name} - {dataFishPondKg.name} </p>
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

            <div className=" flex"  >

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
                            className="responsive-chartQuanTrac"
                            height={450}
                        />
                    </TabPane>

                    <TabPane tab={
                        <span>
                            <AiOutlineTable size={24} />
                        </span>
                    } key="2">
                        <div className="text-lg" style={{ color: "white", fontWeight: 400, background: "#036E9B", position: "relative", bottom: 125, borderRadius: 5 }} >

                            <p>Lịch sử thông số đo {nameValue.name} - {dataFishPondKg.name} </p>
                        </div>
                        {filteredTableDataMon.length > 0 ? (
                            <Table className='table-ChartQuanTrac' dataSource={filteredTableDataMon.length > 0 ? filteredTableDataMon : Value} pagination={{ pageSize: 10 }} columns={columnsMon} />
                        ) : (
                            <Table className='table-ChartQuanTrac' dataSource={Value} pagination={{ pageSize: 10 }} columns={columnsMon} />
                        )}
                    </TabPane>
                </Tabs>
            </div>

        </div >

    }

    const renderLoadChartMonthByYear = () => {
        return <div className="bg-white responsive-MonByYear " style={{ borderRadius: 5 }}>
            <div className="text-lg  text-titleBorder " style={{ color: " white", fontWeight: 400, }} >

                <p>Biểu đồ lượng tiêu thụ thức ăn tháng {selectedMonth} năm {selectedMonthByYear} - {dataFishPondKg.name} (Kg) </p>

            </div>
            <DatePicker
                style={{ position: 'relative', top: 40, zIndex: 9999 }}
                onChange={handleDateChangeMonthByYear}
                picker="month"
            />
            <Tabs defaultActiveKey="1" className="bg-white" style={{ borderRadius: 10 }} onChange={onChangeMonthByYear}>

                <TabPane
                    tab={
                        <span>
                            <BsBarChart size={20} />

                        </span>
                    }
                    key="1"
                >

                    <ReactApexChart
                        options={optionsMonthByYearBar}
                        series={seriesMonthByYear}
                        type="bar"
                        className="responsive-YearByPond"
                        height={300} />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <RiLineChartLine size={20} />

                        </span>
                    }
                    key="2"
                >

                    <ReactApexChart
                        options={optionsMonthByYearLine}
                        series={seriesMonthByYear}
                        type="area"
                        className="responsive-YearByPond"


                        height={300}
                    />
                </TabPane>
            </Tabs>
        </div >
    }

    function onChangeTabChart(key) {
        console.log('key: ', key);

    }

    return ( //return để render ra layout
        <div className='  bg-gray-200 ' >

            <div className='bg-white bg-menu-tag' style={{ position: "relative", height: 50, bottom: 4 }}> </div>
            <div className='flex  ' >
                <div className='menu-wrapper bg-white' style={{ width: 150, position: 'relative', bottom: 50 }}  >
                    <Menu
                        className=' bg-white' style={{ height: '100%', borderRadius: 5 }}
                        mode="inline">
                        {loadNameFaming.map((item) => (
                            <SubMenu style={{ fontWeight: 700 }} key={item.id} title={item.name}>
                                {filteredData
                                    .filter((pond) => pond.farmingArea.id === item.id)
                                    .map((pond) => (
                                        <Menu.Item style={{ fontWeight: 500 }} key={pond.id} onChange={() => handleFarmingName(pond.id)} onClick={() => changeValueCallApiNumber3(pond.id)}>
                                            {pond.name}
                                        </Menu.Item>
                                    ))}
                            </SubMenu>
                        ))}
                    </Menu>
                </div>

                <Tabs className='' style={{ position: 'relative', bottom: 50 }} onChange={onChangeTabChart} >
                    <TabPane className='bg-white' key="1" tab={<span className='flex' style={{ fontWeight: 400 }}> <HiOutlineDocumentReport size={24} /> <p className='px-2'>Báo cáo thức ăn </p> </span>} >
                        <div className='bg-gray-200 px-2'>
                            <div className=' ' style={{ position: 'relative', }} >
                                <div className='flex ' >
                                    <div className=' px-2' style={{ borderRadius: 5 }}  >
                                        {renderLoadChartKg()}

                                    </div>
                                    <div className=' px-2' style={{ borderRadius: 5 }}  >
                                        {renderloadChartBag()}

                                    </div>
                                </div>
                                <div>
                                    <div className='px-2 py-2 '>
                                        {renderLoadChartMonthByYear()}

                                    </div>
                                </div>

                            </div>
                        </div>

                    </TabPane>


                    <TabPane key='2' tab={<span className='flex' style={{ fontWeight: 400 }}> <MdOutlineCalculate size={24} /> <p className='px-2'>Lũy kế thức ăn</p> </span>} >
                        <div className='px-2'>


                            <div className='flex ' >
                                <div className=' px-2' style={{ borderRadius: 5 }}  >
                                    {renderLoadChartYear()}

                                </div>
                                <div className=' px-2' style={{ borderRadius: 5 }}  >
                                    <ChartBagByTime />

                                </div>
                            </div>

                            <div className='flex py-2'>
                                <div className=' px-2' style={{ borderRadius: 5 }}  >
                                    <YearByPond />

                                </div>
                                <div className=' px-2' style={{ borderRadius: 5 }}  >
                                    <AccumulatedChart />


                                </div>
                            </div>
                        </div>

                    </TabPane>
                    <TabPane key="3" tab={<span className='flex' style={{ fontWeight: 400, }}> <AiOutlineDashboard size={24} /> <p className='px-2'>Quan trắc</p></span>} >
                        <div className='bg-gray-200 px-2'>

                            <div className='px-2 ' style={{}}  >
                                {renderLoadChartQuanTrac()}

                            </div>



                        </div>

                    </TabPane>





                </Tabs>

            </div>

        </div >

    );
}