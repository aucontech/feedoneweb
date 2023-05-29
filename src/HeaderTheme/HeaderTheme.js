import React from 'react'
import logoFish from "../Page/LoginPage/img/logo-vh.png"
import "./HeaderTheme.css"
export default function HeaderTheme() {
    return (
        <div className=' shadow-header h-12  ' >
            <div className='flex'>
                <div>
                    <img style={{ width: 120, }} className=' p-2' src={logoFish} alt="" />
                </div>

            </div>
        </div>
    )
}
