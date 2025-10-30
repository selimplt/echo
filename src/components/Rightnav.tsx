'use client'
import React from 'react'
import { usePathname } from 'next/navigation'

import Mainpagenav from './Mainpagenav'
import Dmside from './dmside'
import Svside from './svside'

const Rightnav = () => {
    const path = usePathname();
    if (path === "/" || path === "/servers" || path === "/search" || path === "/settings") {
        return (
            <Mainpagenav />
        )
    }
    if (path.startsWith("/dm/")) {
        return (
            <Dmside />
        )
    }
    if (path.startsWith("/servers/")) {
        return (
            <Svside />
        )
    }
    return (
        <div className='hidden'></div>
    )
}

export default Rightnav