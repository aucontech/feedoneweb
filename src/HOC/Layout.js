import React from 'react'
import HeaderTheme from '../HeaderTheme/HeaderTheme'
import "./Layout.css"
import ChartBagReport from '../ChartReport/ChartBagReport'
import ChartTestDelete from '../ChartReport/ChartTestDelete'
export default function Layout({ Component }) {
    return (
        <div className='bg-gray-100 bg-HeaderTheme ' >
            <HeaderTheme />
            <Component />
        </div>
    )
}
