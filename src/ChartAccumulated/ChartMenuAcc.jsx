import React, { useState } from 'react';
import { Button, Layout, Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, } from '@ant-design/icons';
import { AiFillLeftCircle } from 'react-icons/ai';
import { AiFillRightCircle } from 'react-icons/ai';
import ChartKgReport from '../ChartReport/ChartKgReport';
import ChartBagReport from '../ChartReport/ChartBagReport';
import TestMenu from '../chart/TestMenu';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { MdOutlineCalculate } from 'react-icons/md';
import ChartAccDayByMonth from './ChartAccDayByMonth';
import ChartAccMonthByYear from './ChartAccMonthByYear';
import ChartAccArea from './ChartAccArea';
import DeviceControl from '../DeviceControl/DeviceControl';
import QuanTrac from '../chart/QuanTrac';
import ChartQuanTracDemo from '../chart/ChartDemoEvent/ChartQuanTracDemo';

const { Sider, Content } = Layout;

const SubMenu = ({ title, icon, items, onClick }) => {
    return (
        <Menu.SubMenu key={title} icon={icon} title={title}>
            {items.map((item) =>
                item.children ? (
                    <SubMenu
                        key={item.key}
                        title={item.label}
                        icon={item.icon}
                        items={item.children}
                        onClick={onClick}
                    />
                ) : (
                    <Menu.Item key={item.key} icon={item.icon} onClick={onClick}>
                        {item.label}
                    </Menu.Item>
                )
            )}
        </Menu.SubMenu>
    );
};

const ChartMenuAcc = () => {
    const [selectedComponent, setSelectedComponent] = useState('component3');
    const [collapsed, setCollapsed] = useState(false); // State để lưu trạng thái của menu
    const [buttonExpanded, setButtonExpanded] = useState(false);
    const handleMenuClick = (e) => {
        setSelectedComponent(e.key);

    };

    const handleCollapse = () => {
        setCollapsed(!collapsed); // Thay đổi trạng thái collapsed khi nhấn nút
        setButtonExpanded((prevExpanded) => !prevExpanded);
    };




    const renderComponent = () => {
        switch (selectedComponent) {
            case 'component1':
                return <ChartKgReport />;
            case 'component2':
                return <ChartBagReport />;
            case 'component3':
                return <ChartAccDayByMonth />;
            case 'component4':
                return <ChartAccMonthByYear />;
            case 'component5':
                return <ChartAccDayByMonth />;
            case 'component6':
                return <ChartAccArea />;
            case 'component7':
                return <DeviceControl />;
            case 'component8':
                return <ChartQuanTracDemo />;
            case 'component10':
                return <TestMenu />;
            default:
                return null;
        }
    };

    const menuItems = [
        {
            icon: <HiOutlineDocumentReport size={30} />,
            label: 'Báo cáo thức ăn',
            children: [
                {
                    key: 'component1', label: 'Báo cáo (Kg)',

                },
                { key: 'component2', label: 'Báo cáo (Bao)' },
            ],
        },
        {
            icon: <MdOutlineCalculate size={30} />,
            label: 'Lũy kế thức ăn',
            children: [
                { key: 'component3', label: 'Lũy kế ngày - tháng' },
                { key: 'component4', label: 'Lũy kế tháng - năm' },
                { key: 'component5', label: 'Lũy kế theo Vùng Nuôi' },
                { key: 'component6', label: 'Lũy kế theo ao (Bao)' },
                { key: 'component7', label: 'render Trạm bơm' },
                { key: 'component8', label: 'Lũy kế theo ao (Bao)' },

                { key: 'component10', label: 'Sub Item 2' },
            ],
        },
    ];


    return (
        <Layout style={{ minHeight: '100vh', background: "#fff" }} >
            <Sider style={{ position: 'relative', background: '#fff' }} trigger={null} collapsed={collapsed} onCollapse={handleCollapse}>
                <div onClick={() => setCollapsed(!collapsed)}
                    className='' style={{ cursor: "pointer" }} >

                    <Button

                        type="text"
                        icon={collapsed ? <AiFillLeftCircle /> : <AiFillRightCircle />}
                        style={{
                            fontSize: '50px',
                            marginRight: 20,
                            color: '#FF5252',
                        }}
                    />
                </div>
                <Menu className='py-2' mode="inline" selectedKeys={[selectedComponent]} onClick={handleMenuClick}>
                    {menuItems.map((item) =>
                        item.children ? (
                            <SubMenu
                                key={item.key}
                                title={item.label}
                                icon={item.icon}
                                items={item.children}
                                onClick={handleMenuClick}
                            />
                        ) : (
                            <Menu.Item key={item.key} icon={item.icon} onClick={handleMenuClick}>
                                {item.label}
                            </Menu.Item>
                        )
                    )}
                </Menu>
            </Sider>
            <Layout>
                <Content>{renderComponent()}</Content>
            </Layout>
        </Layout >
    );
};

export default ChartMenuAcc;
