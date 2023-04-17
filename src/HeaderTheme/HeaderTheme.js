import React from 'react'
import logoFish from "../Page/LoginPage/img/logo-vh.png"
import "./HeaderTheme.css"
export default function HeaderTheme() {
    return (
        <div className=' shadow-header h-20 ' >
            <div className='flex'>
                <div>
                    <img style={{ width: 200 }} className=' p-2' src={logoFish} alt="" />
                </div>
                <div style={{ marginLeft: 100, width: 100 }}>
                    <input className='w-40' type="text" />

                </div>
            </div>
        </div>
    )
}
