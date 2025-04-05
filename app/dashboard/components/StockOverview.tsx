"use client"

import React, { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'

interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  currency: string;
  dayHigh: number;
  dayLow: number;
  openPrice: number;
  previousClose: number;
  priceChange: number;
  priceChangePercent: number;
  isPositive: boolean;
  volume: string;
  averageVolume: string;
  isMarketOpen: boolean;
  fiftyTwoWeek: {
    low: number;
    high: number;
    lowChange: number;
    highChange: number;
    lowChangePercent: number;
    highChangePercent: number;
    range: string;
  };
}

const StockOverview = () => {
  const [activeTab, setActiveTab] = useState('price')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [stockData, setStockData] = useState<StockData | null>(null)
  
  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Set dummy data
  useEffect(() => {
    const dummyData: StockData = {
      symbol: "AAPL",
      name: "Apple Inc.",
      currentPrice: 175.34,
      currency: "$",
      dayHigh: 176.45,
      dayLow: 174.12,
      openPrice: 175.12,
      previousClose: 174.89,
      priceChange: 0.45,
      priceChangePercent: 0.26,
      isPositive: true,
      volume: "45.2M",
      averageVolume: "58.3M",
      isMarketOpen: true,
      fiftyTwoWeek: {
        low: 124.17,
        high: 198.23,
        lowChange: 51.17,
        highChange: -22.89,
        lowChangePercent: 41.2,
        highChangePercent: -11.5,
        range: "124.17 - 198.23"
      }
    }
    setStockData(dummyData)
  }, [])
  
  if (!mounted) return null;
  
  if (!stockData) {
    return (
      <div className="w-full bg-white dark:bg-[#1a1d1e] rounded-lg p-4 lg:p-6 shadow-sm transition-all duration-300 h-125">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg lg:text-xl font-semibold text-center w-full">Stock Overview</h2>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-[#1a1d1e] rounded-lg p-4 lg:p-6 shadow-sm transition-all duration-300 h-125">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg lg:text-xl font-semibold text-center w-full">Stock Overview</h2>
      </div>
      
      <Tabs defaultValue="price" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="price">Price Summary</TabsTrigger>
          <TabsTrigger value="stats">Market Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="price">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-1"
          >
            <div className="flex flex-col items-center">
              <h2 className="text-4xl font-bold mb-2">{stockData.currency}{stockData.currentPrice.toFixed(2)}</h2>
              <div className={cn(
                "flex items-center text-sm font-medium",
                stockData.isPositive ? "text-green-500" : "text-red-500"
              )}>
                <span>{stockData.isPositive ? "+" : "-"}{stockData.currency}{Math.abs(stockData.priceChange).toFixed(2)}</span>
                <span className="ml-1">({stockData.isPositive ? "+" : "-"}{stockData.priceChangePercent.toFixed(2)}%)</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {stockData.name} ({stockData.symbol})
              </div>
              <div className={cn(
                "text-xs mt-1 px-2 py-1 rounded-full",
                stockData.isMarketOpen ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"
              )}>
                {stockData.isMarketOpen ? "Market Open" : "Market Closed"}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Day's High</p>
                <p className="text-lg font-semibold">{stockData.currency} {stockData.dayHigh.toFixed(2)}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Day's Low</p>
                <p className="text-lg font-semibold">{stockData.currency} {stockData.dayLow.toFixed(2)}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Open</p>
                <p className="text-lg font-semibold">{stockData.currency} {stockData.openPrice.toFixed(2)}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Previous Close</p>
                <p className="text-lg font-semibold">{stockData.currency} {stockData.previousClose.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        </TabsContent>
        <TabsContent value="stats">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                <p className="text-lg font-semibold">{stockData.volume}</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Volume</p>
                <p className="text-lg font-semibold">{stockData.averageVolume}</p>
              </div>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">52 Week Range</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Low</span>
                  <span className="font-semibold">{stockData.currency} {stockData.fiftyTwoWeek.low.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">High</span>
                  <span className="font-semibold">{stockData.currency} {stockData.fiftyTwoWeek.high.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Range</span>
                  <span className="font-semibold">{stockData.fiftyTwoWeek.range}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default StockOverview