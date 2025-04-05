'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ThemeWrapper from '@/components/layout/ThemeWrapper';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Briefcase, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useState } from 'react';
import { TrendingUp, LineChart } from "lucide-react";
import BrokerToggle from '@/components/Card/BrokerToggle';

// Static Data
import ZerodhaUserCard from '@/components/Card/ZerodhaUserCard';
import fundsData from '../datas/FundsData';
import holdingsData from '../datas/HoldingsData';
import positionsData from '../datas/PositionsData';
import ordersData from '../datas/OrdersData';


export default function Dashboard() {
  const [visibleSection, setVisibleSection] = useState<string | null>(null);

  const [selectedBroker, setSelectedBroker] = useState<'Zerodha' | 'Upstox'>('Zerodha');

  const sections = [
    { label: 'Funds', data: fundsData },
    { label: 'Holdings', data: holdingsData },
    { label: 'Positions', data: positionsData },
    { label: 'Orders', data: ordersData },
  ];

  return (
    <div className="max-w-7xl mx-auto p-2 space-y-6">
      <ThemeWrapper selectedBroker={selectedBroker} />

      {/* BROKER TOGGLE CARD */}
      <BrokerToggle selectedBroker={selectedBroker} onSelect={setSelectedBroker} />

      {/* Zerodha Profile Card */}
      {selectedBroker === "Zerodha" && <ZerodhaUserCard />} 

      {/* Upstox Profile Card */}
      {/* {selectedBroker === "Upstox" && <UpstoxUserCard />} */}

      <div className="p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.label}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
              onClick={() =>
                setVisibleSection(
                  visibleSection === section.label ? null : section.label
                )
              }
            >
              {section.label}
            </button>
          ))}
        </div>

        {sections.map(
          (section) =>
            visibleSection === section.label && (
              <div key={section.label}>
                <h2 className="text-xl font-bold mt-4 mb-2">{section.label}</h2>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                  {JSON.stringify(section.data, null, 2)}
                </pre>
              </div>
            )
        )}
      </div>
    </div>
  );
}