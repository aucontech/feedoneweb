import React, { useEffect, useState } from 'react'
import { ApiFeedByDate, https } from '../Service/ConFigURL'
import { Table } from 'antd';

export default function TestObj() {

    const [nameTable, setNameTable] = useState([]);
    const [dataFishPond, setDataFishPond] = useState([]);
    const currentDates = new Date()
    const endDateChartPond = currentDates.toISOString("en-US")

    const loadChart = async () => {

        const params = {
            data: {
                startdate: "2023-01-01",
                enddate: endDateChartPond,
                aoid: 1,
            },
        }
        try {
            const token = localStorage.getItem('token')
            const response = await https.post(ApiFeedByDate, params)

            if (token) {
                setDataFishPond(response.data.data.datachart[0].fishPond);

                const processedData = response.data.data.datatable.map((item) => ({
                    id: item.id,
                    feeding: item.createdAt.slice(11, 16),
                    quantity: item.quantity,
                    lotnum: item.lotNum,
                    time: item.timeScan.slice(0, 10),
                    soAo: item.fishPond.name,
                    STT: item.ordinalNum,
                    farmingArea: item.fishPond.farmingArea.name,
                }));
                setNameTable(processedData);

            }
        } catch (err) {
            console.log('err: ', err);

        }

    }
    const columns = [
        {
            title: "ID Vùng nuôi",
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
            title: "Khối Lượng ()",
            dataIndex: "quantity",
            key: "quantity",
            render: (quantity) => <span>{quantity}</span>,
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

    useEffect(() => {
        loadChart()
    }, [])
    return (
        <div>
            <Table dataSource={nameTable} pagination={{ pageSize: 5 }} style={{ width: 550 }} columns={columns} />
        </div>
    )
}
