'use client'
import React from 'react'
import { usePathname } from 'next/navigation'

import Mainpagenav from './Mainpagenav'
import Dmside from './dmside'

const Rightnav = () => {
    const path = usePathname();
    if (path === "/" || path === "/servers" || path === "/search") {
        return (
            <Mainpagenav />
        )
    }
    if (path.startsWith("/dm/")) {
        return (
            <Dmside />
        )
    }
    return (
        <div className='hidden'></div>
    )
}

export default Rightnav