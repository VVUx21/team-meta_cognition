"use client"

import { ArrowDown, ArrowUp, BarChart3, ChevronDown, LineChart, Menu, Search } from 'lucide-react'
import Link from "next/link"
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { useEffect, useRef, useState } from "react";

// Data arrays
const mostTradedStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 175.34, change: 1.23 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 180.56, change: -2.45 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 185.23, change: 0.78 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 420.45, change: 1.56 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 150.67, change: -0.89 }
]

const topGainers = [
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 890.34, change: 5.67 },
  { symbol: "META", name: "Meta Platforms", price: 485.12, change: 4.23 },
  { symbol: "AMD", name: "Advanced Micro Devices", price: 165.78, change: 3.89 }
]

const topLosers = [
  { symbol: "INTC", name: "Intel Corp.", price: 42.56, change: -3.45 },
  { symbol: "WMT", name: "Walmart Inc.", price: 60.34, change: -2.12 },
  { symbol: "DIS", name: "Walt Disney Co.", price: 110.45, change: -1.78 }
]

const mostTradedMTF = [
  { symbol: "SPY", name: "SPDR S&P 500 ETF", price: 520.34, volume: "45.2M" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", price: 440.56, volume: "32.1M" },
  { symbol: "IWM", name: "iShares Russell 2000 ETF", price: 205.23, volume: "28.7M" }
]

const popularETFs = [
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", price: 480.45, aum: 400.5 },
  { symbol: "IVV", name: "iShares Core S&P 500 ETF", price: 485.67, aum: 350.2 },
  { symbol: "VTI", name: "Vanguard Total Stock Market ETF", price: 250.89, aum: 380.7 }
]

interface Stock {
  name: string;
  symbol: string;
  price: number;
  changesPercentage: number;
}

const priceHistory = [
  { time: '9:30', price: 180 },
  { time: '10:00', price: 185 },
  { time: '10:30', price: 182 },
  { time: '11:00', price: 190 },
  { time: '11:30', price: 188 },
]

const sectorDistribution = [
  { name: 'Tech', value: 40 },
  { name: 'Energy', value: 25 },
  { name: 'Finance', value: 20 },
  { name: 'Health', value: 15 },
]

const topStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 175.34, change: 1.23, volume: "45.2M" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 180.56, change: -2.45, volume: "32.1M" },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 185.23, change: 0.78, volume: "28.7M" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 420.45, change: 1.56, volume: "25.3M" }
]

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function Home() {
  const [activeTab, setActiveTab] = useState("gainers")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [topIntradayStocks, setTopIntradayStocks] = useState<Stock[]>([]);
  const [visibleStocks, setVisibleStocks] = useState(5);
  const stockListRef = useRef(null);

  const handleScroll = () => {
    if (stockListRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = stockListRef.current;
      
      if (scrollTop + clientHeight >= scrollHeight - 20 && visibleStocks < topIntradayStocks.length) {
        setVisibleStocks(prev => Math.min(prev + 5, topIntradayStocks.length));
      }
    }
  };
  const handleAnalyze = (symbol: string) => {
    // This function would handle the analyze action
    console.log(`Analyzing ${symbol}`);
    alert(`Analyzing ${symbol}`);
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
                    <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                  {Math.abs(stock.changesPercentage).toFixed(2)}%
                </div>
                <button
                  onClick={() => handleAnalyze(stock.symbol)}
                  className="ml-3 text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Analyze
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
            {/* Top Gainers & Losers */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-1">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🏆 Top Movers</h2>
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={() => setActiveTab("gainers")}
                      className={`rounded-l-lg px-3 py-1 text-sm font-medium ${
                        activeTab === "gainers" 
                          ? "bg-blue-600 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Gainers
                    </button>
                    <button
                      onClick={() => setActiveTab("losers")}
                      className={`rounded-r-lg px-3 py-1 text-sm font-medium ${
                        activeTab === "losers" 
                          ? "bg-blue-600 text-white" 
                          : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      Losers
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Biggest {activeTab === "gainers" ? "gainers" : "losers"} today
                </p>
              </div>
              <div className="p-6">
                {(activeTab === "gainers" ? topGainers : topLosers).map((stock) => (
                  <div key={stock.symbol} className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {stock.symbol.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{stock.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{stock.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">${stock.price.toFixed(2)}</div>
                      <div className={`flex items-center text-sm ${
                        activeTab === "gainers" ? "text-green-500" : "text-red-500"
                      }`}>
                        {activeTab === "gainers" ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        {Math.abs(stock.change).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Traded MTF */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🚀 Leveraged ETFs</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">High-volume margin trading</p>
                </div>
                <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  View All
                </button>
              </div>
              <div className="p-6">
                {mostTradedMTF.map((stock) => (
                  <div key={stock.symbol} className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {stock.symbol.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{stock.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{stock.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">${stock.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Vol: {stock.volume}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular ETFs for SIP */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-1">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">💼 Long-Term ETFs</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Popular SIP investments</p>
                </div>
                <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300">
                  Start SIP
                </button>
              </div>
              <div className="p-6">
                {popularETFs.map((etf) => (
                  <div key={etf.symbol} className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/20">
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                          {etf.symbol.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{etf.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{etf.symbol}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900 dark:text-white">${etf.price.toFixed(2)}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">AUM: ${etf.aum}B</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sector Distribution Chart */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-1">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🏭 Sector Overview</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Market capitalization distribution</p>
              </div>
              <div className="p-6">
                <div className="mx-auto h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sectorDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sectorDistribution.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  {sectorDistribution.map((sector, index) => (
                    <div key={sector.name} className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {sector.name} ({sector.value}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Volume Comparison Chart */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 lg:col-span-1">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">📊 Volume Leaders</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Today's highest trading volumes</p>
              </div>
              <div className="p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mostTradedStocks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="symbol" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="price" 
                        fill="#3B82F6" 
                        name="Stock Price"
                      />
                      <Bar 
                        dataKey="change" 
                        fill="#10B981" 
                        name="Daily Change (%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Top Intraday Stocks */}
          <div className="mt-6">
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">⚡ Day Trading Picks</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Best intraday opportunities</p>
              </div>
              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {topStocks.map((stock) => (
                    <div key={stock.symbol} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                          <LineChart className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{stock.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{stock.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900 dark:text-white">${stock.price.toFixed(2)}</div>
                        <div className={`flex items-center text-sm ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {stock.change >= 0 ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          {Math.abs(stock.change).toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Vol: {stock.volume}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-6 dark:border-gray-700">
        {/* Footer remains same as previous version */}
      </footer>
    </div>
  )
}