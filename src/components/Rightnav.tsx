'use client'
import React from 'react'
import { usePathname } from 'next/navigation'

import Mainpagenav from './Mainpagenav'

const Rightnav = () => {
    const path = usePathname();
    if (path === "/") {
        return (
            <Mainpagenav />
        )
    }
    return (
        <div></div>
    )
}

export default Rightnav