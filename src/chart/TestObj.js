import React, { useEffect, useState } from 'react';
import { ApiFeedByDate, ApiUpdateFeed, https } from '../Service/ConFigURL';
import { Button, Form, Input, Table } from 'antd';

export default function TestObj() {
    const [nameTable, setNameTable] = useState([]);
    const [dataFishPond, setDataFishPond] = useState([]);
    const [selectedFarmingArea, setSelectedFarmingArea] = useState(null);
    const [selectId, setSelectedId] = useState(null);

    const currentDates = new Date();
    const endDateChartPond = currentDates.toISOString('en-US');

    const columns = [
        {
            title: 'ID Vùng nuôi',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Vùng nuôi',
            dataIndex: 'farmingArea',
            key: 'farmingArea',
        },
        {
            title: 'Tên ao',
            dataIndex: 'soAo',
            key: 'soAo',
        },
        {
            title: 'Khối Lượng ()',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity) => <span>{quantity}</span>,
        },
        {
            title: 'Số thứ tự',
            dataIndex: 'STT',
            key: 'STT',
        },
        {
            title: 'Số lô',
            dataIndex: 'lotnum',
            key: 'lotnum',
        },
    ];

    const loadChart = async () => {
        const params = {
            data: {
                startdate: '2023-03-25',
                enddate: '2023-03-26',
                aoid: 7,
            },
        };
        try {
            const token = localStorage.getItem('token');
            const response = await https.post(ApiFeedByDate, params);

            if (token) {
                const processedData = response.data.data.datatable;
                setNameTable(processedData);
            }
        } catch (err) {
            console.log('err: ', err);
        }
    };

    useEffect(() => {
        if (selectedFarmingArea) {
            const updatedNameTable = nameTable.map((item) =>
                item.id === selectedFarmingArea.id ? selectedFarmingArea : item
            );
            setNameTable(updatedNameTable);
        }
    }, [selectedFarmingArea]);

    const handleRowClick = (record) => {
        setSelectedFarmingArea(record);
        setSelectedId(record.id === selectId ? null : record.id);
    };

    const loadUpdateFeed = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await https.post(ApiUpdateFeed, { ...selectedFarmingArea });

            console.log('response: ', response);
            if (token) {
                setSelectedId({});
                setSelectedFarmingArea(response.data.data);
                const updatedNameTable = nameTable.map((item) =>
                    item.id === response.data.data.id ? response.data.data : item
                );
                setNameTable(updatedNameTable);
            }
        } catch (err) {
            console.log('err: ', err);
        }
    };

    useEffect(() => {
        loadChart();
    }, []);

    const handleSubmit = () => {
        loadUpdateFeed();
    };

    return (
        <div>
            <Table
                dataSource={nameTable}
                pagination={{ pageSize: 5 }}
                style={{ width: 550 }}
                columns={columns}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />
            {selectedFarmingArea && (
                <Form key={selectedFarmingArea.id + 'reset'} className="FormAntd" onFinish={handleSubmit}>
                    <Button onClick={() => setSelectedFarmingArea(null)}>
                        <i className="fa fa-window-close text-2xl" />
                    </Button>

                    <Form.Item label="ID">
                        <Input className="" value={selectedFarmingArea.id} disabled />
                    </Form.Item>

                    <Form.Item label="Số lượng">
                        <Input
                            className="ml-2"
                            defaultValue={selectedFarmingArea.quantity}
                            onChange={(e) =>
                                setSelectedFarmingArea({ ...selectedFarmingArea, quantity: e.target.value })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Số lô">
                        <Input
                            className="ml-3"
                            defaultValue={selectedFarmingArea.lotnum}
                            onChange={(e) =>
                                setSelectedFarmingArea({ ...selectedFarmingArea, lotnum: e.target.value })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Thời gian">
                        <Input
                            className="ml-2"
                            defaultValue={selectedFarmingArea.time}
                            onChange={(e) =>
                                setSelectedFarmingArea({ ...selectedFarmingArea, time: e.target.value })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Số ao">
                        <Input
                            className="ml-1"
                            defaultValue={selectedFarmingArea.soAo}
                            onChange={(e) =>
                                setSelectedFarmingArea({ ...selectedFarmingArea, soAo: e.target.value })
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Số thứ tự">
                        <Input
                            className="ml-3"
                            defaultValue={selectedFarmingArea.STT}
                            onChange={(e) =>
                                setSelectedFarmingArea({ ...selectedFarmingArea, STT: e.target.value })
                            }
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button style={{ width: 100 }} type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </div>
    );
}
