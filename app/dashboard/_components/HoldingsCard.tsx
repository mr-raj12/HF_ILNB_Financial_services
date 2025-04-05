'use client';

import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';

import {PriceChart} from './PriceChart'

import {
  Tooltip as RadixTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button';
import StockOverview from './StockOverview';

interface Holding {
  tradingsymbol: string;
  exchange: string;
  instrument_token: number;
  isin: string;
  product: string;
  price: number;
  quantity: number;
  used_quantity: number;
  t1_quantity: number;
  realised_quantity: number;
  authorised_quantity: number;
  authorised_date: string;
  authorisation: Record<string, any>;
  opening_quantity: number;
  short_quantity: number;
  collateral_quantity: number;
  collateral_type: string;
  discrepancy: boolean;
  average_price: number;
  last_price: number;
  close_price: number;
  pnl: number;
  day_change: number;
  day_change_percentage: number;
  mtf: {
    quantity: number;
    used_quantity: number;
    average_price: number;
    value: number;
    initial_margin: number;
  };
}

interface HoldingsProps {
  getholdings: Holding[];
}

export function HoldingsCard({ getholdings }: HoldingsProps) {
  if (!getholdings || !Array.isArray(getholdings) || getholdings.length === 0) {
    return (
      <motion.div 
        className="p-5 rounded-lg shadow bg-white dark:bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center py-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Holdings</h2>
          <p className="text-gray-600 dark:text-gray-400">You don't have any holdings at the moment.</p>
        </div>
      </motion.div>
    );
  }

  const totalValue = getholdings.reduce((acc, holding) => acc + (holding.quantity * holding.last_price), 0);
  const totalPnL = getholdings.reduce((acc, holding) => acc + holding.pnl, 0);
  const isProfit = totalPnL >= 0;

  const chartData = getholdings.map((holding) => ({
    name: holding.tradingsymbol,
    value: holding.quantity * holding.last_price,
    pnl: holding.pnl,
    dayChange: holding.day_change,
    dayChangePercentage: holding.day_change_percentage,
  }));

  const performanceData = getholdings.map((holding) => ({
    name: holding.tradingsymbol,
    value: holding.quantity * holding.last_price,
    pnl: holding.pnl,
    dayChange: holding.day_change,
    dayChangePercentage: holding.day_change_percentage,
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <motion.div 
        className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Portfolio Holdings</h2>
              <TooltipProvider>
                <RadixTooltip>
                  <TooltipTrigger>
                    <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your current investment portfolio showing all your stock holdings and their performance</p>
                  </TooltipContent>
                </RadixTooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your current investment portfolio</p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</span>
                <TooltipProvider>
                  <RadixTooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Current market value of all your holdings</p>
                    </TooltipContent>
                  </RadixTooltip>
                </TooltipProvider>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{totalValue.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total P&L</span>
                <TooltipProvider>
                  <RadixTooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total profit or loss from your holdings based on purchase price</p>
                    </TooltipContent>
                  </RadixTooltip>
                </TooltipProvider>
              </div>
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Portfolio Distribution</h3>
              <TooltipProvider>
                <RadixTooltip>
                  <TooltipTrigger>
                    <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Visual breakdown of your portfolio showing the percentage allocation of each holding</p>
                  </TooltipContent>
                </RadixTooltip>
              </TooltipProvider>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f9fafb', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{
                      paddingLeft: '20px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Performance Overview</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#f9fafb', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="value" name="Current Value" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="pnl" name="P&L" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detailed Holdings</h3>
          <div className="space-y-4">
            {getholdings.map((holding) => {
              const holdingValue = holding.quantity * holding.last_price;
              const holdingPnL = holding.pnl;
              const isHoldingProfit = holdingPnL >= 0;
              const dayChangePercentage = holding.day_change_percentage;

              return (
                <div>
                  <motion.div
                    key={holding.tradingsymbol}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md cursor-pointer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => document.getElementById(`drawer-${holding.tradingsymbol}`)?.click()}
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{holding.tradingsymbol}</h3>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Quantity</span>
                            <span className="font-medium text-gray-900 dark:text-white">{holding.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Avg Price</span>
                            <span className="font-medium text-gray-900 dark:text-white">₹{holding.average_price.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-400">LTP</span>
                            <span className="font-medium text-gray-900 dark:text-white">₹{holding.last_price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center space-x-2">
                          <span 
                            className={`text-lg font-bold ${
                              isHoldingProfit ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                            }`}
                          >
                            {isHoldingProfit ? (
                              <ArrowTrendingUpIcon className="h-5 w-5 inline mr-1" />
                            ) : (
                              <ArrowTrendingDownIcon className="h-5 w-5 inline mr-1" />
                            )}
                            ₹{holdingPnL.toFixed(2)}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${
                          dayChangePercentage >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                        }`}>
                          {dayChangePercentage >= 0 ? '+' : ''}{dayChangePercentage.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button 
                        id={`drawer-${holding.tradingsymbol}`}
                        className="hidden"
                      >
                        Open Drawer
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[80vh]">
                      <div className="flex flex-col h-full">
                        <DrawerHeader className="border-b border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <div className='w-full' >
                              <DrawerTitle className="text-xl font-bold text-center w-full text-gray-900 dark:text-white">
                                {holding.tradingsymbol} Analysis
                              </DrawerTitle>
                              <DrawerDescription className="text-gray-600 text-center dark:text-gray-400">
                                Detailed stock information and price history
                              </DrawerDescription>
                            </div>
                            <DrawerClose asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-5 w-5"
                                >
                                  <line x1="18" y1="6" x2="6" y2="18"></line>
                                  <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                                <span className="sr-only">Close</span>
                              </Button>
                            </DrawerClose>
                          </div>
                        </DrawerHeader>
                        
                        <div className="flex-1 overflow-y-auto p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-6">
                              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Chart</h3>
                                <PriceChart/>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Stock Overview</h3>
                                <StockOverview/>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <DrawerFooter className="border-t border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between items-center w-full">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Current Price:</span>
                              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                ₹{holding.last_price.toFixed(2)}
                              </span>
                              <span className={`text-sm font-medium ${
                                holding.day_change_percentage >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'
                              }`}>
                                {holding.day_change_percentage >= 0 ? '+' : ''}{holding.day_change_percentage.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </DrawerFooter>
                      </div>
                    </DrawerContent>
                  </Drawer>

                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
} 