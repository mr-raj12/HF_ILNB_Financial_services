"use client"

import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';

// Define chart types
type ChartType = 'line' | 'candlestick' | 'bar';

// Define time periods
type TimePeriod = 'live' | '1W' | '1M' | '3M' | '1Y' | 'all';

// Define exchange types
type ExchangeType = 'NSE' | 'BSE';

interface TimeSeriesData {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

interface ApiResponse<T> {
  values: T[];
  meta: {
    currency: string;
    symbol: string;
    exchange: string;
    interval: string;
  };
}

interface ChartDataPoint {
  x: number;
  y: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartData {
  data: ChartDataPoint[];
  meta?: ApiResponse<TimeSeriesData>['meta'];
}

// Function to generate dummy data for testing
const generateDummyData = (count: number, startPrice: number = 100): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  let currentPrice = startPrice;
  const volatility = 0.02; // 2% daily volatility
  
  // Generate data points
  for (let i = 0; i < count; i++) {
    // Generate random price movement
    const change = (Math.random() * 2 - 1) * volatility * currentPrice;
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * volatility * currentPrice;
    const low = Math.min(open, close) - Math.random() * volatility * currentPrice;
    const volume = Math.floor(Math.random() * 1000000) + 100000;
    
    // Add data point
    data.push({
      x: Date.now() - (count - i) * 24 * 60 * 60 * 1000, // One day apart
      y: close,
      open,
      high,
      low,
      close,
      volume
    });
    
    currentPrice = close;
  }
  
  return data;
};

export function PriceChart() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('1M');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [exchange, setExchange] = useState<ExchangeType>('NSE');
  const [chartData, setChartData] = useState<ChartData>({ 
    data: generateDummyData(30), // Generate 30 days of data
    meta: {
      currency: '₹',
      symbol: 'DUMMY',
      exchange: 'NSE',
      interval: '1d'
    }
  });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [loading, setLoading] = useState(false);

  // Update data when time period changes
  useEffect(() => {
    setLoading(true);
    try {
      let count = 30; // Default to 30 days
      switch (timePeriod) {
        case 'live':
          count = 1;
          break;
        case '1W':
          count = 7;
          break;
        case '1M':
          count = 30;
          break;
        case '3M':
          count = 90;
          break;
        case '1Y':
          count = 365;
          break;
        case 'all':
          count = 730; // 2 years
          break;
      }
      
      const newData = generateDummyData(count);
      const prices = newData.map(d => d.y);
      setPriceRange({
        min: Math.min(...prices),
        max: Math.max(...prices)
      });
      
      setChartData({ 
        data: newData,
        meta: {
          currency: '₹',
          symbol: 'DUMMY',
          exchange: 'NSE',
          interval: '1d'
        }
      });
    } catch (error) {
      console.error('Error generating chart data:', error);
    } finally {
      setLoading(false);
    }
  }, [timePeriod]);
  
