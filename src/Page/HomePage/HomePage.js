import React, { useState } from 'react'
// import QuanLyVungNuoiAntd from '../../VungNuoi/QuanLyVungNuoiAntd';
// import QuanLyVungNuoi from '../../VungNuoi/QuanLyVungNuoi';
// import SideBar from '../SideBarPage/SideBarHome';
import Stations from '../../Stations/Stations';
// import TestProject from '../../VungNuoi/Test-project';

export default function HomePage() {
    const [collapsed, setCollapsed] = useState(false);
    const [content, setContent] = useState(null);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div>
            <div className='bg-gray-200' style={{ display: 'flex', flexDirection: 'row' }}>
                {/* <SideBar collapsed={collapsed} toggleCollapsed={toggleCollapsed} setContent={setContent} /> */}
                {/* <QuanLyVungNuoi /> */}
                {/* <QuanLyVungNuoiAntd /> */}
                <Stations />
                {/* <TestProject /> */}
            </div>
        </div>
    )
}
