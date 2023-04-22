import {
    AppstoreOutlined,
    ContainerOutlined,
    PieChartOutlined,
    DesktopOutlined,
    MailOutlined,
} from '@ant-design/icons';
import { Button, Menu, } from 'antd';
import { useState } from 'react';
import "./SideBarHome.css"
import Stations from '../../Stations/Stations';
import Testproject from '../../VungNuoi/Testproject';
import QuanLyVungNuoiAntd from '../../VungNuoi/QuanLyVungNuoiAntd';
import LineChart from '../../chart/LineChart';

function getItem(label, key, icon, children, component) {
    return {
        key,
        icon,
        children,
        label,
        component,
    };
}

const SidebarHome = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [content, setContent] = useState(null);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const items = [
        getItem('Chọn Vùng Nuôi', '1', <PieChartOutlined />, null, <Stations />),
        getItem('Option 2', '2', <DesktopOutlined />, null, <Testproject />),
        getItem('Option 3', '3', <ContainerOutlined />, null, <QuanLyVungNuoiAntd />),
        getItem('Option 4', '4', <ContainerOutlined />, null, <LineChart />),
        getItem('Navigation One', 'sub1', <MailOutlined />, [
            getItem('Option 5', '5'),
            getItem('Option 6', '6'),
            getItem('Option 7', '7'),
            getItem('Option 8', '8'),
        ]),
        getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
            getItem('Option 9', '9'),
            getItem('Option 10', '10'),
            getItem('Submenu', 'sub3', null, [getItem('Option 11', '11'), getItem('Option 12', '12')]),
        ]),
    ];

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: 200 }} >
                <Button
                    className='text-black h-10 w-10 mr-40 '
                    type="primary"
                    onClick={toggleCollapsed}
                    style={{ marginBottom: 16 }}

                >
                    <i className="fa fa-bars bar-side " />
                </Button>
                <Menu
                    style={{ height: 1000 }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="light"
                    inlineCollapsed={collapsed}
                    items={items}
                    onClick={({ key }) => {
                        const item = items.find(i => i.key === key);
                        if (item) setContent(item.component);
                    }}
                />
            </div>
            <div>{content && <div>{content}</div>}</div>
        </div >
    );
};

export default SidebarHome;
