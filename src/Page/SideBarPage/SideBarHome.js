import {
    MenuFoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { useState } from 'react';
import QuanTrac from '../../chart/QuanTrac';
import YearByPond from '../../chart/YearByPond';
import MonthByYear from '../../chart/MonthByYear';
import DayByMonth from '../../chart/DayByMonth';
const { Header, Sider, Content } = Layout;
export default function SideBarHome() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode='inline'
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'nav 1',
                            link: '/page1',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'nav 2',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'nav 3',
                        },
                    ]}
                />

            </Sider>

            <div className='flex'>
                <Button
                    className='button-sideBar'
                    type="text"
                    icon={collapsed ? <MenuFoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '20px',
                        width: 30,
                        position: "relative",
                    }}
                />

            </div>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >

                </Header>
                <Content
                    style={{

                        margin: '24px 5px',
                        padding: "",
                        minHeight: 280,
                        background: colorBgContainer,
                    }}

                >
                    <div className='grid grid-cols-2 '  >
                        {/* <div className='' style={{ borderRadius: 5 }} >
                            <ChartTestAo />
                        </div> */}

                        <div className='' style={{ borderRadius: 5 }} >
                            <DayByMonth />
                        </div>
                        <div className='' style={{ borderRadius: 5 }} >
                            <MonthByYear />
                        </div>
                        <div className='' style={{ borderRadius: 5 }} >
                            <QuanTrac />
                        </div>
                        <div className='' style={{ borderRadius: 5 }} >
                            <YearByPond />
                        </div>


                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};