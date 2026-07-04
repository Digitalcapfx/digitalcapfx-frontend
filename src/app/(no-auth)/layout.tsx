import NoAuthLayout from '@/components/pages/no-auth/layout/NoAuthLayout'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <NoAuthLayout>{children}</NoAuthLayout>
    )
}

export default layout