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

function getItem(label, key, icon, children, component) {
    return {
        key,
        icon,
        children,
        label,
        component,
    };
}

const items = [
    getItem('Chọn Vùng Nuôi', '1', <PieChartOutlined />, null,),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('Option 3', '3', <ContainerOutlined />),
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

const SidebarHome = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [content, setContent] = useState(null);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };



    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: 200 }}>
                <Button
                    className='text-black w-16 h-16 button-side-bar '
                    type="primary"
                    onClick={toggleCollapsed}
                    style={{ marginBottom: 16 }}

                ><div className='' >
                        <i className="fa fa-bars bar-side " />


                    </div></Button>
                <Menu
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    theme="dark"
                    inlineCollapsed={collapsed}
                    items={items}
                    onClick={({ key }) => {
                        const item = items.find(i => i.key === key);
                        if (item) setContent(item.component);
                    }}
                />
            </div>
            <div>{content && <div>{content}</div>}</div>
        </div>
    );
};

export default SidebarHome;
