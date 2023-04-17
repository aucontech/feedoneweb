import { message, Form, Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiUpdateArea, ContentType, https, listFarmingArea } from '../Service/ConFigURL';
import { Table, } from 'antd';
import "./QuanLyVungNuoi.css"
export default function QuanLyVungNuoiAntd() {
    let history = useNavigate();
    const [farmingAreas, setFarmingAreas] = useState([]);
    const [selectedFarmingArea, setSelectedFarmingArea] = useState(null);
    const [selectId, setSelectedId] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false);
    const [showFormInput, setShowFormInput] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await https.post(listFarmingArea, {}, {
                    headers: {
                        "Content-Type": ContentType
                    }
                });
                if (!token) {
                    message.error('Bạn không đủ quyền truy cập');
                    history('/');
                } else {
                    setFarmingAreas(response.data.data.list);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [isUpdating]);

    const handleRowClick = (record) => {
        setSelectedFarmingArea(record);
        setSelectedId(record.id === selectId ? null : record.id);
    };
    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm("Bạn có chắn chắn muốn xóa vùng nuôi này? ")
            if (confirmed) {
                await https.delete(`/farmingareas/${id}`);
                setFarmingAreas(farmingAreas.filter((farmingArea) => farmingArea.id !== id));
                setSelectedFarmingArea(null);
                setShowFormInput(false);
            }

        } catch (error) {
            console.error(error);
        }
    };
    const handleUpdate = async () => {
        try {
            const res = await https.post(ApiUpdateArea, { data: selectedFarmingArea }, {

            });
            console.log(res);
            console.log('formData: ', selectedFarmingArea);
            setSelectedId({})
            setSelectedFarmingArea(res.data.data)
            setFarmingAreas(
                farmingAreas.map((item) => {
                    return item.id === res.data.data.id ? res.data.data : item
                })
            )
            message.success("Cập nhật thành công")
            setIsUpdating((prev) => !prev)
        } catch (err) {
            console.log(err);
        }
    }
    const handleCreate = async () => {
        try {
            const Params = {
                ...selectedFarmingArea, "__cls__": "com.aqa.saqa.model.entity.FarmingArea",
            }
            const response = await https.post(ApiUpdateArea, { data: Params });
            const newFarmingArea = response.data.data;
            setFarmingAreas([...farmingAreas, newFarmingArea])
            setSelectedFarmingArea({})
            message.success("Thêm mới thành công")
            setIsUpdating((prev) => !prev)

        } catch (err) {
            console.log(err);
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Area',
            dataIndex: 'area',
            key: 'area',
        },
        {
            title: 'longitude',
            dataIndex: 'longitude',
            key: 'longitude',
        },
        {
            title: 'latitude',
            dataIndex: 'latitude',
            key: 'latitude',
        },
        {
            title: 'province',
            dataIndex: 'province',
            key: 'province',
        },
        {
            title: 'district',
            dataIndex: 'district',
            key: 'district',
        },
        {
            title: 'wards',
            dataIndex: 'wards',
            key: 'wards',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" danger onClick={() => handleDelete(record.id)}>Delete</Button>
            ),
        },
    ];

    return (
        <div className="flex table-list" scroll={{ x: 1000 }}>
            <div  >
                <Table className="ant-table" columns={columns} dataSource={farmingAreas} onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })} />

            </div>
            {selectedFarmingArea && (
                <Form key={selectedFarmingArea.id + "reset"} className="FormAntd" onFinish={handleUpdate}  >
                    <Button onClick={() => setSelectedFarmingArea(null)}><i className="fa fa-window-close text-2xl" />
                    </Button>

                    <Form.Item label="ID">
                        <Input className='' value={selectedFarmingArea.id} disabled />
                    </Form.Item>
                    <Form.Item label="Vùng Nuôi" >
                        <Input style={{ width: "200px" }} defaultValue={selectedFarmingArea.name} onChange={(e) => setSelectedFarmingArea({ ...selectedFarmingArea, name: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Diện tích">
                        <Input className='ml-2' style={{ width: "200px" }} defaultValue={selectedFarmingArea.area} onChange={(e) => setSelectedFarmingArea({ ...selectedFarmingArea, area: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Kinh độ">
                        <Input className='ml-3' style={{ width: "200px" }} defaultValue={selectedFarmingArea.longitude} onChange={(e) => setSelectedFarmingArea({ ...selectedFarmingArea, longitude: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Latitude">
                        <Input className='ml-2' style={{ width: "200px" }} defaultValue={selectedFarmingArea.latitude} onChange={(e) => setSelectedFarmingArea({ ...selectedFarmingArea, latitude: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="province">
                        <Input className='ml-1' style={{ width: "200px" }} defaultValue={selectedFarmingArea.province} onChange={(e) => setSelectedFarmingArea({ ...selectedFarmingArea, province: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="district">
                        <Input className='ml-3' style={{ width: "200px" }} defaultValue={selectedFarmingArea.district} onChange={(e) => setSelectedFarmingArea({ ...selectedFarmingArea, district: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="wards">
                        <Input className='ml-4' style={{ width: "200px" }} defaultValue={selectedFarmingArea.wards} onChange={(e) => setSelectedFarmingArea({ ...selectedFarmingArea, wards: e.target.value })} />
                    </Form.Item>

                    <Button style={{ width: 100 }} type="primary" htmlType="submit">Submit</Button>
                    <Button onClick={handleCreate} >Add</Button>
                    <Button type="default" htmlType="reset">
                        Clear
                    </Button>
                </Form>
            )
            }
        </div >
    );
}
