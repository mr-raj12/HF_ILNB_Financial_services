'use client';

import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Position {
  tradingsymbol: string;
  quantity: number;
  average_price: number;
  last_price: number;
  pnl: number;
  unrealised: number;
  realised: number;
  product: string;
  exchange: string;
  instrument_token: string;
  buy_quantity: number;
  sell_quantity: number;
  buy_price: number;
  sell_price: number;
}

interface PositionsProps {
  positions: Position[];
  exchange: string;
  instrument_token: number;
  product: string;
  quantity: number;
  overnight_quantity: number;
  multiplier: number;
  average_price: number;
  close_price: number;
  last_price: number;
  value: number;
  pnl: number;
  m2m: number;
  unrealised: number;
  realised: number;
  buy_quantity: number;
  buy_price: number;
  buy_value: number;
  buy_m2m: number;
  sell_quantity: number;
  sell_price: number;
  sell_value: number;
  sell_m2m: number;
  day_buy_quantity: number;
  day_buy_price: number;
  day_buy_value: number;
  day_sell_quantity: number;
  day_sell_price: number;
  day_sell_value: number;
}

interface PositionsProps {
  positions: {
    net: Position[];
    day: Position[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function PositionsCard({ positions }: PositionsProps) {
  if (!positions || !Array.isArray(positions) || positions.length === 0) {
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center py-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Positions</h2>
          <p className="text-gray-600 dark:text-gray-400">You don't have any open positions at the moment.</p>
        </div>
      </motion.div>
    );
  }

  const totalPnL = positions.reduce((acc, pos) => acc + pos.pnl, 0);
  const totalUnrealised = positions.reduce((acc, pos) => acc + pos.unrealised, 0);
  const totalRealised = positions.reduce((acc, pos) => acc + pos.realised, 0);
  const isProfit = totalPnL >= 0;

  const totalPnL = positions.net.reduce((acc, pos) => acc + pos.pnl, 0);
  const totalUnrealised = positions.net.reduce((acc, pos) => acc + pos.unrealised, 0);
  const totalRealised = positions.net.reduce((acc, pos) => acc + pos.realised, 0);
  const isProfit = totalPnL >= 0;

    name: pos.tradingsymbol,
    pnl: pos.pnl,
    unrealised: pos.unrealised,
    realised: pos.realised,
    value: pos.quantity * pos.last_price,

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1 }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="p-5 rounded-lg shadow bg-white dark:bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">Portfolio Performance</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
              <span className="text-base font-medium text-gray-600 dark:text-gray-400">Total P&L:</span>
              <span 
                className={`text-lg font-bold ${isProfit ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}
              >
                ₹{totalPnL.toFixed(2)}
                {isProfit ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 inline ml-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 inline ml-1" />
                )}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
              <span className="text-base font-medium text-gray-600 dark:text-gray-400">Unrealised:</span>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-500">
                ₹{totalUnrealised.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
              <span className="text-base font-medium text-gray-600 dark:text-gray-400">Realised:</span>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-500">
                ₹{totalRealised.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">P&L Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                  />
                  <Legend />
                  <Bar dataKey="pnl" name="P&L" fill={isProfit ? "#10B981" : "#EF4444"} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position Value</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {positions.map((position) => (
        {positions.net.map((position) => (
          <motion.div
            key={position.tradingsymbol}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors bg-white dark:bg-gray-800"
            variants={item}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{position.tradingsymbol}</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Qty: <span className="font-medium">{position.quantity}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Avg: <span className="font-medium">₹{position.average_price.toFixed(2)}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      LTP: <span className="font-medium">₹{position.last_price.toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Unrealised: <span className="font-medium text-purple-600 dark:text-purple-500">₹{position.unrealised.toFixed(2)}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Realised: <span className="font-medium text-amber-600 dark:text-amber-500">₹{position.realised.toFixed(2)}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Value: <span className="font-medium text-blue-600 dark:text-blue-500">₹{(position.quantity * position.last_price).toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-base font-bold ${
                    position.pnl >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                  }`}
                >
                  {position.pnl >= 0 ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 inline mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 inline mr-1" />
                  )}
                  ₹{position.pnl.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {position.pnl >= 0 
                    ? `+${((position.pnl / (position.average_price * position.quantity)) * 100).toFixed(2)}%` 
                    : `${((position.pnl / (position.average_price * position.quantity)) * 100).toFixed(2)}%`}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}