'use client'

import React from 'react'
import { Sheet } from '@/components/ui/Sheet'
import { useTransactionStore } from '@/store/transactionStore'
import PhoneSend from './PhoneSend'
import { useLanguageStore } from '@/store/languageStore'

export const PhoneSendSheet: React.FC = () => {
    const { isInstantOpen, closeInstant } = useTransactionStore();
    const { t } = useLanguageStore();

    return (
        <Sheet
            isOpen={isInstantOpen}
            onClose={closeInstant}
            title={t('phone.send.sheet.title')}
            description={t('phone.send.sheet.desc')}
        >
            <PhoneSend isSheet onClose={closeInstant} />
        </Sheet>
    );
};

export default PhoneSendSheet;
