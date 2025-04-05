// StockSidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const MOCK_DATA = [
  { name: 'RELIANCE', price: 2790, change: 1.2 },
  { name: 'TCS', price: 3560, change: -0.8 },
  { name: 'INFY', price: 1480, change: 0.4 },
  { name: 'ICICIBANK', price: 950, change: -1.1 },
  { name: 'HDFCBANK', price: 1630.80, change: -1.03 },
  { name: 'SBIN', price: 605.00, change: +1.65 },
  { name: 'KOTAKBANK', price: 1702.75, change: -0.25 },
  { name: 'ITC', price: 411.20, change: +0.30 },
  { name:"AXISBANK", price: 1045.95, change: +0.90 },
  { name: "LT", price: 3550.35, change: -0.15 },
];

export default function StockSidebar() {
  const [stocks, setStocks] = useState(MOCK_DATA);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => ({
        ...s,
        price: +(s.price + (Math.random() * 10 - 5)).toFixed(2),
        change: +(Math.random() * 2 - 1).toFixed(2),
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredStocks = stocks.filter(stock => stock.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-[300px] border-r bg-white shadow-md p-4 space-y-4">
      <Input
        placeholder="Search stocks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="rounded-xl"
      />

      <Card className="p-4 bg-gradient-to-br from-green-100 to-green-300">
        <h2 className="font-bold text-sm mb-2">NIFTY 50</h2>
        <p className="text-lg font-semibold">22,450.30 <span className="text-green-600">+0.65%</span></p>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-blue-100 to-blue-300">
        <h2 className="font-bold text-sm mb-2">SENSEX</h2>
        <p className="text-lg font-semibold">74,320.85 <span className="text-green-600">+0.78%</span></p>
      </Card>

      <ScrollArea className="h-[60vh] pr-2">
        {filteredStocks.map(stock => (
          <div key={stock.name} className="flex justify-between items-center border-b py-2">
            <div>
              <h4 className="font-medium text-sm">{stock.name}</h4>
              <p className={`text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change}%
              </p>
            </div>
            <p className="font-semibold">₹{stock.price}</p>
          </div>
        ))}
        {filteredStocks.length === 0 && <Skeleton className="h-6 w-full" />}
      </ScrollArea>
    </div>
  );
}
