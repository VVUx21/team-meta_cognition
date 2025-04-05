"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDown, ArrowUp, BarChart3, ChevronDown, LineChart, Menu, Search } from 'lucide-react';
import Link from "next/link";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useRef } from "react";

// Data arrays
const topGainers = [
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 890.34, change: 5.67 },
  { symbol: "META", name: "Meta Platforms", price: 485.12, change: 4.23 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 165.78, change: 3.89 }
];

const topLosers = [
  { symbol: "INTC", name: "Intel Corp.", price: 42.56, change: -3.45 },
  { symbol: "WMT", name: "Walmart Inc.", price: 60.34, change: -2.12 },
  { symbol: "DIS", name: "Walt Disney Co.", price: 110.45, change: -1.78 }
];

const mostTradedMTF = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF", price: 520.34, volume: "45.2M" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", price: 440.56, volume: "32.1M" },
  { symbol: "IWM", name: "iShares Russell 2000 ETF", price: 205.23, volume: "28.7M" }
];
const popularETFs = [
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", price: 480.45, aum: 400.5 },
  { symbol: "IVV", name: "iShares Core S&P 500 ETF", price: 485.67, aum: 350.2 },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", price: 250.89, aum: 380.7 }
];

interface Stock {
  name: string;
  symbol: string;
  price: number;
  changesPercentage: number;
  change?: number;
  volume?: string;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  chart: any[];
}

const priceHistory = [
  { time: '9:30', price: 180 },
  { time: '10:00', price: 185 },
  { time: '10:30', price: 182 },
  { time: '11:00', price: 190 },
  { time: '11:30', price: 188 },
];

const sectorDistribution = [
  { name: 'Tech', value: 40 },
  { name: 'Energy', value: 25 },
  { name: 'Finance', value: 20 },
  { name: 'Health', value: 15 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function Home() {
  const [activeTab, setActiveTab] = useState("gainers");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [topIntradayStocks, setTopIntradayStocks] = useState<Stock[]>([]);
  const [visibleStocks, setVisibleStocks] = useState(5);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [isLoading, setIsLoading] = useState(false);
  const stockListRef = useRef(null);

  const handleScroll = () => {
    if (stockListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = stockListRef.current;
      
      if (scrollTop + clientHeight >= scrollHeight - 20 && visibleStocks < topIntradayStocks.length) {
        setVisibleStocks(prev => Math.min(prev + 5, topIntradayStocks.length));
      }
    }
  };

  const handleAnalyze = async (symbol: string) => {
    setIsLoading(true);
    setSelectedSymbol(symbol);
    try {
      const apiKey = 'YOUR_TWELVE_DATA_API_KEY'; // Replace with your API key
      const [quoteRes, timeSeriesRes] = await Promise.all([
        axios.get(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`),
        axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=5min&outputsize=30&apikey=${apiKey}`)
      ]);

      setStockData({
        symbol: symbol,
        price: parseFloat(quoteRes.data.price),
        change: parseFloat(quoteRes.data.percent_change),
        chart: timeSeriesRes.data.values.reverse(), // for chronological chart
      });
    } catch (error) {
      console.error("Error fetching stock data:", error);
      alert("Failed to fetch stock data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTopIntradayStocks = async () => {
      try {
        const response = await fetch("https://financialmodelingprep.com/stable/most-actives?apikey=STz1y1UAFDtZZzuGVtAsoUJpnLwWRFAb");
        const data = await response.json();
        setTopIntradayStocks(data);
      } catch (error) {
        console.error("Error fetching top intraday stocks:", error);
      }
    };
  
    fetchTopIntradayStocks();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-900">
        {/* Header remains same as previous version */}
      </header>

      <main className="flex-1">
        <div className="container mx-auto py-6 px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📈 Market Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400">Real-time market insights at a glance</p>
            
            {/* Stock Data Display */}
            {stockData && (
              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stockData.symbol} Stock Analysis
                  </h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    stockData.change >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">${stockData.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={stockData.chart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="datetime" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="close" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Price Trend Chart */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                🕒 Live Price Movement (Last 5 Hours)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={priceHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Most Traded Stocks */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 w-full max-w-md">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🔥 Hot Stocks</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Most traded today</p>
                </div>
                <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  Today
                </button>
              </div>
              <div 
                ref={stockListRef}
                className="p-6 overflow-y-auto max-h-96" 
                onScroll={handleScroll}
              >
                {topIntradayStocks.slice(0, visibleStocks).map((stock) => (
                  <div key={stock.symbol} className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {stock.symbol.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{stock.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{stock.symbol}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="font-medium text-gray-900 dark:text-white">${stock.price.toFixed(2)}</div>
                      <div className="flex items-center justify-between w-full">
                        <div className={`flex items-center text-sm ${stock.changesPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.changesPercentage >= 0 ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {Math.abs(stock.changesPercentage).toFixed(2)}%
                        </div>
                        <button
                          onClick={() => handleAnalyze(stock.symbol)}
                          disabled={isLoading}
                          className="ml-3 text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          {isLoading && selectedSymbol === stock.symbol ? 'Loading...' : 'Analyze'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {visibleStocks < topIntradayStocks.length && (
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Scroll for more stocks
                  </div>
                )}
              </div>
            </div>

            {/* Rest of your components (Top Gainers & Losers, Most Traded MTF, etc.) */}
            {/* ... (keep all your existing components as they were) ... */}
            
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 dark:border-gray-700">
        {/* Footer remains same as previous version */}
      </footer>
    </div>
  );
}