  // Convert points to SVG path for line chart
  const getPathData = () => {
    if (chartData.data.length < 2) return '';
    
    let path = '';
    const tension = 0.3; // Controls the curve smoothness (0-1)
    
    for (let i = 0; i < chartData.data.length; i++) {
      const point = chartData.data[i];
      const x = (i / (chartData.data.length - 1)) * 100;
      const y = 100 - ((point.y - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
      
      if (i === 0) {
        path += `M ${x},${y}`;
      } else {
        const prevPoint = chartData.data[i - 1];
        const prevX = ((i - 1) / (chartData.data.length - 1)) * 100;
        const prevY = 100 - ((prevPoint.y - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
        
        // Calculate control points for cubic bezier
        const cp1x = prevX + (x - prevX) * tension;
        const cp1y = prevY;
        const cp2x = prevX + (x - prevX) * tension;
        const cp2y = y;
        
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
      }
    }
    
    return path;
  };
  
  // Generate price labels
  const priceLabels = Array.from({ length: 5 }, (_, i) => {
    const price = priceRange.min + (i / 4) * (priceRange.max - priceRange.min);
    return price.toFixed(4);
  });
  
  // Render candlestick chart
  const renderCandlestickChart = () => {
    return (
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(75, 85, 99, 0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {chartData.data.map((point, i) => {
          const x = (i / (chartData.data.length - 1)) * 100;
          const openY = 100 - ((point.open - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
          const closeY = 100 - ((point.close - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
          const highY = 100 - ((point.high - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
          const lowY = 100 - ((point.low - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
          
          const isUp = point.close >= point.open;
          const color = isUp ? '#10b981' : '#ef4444';
          const shadowColor = isUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
          
          // Calculate width based on data density
          const width = Math.max(1, 100 / chartData.data.length * 0.8);
          
          return (
            <g key={i}>
              {/* Shadow effect */}
              <rect
                x={x - width/2}
                y={Math.min(openY, closeY)}
                width={width}
                height={Math.abs(closeY - openY)}
                fill={shadowColor}
                filter="blur(2)"
                opacity="0.5"
              />
              {/* Candlestick body */}
              <rect
                x={x - width/2}
                y={Math.min(openY, closeY)}
                width={width}
                height={Math.abs(closeY - openY)}
                fill={color}
                rx="1"
              />
              {/* High/low wicks */}
              <line
                x1={x}
                y1={highY}
                x2={x}
                y2={lowY}
                stroke={color}
                strokeWidth="1"
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>
    );
  };
  
  // Render bar chart
  const renderBarChart = () => {
    return (
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(75, 85, 99, 0.1)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {chartData.data.map((point, i) => {
          const x = (i / (chartData.data.length - 1)) * 100;
          const y = 100 - ((point.y - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
          const height = 100 - y;
          const isUp = i === 0 || point.y >= chartData.data[i-1].y;
          const color = isUp ? '#10b981' : '#ef4444';
          const shadowColor = isUp ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';
          
          // Calculate width based on data density
          const width = Math.max(1, 100 / chartData.data.length * 0.8);
          
          return (
            <g key={i}>
              {/* Shadow effect */}
              <rect
                x={x - width/2}
                y={y}
                width={width}
                height={height}
                fill={shadowColor}
                filter="blur(2)"
                opacity="0.5"
              />
              {/* Bar */}
              <rect
                x={x - width/2}
                y={y}
                width={width}
                height={height}
                fill={color}
                rx="1"
              />
            </g>
          );
        })}
      </svg>
    );
  };
  
  // Render line chart
  const renderLineChart = () => {
    const pathData = getPathData();
    
    return (
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(75, 85, 99, 0.1)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        
        {/* Area under the line */}
        <path
          d={`${pathData} L 100,100 L 0,100 Z`}
          fill="url(#gradient)"
        />
        
        {/* Simple clean line */}
        <path
          d={pathData}
          fill="none"
          stroke="#10b981"
          strokeWidth="1"
        />
        
        {/* Data points */}
        {chartData.data.map((point, i) => {
          const x = (i / (chartData.data.length - 1)) * 100;
          const y = 100 - ((point.y - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
          
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1"
              fill="#10b981"
              stroke="#1a1d1e"
              strokeWidth="0.5"
              className="opacity-0 hover:opacity-100 transition-opacity duration-200"
            />
          );
        })}
      </svg>
    );
  };
  
  // Render the appropriate chart based on selected type
  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      );
    }
    
    if (chartData.data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          No data available
        </div>
      );
    }
    
    switch (chartType) {
      case 'line':
        return renderLineChart();
      case 'candlestick':
        return renderCandlestickChart();
      case 'bar':
        return renderBarChart();
      default:
        return renderLineChart();
    }
  };

  useEffect(() => {
    console.log(chartData);
  }, [chartData]);
  
  // Calculate current price and change
  const currentPrice = chartData.data.length > 0 ? chartData.data[chartData.data.length - 1].y : 0;
  const previousPrice = chartData.data.length > 1 ? chartData.data[chartData.data.length - 2].y : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;
  
  return (
    <div className="bg-white p-4 lg:p-6 rounded-lg border border-gray-200">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900">{chartData.meta?.currency || '₹'}{currentPrice.toFixed(4)}</h2>
            <span className={priceChange >= 0 ? "text-green-600" : "text-red-600"}>
              {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(4)} ({priceChangePercent.toFixed(2)}%)
            </span>
          </div>
          {/* <div className="flex gap-2">
            <Button 
              variant={exchange === 'NSE' ? "default" : "outline"}
              size="sm"
              onClick={() => setExchange('NSE')}
              className="text-xs"
            >
              NSE
            </Button>
            <Button 
              variant={exchange === 'BSE' ? "default" : "outline"}
              size="sm"
              onClick={() => setExchange('BSE')}
              className="text-xs"
            >
              BSE
            </Button>
          </div> */}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {(['live', '1W', '1M', '3M', '1Y', 'all'] as TimePeriod[]).map((period) => (
            <Button 
              key={period}
              variant={timePeriod === period ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimePeriod(period)}
              className="text-xs"
            >
              {period}
            </Button>
          ))}
        </div>
        
        <div className="h-64 relative">
          {/* Price labels */}
          <div className="absolute right-0 top-0 bottom-0 w-16 flex flex-col justify-between text-right pr-2 text-xs text-gray-500">
            {priceLabels.map((price, i) => (
              <span key={i}>{chartData.meta?.currency || '₹'}{price}</span>
            ))}
          </div>
          
          {/* Chart */}
          <div className="absolute inset-0 pr-16">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-rows-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border-t border-gray-100" />
              ))}
            </div>
            
            {/* Chart content */}
            {renderChart()}
            
            {/* Invisible hover areas */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="relative w-full h-full">
                {chartData.data.map((point, i) => {
                  const x = (i / (chartData.data.length - 1)) * 100;
                  const y = 100 - ((point.y - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
                  const xPercent = `${x}%`;
                  const yPercent = `${y}%`;
                  
                  // Calculate price change from previous point
                  const prevPoint = i > 0 ? chartData.data[i-1] : point;
                  const priceChange = point.y - prevPoint.y;
                  const priceChangePercent = (priceChange / prevPoint.y) * 100;
                  const isUp = priceChange >= 0;
                  
                  return (
                    <div 
                      key={i}
                      className="absolute w-6 h-6 -ml-3 -mt-3 cursor-pointer group"
                      style={{ left: xPercent, top: yPercent }}
                    >
                      <div className="absolute w-6 h-6 bg-green-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-white border border-gray-200 text-gray-900 text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-lg z-10">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Price:</span>
                          <span className="font-semibold text-green-600">{chartData.meta?.currency || '₹'}{point.y.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-gray-500">Change:</span>
                          <span className={`font-medium ${isUp ? "text-green-600" : "text-red-600"}`}>
                            {isUp ? "+" : ""}{priceChange.toFixed(4)} ({priceChangePercent.toFixed(2)}%)
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-gray-500">Time:</span>
                          <span className="font-medium">
                            {new Date(point.x).toLocaleString()}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full justify-center">
          <Button 
            variant={chartType === 'line' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setChartType('line')}
            className="text-xs"
          >
            Line
          </Button>
          <Button 
            variant={chartType === 'candlestick' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setChartType('candlestick')}
            className="text-xs"
          >
            Candlestick
          </Button>
          <Button 
            variant={chartType === 'bar' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setChartType('bar')}
            className="text-xs"
          >
            Bar
          </Button>
        </div>
      </div>
    </div>
  );
}