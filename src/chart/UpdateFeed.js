import React, { useEffect, useState } from 'react'
import { ApiFeedByDate, https, listFarmingArea, loadFishPond, loadFishPondData, startAndlimit } from '../Service/ConFigURL';
import { Menu, Table } from 'antd';
import SubMenu from 'antd/es/menu/SubMenu';
import { AiTwotoneHome } from 'react-icons/ai';

export default function UpdateFeed() {


    const [loadNameFaming, setLoadNameFarming] = useState([]);/* load Vùng nuôi */
    const [pondData, setPondData] = useState([]);
    const [selectedFarmingAreaId, setSelectedFarmingAreaId] = useState();
    const [filteredData, setFilteredData] = useState([]);
    const [nameTable, setNameTable] = useState([]);

    const [updatedData, setUpdatedData] = useState(null);
    useEffect(
        (/* Gọi vùng nuôi */) => {
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await https.post(listFarmingArea, startAndlimit);
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
    useEffect(
        () => {
            const loadPond = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await https.post(loadFishPond, loadFishPondData);
                    if (token) {
                        setPondData(response.data.data.list);
                    }
                } catch (err) {
                    console.log("err: ", err);
                }
            };
            loadPond();
        }, []);
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
            const response = await https.post(ApiFeedByDate, params);
            if (token) {

                const processedData = response.data.data.datatable.map((item) => ({
                    feeding: item.createdAt.slice(11, 16),
                    quantity: item.quantity,
                    lotnum: item.lotNum,
                    time: item.timeScan.slice(0, 10),
                    soAo: item.fishPond.name,
                    STT: item.ordinalNum,
                    farmingArea: item.fishPond.farmingArea.name,
                    barcode: item.barCode,
                    id: item.id
                }));
                setNameTable(processedData);

            }
        } catch (err) {
            console.log("err: ", err);
        }
    };


    const changeValueCallApiNumber3 = (value) => {
        if (Array.isArray(value)) {
            loadChart(value[0]);
        } else {
            loadChart(value);
        }
    };
    const columns = [
        {
            title: "id",
            dataIndex: "id",
            key: "id",
        },
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
            title: "Khối Lượng (Kg)",
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

        {
            title: "Bar Code",
            dataIndex: "barcode",
            key: "barcode",
        },

    ];

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
    return (
        <div className='flex'>
            {loadSelected()}

            <Table dataSource={nameTable} columns={columns} ></Table>
        </div>
    )
}
