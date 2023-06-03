import { Card, Form, Input, Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ContentType, https, listFarmingArea, } from '../Service/ConFigURL'

export default function Testproject() {
    const history = useNavigate()
    const [farmingAreas, setFarmingAreas] = useState([]);
    const [selectedFarmingArea, setSelectedFarmingArea] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [areaInput, setAreaInput] = useState('');
    const [longitudeInput, setLongitudeInput] = useState('');


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

    return (
        <div>
            <Modal
                title={selectedFarmingArea && selectedFarmingArea.name}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
            >
                {selectedFarmingArea &&
                    <div>
                        <Form>

                            <Form.Item label="Diện tích">
                                <Input value={selectedFarmingArea.name} onChange={(e) => setAreaInput(e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Kinh độ">
                                <Input value={selectedFarmingArea.area} onChange={(e) => setLongitudeInput(e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Diện tích">
                                <Input value={selectedFarmingArea.longitude} onChange={(e) => setAreaInput(e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Kinh độ">
                                <Input value={selectedFarmingArea.latitude} onChange={(e) => setLongitudeInput(e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Diện tích">
                                <Input value={selectedFarmingArea.province} onChange={(e) => setAreaInput(e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Kinh độ">
                                <Input value={selectedFarmingArea.district} onChange={(e) => setLongitudeInput(e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Diện tích">
                                <Input value={selectedFarmingArea.wards} onChange={(e) => setAreaInput(e.target.value)} />
                            </Form.Item>
                            <Form.Item label="Kinh độ">
                                <Input value={selectedFarmingArea.address} onChange={(e) => setLongitudeInput(e.target.value)} />
                            </Form.Item>
                        </Form>
                        <p className='text-red-500' > Chú ý : Hãy cẩn thận khi chỉnh sửa danh sách</p>
                    </div>
                }
            </Modal>

            <div className='flex py-10' >
                {farmingAreas.map((area, item) => (
                    < Card
                        key={item}
                        className=' mx-10 text-gray-500'
                        style={{ border: 1, width: 300, height: 550, textAlign: "left", cursor: "pointer" }}
                        title={<span className='text-lg text-blue-400' >{area.name} </span>}
                        bordered={false}
                        onClick={() => {
                            setSelectedFarmingArea(area); // Set state cho selectedFarmingArea với giá trị tương ứng khi người dùng nhấn vào danh sách.
                            setIsModalVisible(true); // Mở bảng modal.
                        }}
                    >
                        <div>
                            <p className='flex text-sm py-2' > <p >Diện tích</p>  : {area.area}</p>
                            <p className='flex text-sm' > <p>Kinh độ </p>: {area.longitude}</p>
                            <p className='flex text-sm py-2' > <p>Vĩ độ</p> : {area.latitude}</p>
                            <p className='flex text-sm' > <p>Tỉnh </p> : {area.province}</p>
                            <p className='flex text-sm py-2' > <p>Huyện</p> : {area.district}</p>
                            <p className='flex text-sm' > <p>Phường</p> : {area.wards}</p>
                            <p className='flex text-sm py-2' > <p>Địa chỉ</p> : {area.address}</p>
                        </div>
                    </Card>
                ))}
            </div>

        </div>
    )
}
