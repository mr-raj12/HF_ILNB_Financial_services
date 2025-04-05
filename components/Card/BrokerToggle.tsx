'use client';

import { TrendingUp, LineChart } from 'lucide-react';

type Broker = 'Zerodha' | 'Upstox';

interface BrokerToggleProps {
  selectedBroker: Broker;
  onSelect: (broker: Broker) => void;
}

export default function BrokerToggle({
  selectedBroker,
  onSelect,
}: BrokerToggleProps) {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-xl bg-gray-200 p-2 rounded-full flex shadow-inner">
        <button
          onClick={() => onSelect('Zerodha')}
          className={`w-1/2 py-4 text-xl font-semibold rounded-full transition-all duration-300 
            ${selectedBroker === 'Zerodha' ? 'bg-[#E33F44] text-white shadow-md' : 'text-gray-800'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Zerodha
          </div>
        </button>
        <button
          onClick={() => onSelect('Upstox')}
          className={`w-1/2 py-4 text-xl font-semibold rounded-full transition-all duration-300 
            ${selectedBroker === 'Upstox' ? 'bg-[#5724C9] text-white shadow-md' : 'text-gray-800'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <LineChart className="h-5 w-5" />
            Upstox
          </div>
        </button>
      </div>
    </div>
  );
}
