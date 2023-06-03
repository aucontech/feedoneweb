import React, { useState } from 'react'
import SidebarHome from '../SideBarPage/SideBarHome';
import TestMenu from '../../chart/TestMenu';
import ChartTestAo from '../../chart/ChartTestAo';
import ChartTest from '../../chart/ChartTest';
import DuBaoThoiTiet from '../../test/DuBaoThoiTiet';
import QuanTrac from '../../chart/QuanTrac';
import DayByMonth from '../../chart/DayByMonth';
import UpdateFeed from '../../chart/UpdateFeed';
import QuanLyVungNuoiAntd from '../../VungNuoi/QuanLyVungNuoiAntd';
import TestRoles from '../../chart/TestRoles';
import AccumulatedChart from '../../chart/AccumulatedChart';
import TestChart from '../../TestChart/TestChart';
import ChartPump from '../../chart/ChartPump/ChartPump';

export default function HomePage() {
    const [collapsed, setCollapsed] = useState(false);
    const [content, setContent] = useState(null);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div>
            <div className=" " style={{ display: '', flexDirection: 'row', }}>
                {/* <SidebarHome collapsed={collapsed} toggleCollapsed={toggleCollapsed} setContent={setContent} /> */}
                {/* <ChartTest /> */}
                {/* <ChartTestAo /> */}
                <TestMenu />
                {/* <DuBaoThoiTiet /> */}
                {/* <QuanTrac /> */}
                {/* <DayByMonth /> */}
                {/* <UpdateFeed /> */}
                {/* <QuanLyVungNuoiAntd /> */}
                {/* <TestRoles /> */}
                {/* <AccumulatedChart /> */}
                {/* <TestChart /> */}
            </div>
        </div>
    )
}
