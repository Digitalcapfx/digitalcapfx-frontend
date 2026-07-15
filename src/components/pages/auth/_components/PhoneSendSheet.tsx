'use client'

import React from 'react'
import { Sheet } from '@/components/ui/Sheet'
import { useTransactionStore } from '@/store/transactionStore'
import PhoneSend from './PhoneSend'

export const PhoneSendSheet: React.FC = () => {
    const { isInstantOpen, closeInstant } = useTransactionStore();

    return (
        <Sheet
            isOpen={isInstantOpen}
            onClose={closeInstant}
            title="Instant Send"
            description="Send stablecoins to any DigitalCapFx customer using just their phone number."
        >
            <PhoneSend isSheet onClose={closeInstant} />
        </Sheet>
    );
};

export default PhoneSendSheet;
