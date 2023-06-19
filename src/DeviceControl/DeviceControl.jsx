import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { ApiLoadDeviceControl, ContentType, https, listFarmingArea, startAndlimit } from '../Service/ConFigURL';

export default function DeviceControl() {
    const [loadNameFaming, setLoadNameFarming] = useState([]);
    const [loadDevice, setLoadDevice] = useState([]);
    const [selectedFarmingArea, setSelectedFarmingArea] = useState(null);

    console.log('loadDevice: ', loadDevice);

    useEffect(() => {
        fetchData();
        fetchDeviceData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await https.post(listFarmingArea, startAndlimit, {
                headers: {
                    'Content-Type': ContentType,
                },
            });
            if (token) {
                setLoadNameFarming(response.data.data.list);
                // Thiết lập vùng nuôi mặc định (ví dụ: chọn vùng nuôi đầu tiên)
                if (response.data.data.list.length > 0) {
                    setSelectedFarmingArea(response.data.data.list[1]);
                }
            }
        } catch (err) {
            console.log('err: ', err);
        }
    };

    const fetchDeviceData = async () => {
        const Params = {
            data: {},
        };
        try {
            const token = localStorage.getItem('token');
            const res = await https.post(ApiLoadDeviceControl, Params);
            if (token) {
                setLoadDevice(res.data.data.list);
            }
        } catch (err) {
            console.log('err: ', err);
        }
    };

    const handleFarmingAreaClick = (farmingArea) => {
        setSelectedFarmingArea(farmingArea);
    };

    const filteredDevices = loadDevice.filter(
        (device) =>
            selectedFarmingArea &&
            device.farmingArea.id === selectedFarmingArea.id
    );

    return (
        <div>
            <Menu mode="horizontal">
                {loadNameFaming.map((farmingArea) => (
                    <Menu.Item
                        className="menu-item"
                        key={farmingArea.id}
                        onClick={() => handleFarmingAreaClick(farmingArea)}
                    >
                        {farmingArea.name}
                    </Menu.Item>
                ))}
            </Menu>
            <div>
                {filteredDevices.map((device) =>
                    device.lstDeviceDetail.map((detail) => (
                        <div className="device-item" key={detail.id}>

                            <div className='grid grid-cols-4' >
                                {detail.device.name}

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

    );
}
