'use client'

import React from 'react'
import PageError from '@/components/shared/PageError'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return <PageError error={error} reset={reset} />
}
