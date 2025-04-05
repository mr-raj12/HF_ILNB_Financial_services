'use client';

import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import {
  Tooltip as RadixTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Order {
  account_id: string;
  placed_by: string;
  order_id: string;
  exchange_order_id: string;
  parent_order_id: string | null;
  status: string;
  status_message: string | null;
  status_message_raw: string | null;
  order_timestamp: string;
  exchange_update_timestamp: string;
  exchange_timestamp: string;
  variety: string;
  modified: boolean;
  exchange: string;
  tradingsymbol: string;
  instrument_token: number;
  order_type: string;
  transaction_type: string;
  validity: string;
  validity_ttl: number;
  product: string;
  quantity: number;
  disclosed_quantity: number;
  price: number;
  trigger_price: number;
  average_price: number;
  filled_quantity: number;
  pending_quantity: number;
  cancelled_quantity: number;
  market_protection: number;
  meta: Record<string, any>;
  tag: string | null;
  guid: string;
}

interface OrdersProps {
  orders: Order[];
}

export function OrdersCard({ orders }: OrdersProps) {
  if (!orders || orders.length === 0) {
    return (
      <motion.div 
        className="p-5 rounded-lg shadow bg-white dark:bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center py-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Orders</h2>
          <p className="text-gray-600 dark:text-gray-400">You don't have any orders at the moment.</p>
        </div>
      </motion.div>
    );
  }

  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status === 'COMPLETE').length;
  const pendingOrders = orders.filter(order => order.status === 'OPEN').length;
  const cancelledOrders = orders.filter(order => order.status === 'CANCELLED').length;

  const chartData = [
    { name: 'Completed', value: completedOrders, color: '#10B981' },
    { name: 'Pending', value: pendingOrders, color: '#F59E0B' },
    { name: 'Cancelled', value: cancelledOrders, color: '#EF4444' },
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'CANCELLED':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'COMPLETE':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  const getTransactionClass = (type: string) => {
    return type === 'BUY'
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
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
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-0">Order History</h2>
            <TooltipProvider>
              <RadixTooltip>
                <TooltipTrigger>
                  <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Overview of your recent orders and their current status</p>
                </TooltipContent>
              </RadixTooltip>
            </TooltipProvider>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <span className="text-base font-medium text-gray-600 dark:text-gray-400">Total:</span>
                <TooltipProvider>
                  <RadixTooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total number of orders placed in the current trading session</p>
                    </TooltipContent>
                  </RadixTooltip>
                </TooltipProvider>
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-500">
                {totalOrders}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <span className="text-base font-medium text-gray-600 dark:text-gray-400">Completed:</span>
                <TooltipProvider>
                  <RadixTooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Orders that have been successfully executed and completed</p>
                    </TooltipContent>
                  </RadixTooltip>
                </TooltipProvider>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-500">
                {completedOrders}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <span className="text-base font-medium text-gray-600 dark:text-gray-400">Pending:</span>
                <TooltipProvider>
                  <RadixTooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Orders that are still waiting to be executed or are in process</p>
                    </TooltipContent>
                  </RadixTooltip>
                </TooltipProvider>
              </div>
              <span className="text-lg font-bold text-amber-600 dark:text-amber-500">
                {pendingOrders}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              <div className="flex items-center space-x-1">
                <span className="text-base font-medium text-gray-600 dark:text-gray-400">Cancelled:</span>
                <TooltipProvider>
                  <RadixTooltip>
                    <TooltipTrigger>
                      <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Orders that were cancelled before execution</p>
                    </TooltipContent>
                  </RadixTooltip>
                </TooltipProvider>
              </div>
              <span className="text-lg font-bold text-red-600 dark:text-red-500">
                {cancelledOrders}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Order Status Distribution</h3>
              <TooltipProvider>
                <RadixTooltip>
                  <TooltipTrigger>
                    <span className="text-gray-500 dark:text-gray-400 cursor-help">ℹ️</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Visual breakdown of your orders by their current status</p>
                  </TooltipContent>
                </RadixTooltip>
              </TooltipProvider>
            </div>
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
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Order Value Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orders.map(order => ({
                  name: order.tradingsymbol,
                  value: order.quantity * (order.average_price || order.price),
                  type: order.transaction_type,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '0.375rem' }}
                    formatter={(value: number) => `₹${value.toFixed(2)}`}
                  />
                  <Legend />
                  <Bar dataKey="value" name="Value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
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
        {orders.map((order) => {
          const orderDate = new Date(order.order_timestamp);
          const formattedDate = orderDate.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
          });
          const formattedTime = orderDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <motion.div
              key={order.order_id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors bg-white dark:bg-gray-800"
              variants={item}
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-3 md:mb-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">{order.tradingsymbol}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center ${getStatusClass(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTransactionClass(order.transaction_type)}`}>
                      {order.transaction_type}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {order.quantity} Qty
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      ₹{order.price || order.average_price}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {order.product}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="inline-block bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-center">
                      <span className="block text-gray-700 dark:text-gray-300 font-medium">{formattedDate}</span>
                      <span>{formattedTime}</span>
                    </span>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    ID: {order.order_id.slice(0, 8)}...
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}