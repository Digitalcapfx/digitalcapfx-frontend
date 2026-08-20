'use client';

import React, { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Use useState to ensure each request gets its own QueryClient in SSR environments
  const [client] = useState(() => queryClient);

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </I18nextProvider>
  );
}
