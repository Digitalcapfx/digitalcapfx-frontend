'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { maintenanceService } from '@/services/maintenance.service';
import MaintenanceScreen from '@/components/shared/MaintenanceScreen';
import Image from 'next/image';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export const MaintenanceGuard: React.FC<MaintenanceGuardProps> = ({ children }) => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['maintenance-status'],
    queryFn: () => maintenanceService.getMaintenanceStatus(),
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const isMaintenanceMode = Boolean(data?.maintenanceMode ?? data?.maintenance_mode);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#050816] flex flex-col items-center justify-center space-y-4 select-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-full bg-primary-500/10 blur-[20px] animate-pulse" />
          <Image
            src="/DFXLogo.svg"
            alt="DigitalCap FX"
            width={140}
            height={32}
            className="h-8 w-auto object-contain brightness-110 contrast-125 animate-pulse"
            priority
          />
        </div>
      </div>
    );
  }

  if (isMaintenanceMode) {
    return (
      <MaintenanceScreen
        message={data?.message}
        onRefresh={() => refetch()}
        isChecking={isFetching}
      />
    );
  }

  return <>{children}</>;
};

export default MaintenanceGuard;
