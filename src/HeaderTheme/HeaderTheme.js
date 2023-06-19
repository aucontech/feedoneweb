import React from 'react'
import logoAucontech from "./img/Aucontech.png"
import "./HeaderTheme.css"
export default function HeaderTheme() {
    return (
        <div className='bg-green-600' style={{ width: "100%", }}  >
            <div className='bg-white background-imgHeader' style={{ width: 200, height: 50, }} >
                <img style={{ width: 130, position: 'relative', left: 30, top: 13 }} src={logoAucontech} alt="" />
            </div>
        </div>
    )
}
