import React from 'react'
import HeaderTheme from '../HeaderTheme/HeaderTheme'

export default function Layout({ Component }) {
    return (
        <div>
            <HeaderTheme />
            <Component />
        </div>
    )
}
