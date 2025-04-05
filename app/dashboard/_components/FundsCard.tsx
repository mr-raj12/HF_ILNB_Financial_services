'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface Margin {
  equity: {
    enabled: boolean;
    net: number;
    available: {
      adhoc_margin: number;
      cash: number;
      opening_balance: number;
      live_balance: number;
      collateral: number;
      intraday_payin: number;
    };
    utilised: {
      debits: number;
      exposure: number;
      m2m_realised: number;
      m2m_unrealised: number;
      option_premium: number;
      payout: number;
      span: number;
      holding_sales: number;
      turnover: number;
      liquid_collateral: number;
      stock_collateral: number;
      equity: number;
      delivery: number;
    };
  };
  commodity: {
    enabled: boolean;
    net: number;
    available: {
      adhoc_margin: number;
      cash: number;
      opening_balance: number;
      live_balance: number;
      collateral: number;
      intraday_payin: number;
    };
    utilised: {
      debits: number;
      exposure: number;
      m2m_realised: number;
      m2m_unrealised: number;
      option_premium: number;
      payout: number;
      span: number;
      holding_sales: number;
      turnover: number;
      liquid_collateral: number;
      stock_collateral: number;
      equity: number;
      delivery: number;
    };
  };
}

interface FundsProps {
  getfunds: {
    success: boolean;
    profile: Margin;
  };
}

export function FundsCard({ getfunds }: FundsProps) {
  if (!getfunds?.profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">No funds data available</p>
      </div>
    );
  }

  const { equity, commodity } = getfunds.profile;

  const totalAvailable = (equity?.available?.live_balance || 0) + (commodity?.available?.live_balance || 0);
  const totalUtilised = (equity?.utilised?.exposure || 0) + (commodity?.utilised?.exposure || 0);
  const totalNet = (equity?.net || 0) + (commodity?.net || 0);
  const totalCash = (equity?.available?.cash || 0) + (commodity?.available?.cash || 0);
  const totalCollateral = (equity?.available?.collateral || 0) + (commodity?.available?.collateral || 0);
  const totalAdhocMargin = (equity?.available?.adhoc_margin || 0) + (commodity?.available?.adhoc_margin || 0);
  const totalIntradayPayin = (equity?.available?.intraday_payin || 0) + (commodity?.available?.intraday_payin || 0);

  const chartData = [
    {
      name: 'Equity',
      available: equity?.available?.live_balance || 0,
      utilised: equity?.utilised?.exposure || 0,
      cash: equity?.available?.cash || 0,
      collateral: equity?.available?.collateral || 0,
      adhoc_margin: equity?.available?.adhoc_margin || 0,
      intraday_payin: equity?.available?.intraday_payin || 0,
    },
    {
      name: 'Commodity',
      available: commodity?.available?.live_balance || 0,
      utilised: commodity?.utilised?.exposure || 0,
      cash: commodity?.available?.cash || 0,
      collateral: commodity?.available?.collateral || 0,
      adhoc_margin: commodity?.available?.adhoc_margin || 0,
      intraday_payin: commodity?.available?.intraday_payin || 0,
    }
  ];

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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-bold text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ₹{entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="p-5 rounded-lg shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">💰 Funds Overview</h2>
            <div className="tooltip" data-tip="Total available funds across all segments including equity and commodity. This represents your total investable capital.">
              <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-4 py-3 rounded-lg shadow-sm">
              <span className="text-base font-medium text-gray-600 dark:text-gray-400">Available:</span>
              <div className="tooltip" data-tip="The total amount of funds available for trading, including cash, collateral, and adhoc margin. This is your current trading power.">
                <span className="text-lg font-bold text-green-600 dark:text-green-500">
                  ₹{totalAvailable.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-lg shadow-sm">
              <span className="text-base font-medium text-gray-600 dark:text-gray-400">Utilised:</span>
              <div className="tooltip" data-tip="The amount of funds currently being used in open positions. This includes exposure from current trades and positions.">
                <span className="text-lg font-bold text-red-600 dark:text-red-500">
                  ₹{totalUtilised.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-3 rounded-lg shadow-sm">
              <span className="text-base font-medium text-gray-600 dark:text-gray-400">Net:</span>
              <div className="tooltip" data-tip="Your net balance after considering all credits and debits. This is your actual account value.">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-500">
                  ₹{totalNet.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📊 Funds Distribution</h3>
              <div className="tooltip" data-tip="Visual representation of how your funds are distributed between available and utilised amounts across different segments. Helps track your trading capacity and current exposure.">
                <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="available" name="Available" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="utilised" name="Utilised" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">💵 Funds Composition</h3>
              <div className="tooltip" data-tip="Detailed breakdown of your funds into different components. Shows how your available funds are allocated between cash, collateral, and adhoc margin.">
                <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="cash" name="Cash" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="collateral" name="Collateral" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="adhoc_margin" name="Adhoc Margin" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Cash</h4>
              <div className="tooltip" data-tip="The total amount of liquid cash available in your account. This includes your opening balance and any additional pay-ins.">
                <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-500 mt-2">₹{totalCash.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Collateral</h4>
              <div className="tooltip" data-tip="The total value of securities and other assets held as collateral. This can be used to increase your trading power.">
                <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-500 mt-2">₹{totalCollateral.toFixed(2)}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Adhoc Margin</h4>
              <div className="tooltip" data-tip="Additional margin provided by the broker for specific trades. This is temporary and can be withdrawn based on market conditions.">
                <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-500 mt-2">₹{totalAdhocMargin.toFixed(2)}</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {chartData.map((fund) => (
          <motion.div
            key={fund.name}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors bg-white dark:bg-gray-800 shadow-sm"
            variants={item}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{fund.name}</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Available: <span className="font-medium text-green-600 dark:text-green-500">₹{fund.available.toFixed(2)}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Utilised: <span className="font-medium text-red-600 dark:text-red-500">₹{fund.utilised.toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Cash: <span className="font-medium text-blue-600 dark:text-blue-500">₹{fund.cash.toFixed(2)}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Collateral: <span className="font-medium text-amber-600 dark:text-amber-500">₹{fund.collateral.toFixed(2)}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-blue-600 dark:text-blue-500">
                  ₹{(fund.available - fund.utilised).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Net Balance
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 