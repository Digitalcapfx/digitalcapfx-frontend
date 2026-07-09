import React from 'react'
import Footer from './Footer'
import NavBar from './NavBar'

const NoAuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='bg-[#050816] min-h-screen flex flex-col w-full max-w-full overflow-x-hidden'>
            <NavBar />
            <main className='flex-1 w-full max-w-full overflow-x-hidden'>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default NoAuthLayout