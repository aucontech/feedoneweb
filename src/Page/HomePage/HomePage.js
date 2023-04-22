import React, { useState } from 'react'
import QuanLyVungNuoiAntd from '../../VungNuoi/QuanLyVungNuoiAntd';
// import QuanLyVungNuoi from '../../VungNuoi/QuanLyVungNuoi';
import SideBar from '../SideBarPage/SideBarHome';
import Stations from '../../Stations/Stations';
import Testproject from '../../VungNuoi/Testproject';
import LineChart from '../../chart/LineChart';

export default function HomePage() {
    const [collapsed, setCollapsed] = useState(false);
    const [content, setContent] = useState(null);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div>
            <div className='bg-gray-300' style={{ display: 'flex', flexDirection: 'row' }}>
                <SideBar collapsed={collapsed} toggleCollapsed={toggleCollapsed} setContent={setContent} />
                {/* <QuanLyVungNuoi /> */}
                {/* <QuanLyVungNuoiAntd /> */}
                {/* <Stations /> */}
                {/* <Testproject /> */}
                {/* <LineChart /> */}
            </div>
        </div>
    )
}
