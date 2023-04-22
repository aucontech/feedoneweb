import { Table, message, Modal, Form, Input, Button, } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ApiLoadStations, ApiUpdateCreate, ContentType, https, startAndlimit } from '../Service/ConFigURL'

export default function Stations() {
    const [loadStations, setLoadStations] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [newFormData, setNewFormData] = useState({})
    const [selectedFarmingArea, setSelectedFarmingArea] = useState(null);
    const [selectId, setSelectedId] = useState(null)
    const [showFormInput, setShowFormInput] = useState(false);

    const [isUpdating, setIsUpdating] = useState(false);

    const history = useNavigate()

    useEffect(() => {
        const Fetch = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    message.error("Bạn không đủ quyền truy cập!")
                    history("/", 1000)
                }
                const response = await https.post(ApiLoadStations, startAndlimit, {
                    headers: {
                        "Content-Type": ContentType
                    }
                })
                setLoadStations(response.data.data.list)
                console.log('response: ', response);
            } catch (err) {
                console.log(err);
            }
        }
        Fetch()
    }, [isUpdating])
    const handleRowClick = (record) => {
        setSelectedFarmingArea(record);
        setSelectedId(record.id === selectId ? null : record.id);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Bạn có chắc là muốn xóa?")
        if (confirmed) {
            await https.delete(`/staions/${id}`)
            setLoadStations(loadStations.filter((loadStation) => loadStation.id !== id))
            selectedFarmingArea(null)
            setShowFormInput(false)
        }
    }

    const handleUpdate = async () => {
        try {
            const response = await https.post(ApiUpdateCreate, { data: selectedFarmingArea }, {

            })
            setSelectedId({})
            setSelectedFarmingArea(response.data.data)
            setLoadStations(
                loadStations.map((item) => {
                    return item.id === response.data.data.id ? response.data.data : item
                })
            )
            setIsUpdating((prev) => !prev)

            message.success("Cập nhật thành công")
        } catch (err) {
            console.log(err);
        }
    }

    const showModal = () => {
        setIsModalVisible(true)
    }

    const row = [
        {
            title: 'Tên trạm',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button type='primary' danger onClick={() => handleDelete(record.id)}>Delete</Button>
            ),
        },
    ];
    return (
        <div>
            <Button type="primary" onClick={showModal}>Thêm trạm</Button>

            {selectedFarmingArea && (
                <Form key={selectedFarmingArea.name} onFinish={handleUpdate}>
                    <Form.Item name="name" label="Tên trạm" >
                        <Input onChange={(e) => setSelectedFarmingArea({ ...selectedFarmingArea, name: e.target.value })} defaultValue={selectedFarmingArea.name} />
                    </Form.Item>
                    <Form.Item name="code" label="Code" >
                        <Input onChange={(e) => setSelectedFarmingArea({ ...selectedFarmingArea, code: e.target.value })} defaultValue={selectedFarmingArea.code} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>)}




            <Table dataSource={loadStations} columns={row} pagination={{ pageSize: 6 }} onRow={(record) => ({
                onClick: () => handleRowClick(record),
            })} />
        </div>
    )
}
