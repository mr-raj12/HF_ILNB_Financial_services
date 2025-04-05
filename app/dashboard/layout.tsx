'use client';

import { ReactNode } from 'react';
import StockSidebar from "@/components/StockSidebar";
import Header from '@/components/layout/Header';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-muted text-foreground">
      <StockSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="p-6 overflow-y-auto h-full">{children}</main>
      </div>
    </div>
  );
}