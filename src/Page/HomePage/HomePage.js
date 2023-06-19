import React, { useState } from 'react'

import { HiOutlineDocumentReport } from 'react-icons/hi';
import { GiWaterfall } from 'react-icons/gi';
import { AiOutlineDashboard } from 'react-icons/ai';
import { GiKitchenScale } from 'react-icons/gi';
import { MdOutlineCalculate } from 'react-icons/md';

import "./HomePage.css"
import TestMenu from '../../chart/TestMenu';
import ChartTestDelete from '../../ChartReport/ChartTestDelete';

export default function HomePage() {

    const [isClicked, setIsClicked] = useState(false);
    const [isClicked2, setIsClicked2] = useState(false);

    const [isClicked3, setIsClicked3] = useState(false);

    const [isClicked4, setIsClicked4] = useState(false);
    const [isClicked5, setIsClicked5] = useState(false);

    const [isClicked6, setIsClicked6] = useState(false);


    const animateAndRedirect = () => {
        setIsClicked(true);
        setTimeout(() => {
            window.location.href = "/test"; // Thay đổi đường dẫn trang mới tại đây
        }, 200); // Thời gian chờ 300ms (0.3 giây) trước khi chuyển trang
    };
    const animateAndRedirect2 = () => {
        setIsClicked2(true);
        setTimeout(() => {
            window.location.href = "/chartAccMenu"; // Thay đổi đường dẫn trang mới tại đây
        }, 200); // Thời gian chờ 300ms (0.3 giây) trước khi chuyển trang
    }; const animateAndRedirect3 = () => {
        setIsClicked3(true);
        setTimeout(() => {
            window.location.href = "/test"; // Thay đổi đường dẫn trang mới tại đây
        }, 300); // Thời gian chờ 300ms (0.3 giây) trước khi chuyển trang
    };
    const animateAndRedirect4 = () => {
        setIsClicked4(true);
        setTimeout(() => {
            window.location.href = "/test"; // Thay đổi đường dẫn trang mới tại đây
        }, 300); // Thời gian chờ 300ms (0.3 giây) trước khi chuyển trang
    };
    const animateAndRedirect5 = () => {
        setIsClicked5(true);
        setTimeout(() => {
            window.location.href = "/test"; // Thay đổi đường dẫn trang mới tại đây
        }, 300); // Thời gian chờ 300ms (0.3 giây) trước khi chuyển trang
    };
    const animateAndRedirect6 = () => {
        setIsClicked6(true);
        setTimeout(() => {
            window.location.href = "/test"; // Thay đổi đường dẫn trang mới tại đây
        }, 300); // Thời gian chờ 300ms (0.3 giây) trước khi chuyển trang
    };



    return (
        <div className='' style={{ height: '100vh' }} >
            <div className='py-5 text-green-700 ' ><p style={{ fontSize: 40, fontWeight: 500 }}>Hệ Thống Quản Lý Vùng Nuôi</p> </div>
            <div className=' text-gray-500 ' ><p style={{ fontSize: 40, fontWeight: 500 }}>Chọn để tiếp tục</p> </div>

            <div className=' py-10' >
                <div className='flex'>
                    <div style={{ width: "20%" }} ></div>

                    <div
                        className={`FeedTrans flex   bg-white ${isClicked ? 'active' : ''}`}
                        onClick={animateAndRedirect}
                        style={{ width: '25%', height: 150, borderRadius: 20, }}
                    >
                        <div className='hover-text' style={{ width: "30%", position: 'relative', top: 30, left: 20, }}  >
                            <HiOutlineDocumentReport size={70} />
                        </div>
                        <div className='hover-text' style={{ width: "60%", position: 'relative', top: 50, }} >
                            <p style={{ fontSize: 25, fontWeight: 500 }} className='px-2'>Báo cáo thức ăn</p>

                        </div>
                    </div>
                    <div style={{ width: "8%" }} ></div>
                    <div
                        className={`FeedTrans flex  bg-white ${isClicked2 ? 'active' : ''}`}
                        onClick={animateAndRedirect2}
                        style={{ width: '25%', height: 150, borderRadius: 20 }}
                    >
                        <div style={{ width: "30%", position: 'relative', top: 30, left: 20 }}  >
                            <MdOutlineCalculate size={70} />
                        </div>
                        <div style={{ width: "60%", position: 'relative', top: 50, }} >
                            <p style={{ fontSize: 25, fontWeight: 500 }} className='px-2'>Lũy Kế thức ăn</p>

                        </div>
                    </div>
                    <div style={{ width: "20%" }} ></div>



                </div>
                <div className='py-10'  ></div>
                <div className='flex'>
                    <div style={{ width: "8%" }} ></div>

                    <div
                        className={`FeedTrans1 flex  bg-white ${isClicked4 ? 'active' : ''}`}
                        onClick={animateAndRedirect4}
                        style={{ width: '25%', height: 150, borderRadius: 20 }}
                    >
                        <div style={{ width: "30%", position: 'relative', top: 30, left: 20 }}  >
                            <GiWaterfall size={70} />
                        </div>
                        <div style={{ width: "60%", position: 'relative', top: 50, }} >
                            <p style={{ fontSize: 25, fontWeight: 500 }} className='px-2'>Trạm bơm </p>

                        </div>
                    </div>
                    <div style={{ width: "8%" }} ></div>

                    <div
                        className={`FeedTrans1 flex  bg-white ${isClicked5 ? 'active' : ''}`}
                        onClick={animateAndRedirect5}
                        style={{ width: '25%', height: 150, borderRadius: 20 }}
                    >
                        <div style={{ width: "30%", position: 'relative', top: 30, left: 20 }}  >
                            <GiKitchenScale size={70} />
                        </div>
                        <div style={{ width: "60%", position: 'relative', top: 50, }} >
                            <p style={{ fontSize: 25, fontWeight: 500 }} className='px-2'>Thu hoạch</p>

                        </div>
                    </div>
                    <div style={{ width: "8%" }} ></div>

                    <div
                        className={`FeedTrans1 flex  bg-white ${isClicked3 ? 'active' : ''}`}
                        onClick={animateAndRedirect3}
                        style={{ width: '25%', height: 150, borderRadius: 20 }}
                    >
                        <div style={{ width: "30%", position: 'relative', top: 30, left: 20 }}  >
                            <AiOutlineDashboard size={70} />
                        </div>
                        <div style={{ width: "60%", position: 'relative', top: 30, }} >
                            <p style={{ fontSize: 25, fontWeight: 500 }} className='px-2'>Quan trắc đo pH, DO, °C </p>

                        </div>
                    </div>
                    <div style={{ width: "8%" }} ></div>

                </div>
            </div>

        </div>
    )
}
