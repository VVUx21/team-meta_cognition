"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDown, ArrowUp, BarChart3, ChevronDown, LineChart, Menu, Search, AlertCircle } from 'lucide-react';
import Link from "next/link";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartJSTooltip, Legend } from 'chart.js';
import { Bar as ChartBar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartJSTooltip,
    Legend
);

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

interface StockAnalysis {
  ticker: string;
  latest_close: number;
  daily_return: number;
  volatility: number;
  ma_50: number;
  ma_200: number;"use client";

  import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowDown, ArrowUp, BarChart3, ChevronDown, LineChart, Menu, Search, AlertCircle } from 'lucide-react';
import Link from "next/link";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartJSTooltip, Legend } from 'chart.js';
import { Bar as ChartBar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    ChartJSTooltip,
    Legend
);

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

interface StockAnalysis {
  ticker: string;
  latest_close: number;
  daily_return: number;
  volatility: number;
  ma_50: number;
  ma_200: number;
  rsi: number;
  macd: number;
  bb_upper: number;
  bb_middle: number;
  bb_lower: number;
  sharpe_ratio: number;
  risk_classification: string;
  summary: string;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  chart: any[];
  analysis?: StockAnalysis;
}

interface StockMetrics {
  forwardPE: number;
  trailingPE: number;
  dividendYield: number;
  beta: number;
  marketCap: number;
}

interface ComparisonResult {
  stock1: string;
  stock2: string;
  metrics: {
    [key: string]: StockMetrics;
  };
  better_stock: string;
  reasoning: string;
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
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const stockListRef = useRef(null);
  const [comparisonStock1, setComparisonStock1] = useState('');
  const [comparisonStock2, setComparisonStock2] = useState('');
  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(null);
  const [comparisonError, setComparisonError] = useState('');
  const [isComparing, setIsComparing] = useState(false);

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
    setAnalysisError(null);

    try {
      const mockChartData = Array.from({ length: 30 }, (_, i) => ({
        datetime: new Date(Date.now() - i * 5 * 60000).toLocaleTimeString(),
        close: 180 + (Math.random() * 20 - 10)
      })).reverse();

      const response = await axios.post('http://127.0.0.1:8000/chatbot/chat/', {
        ticker: symbol
      });

      setStockData({
        symbol: symbol,
        price: response.data.latest_close,
        change: response.data.daily_return * 100,
        chart: mockChartData,
        analysis: response.data
      });

    } catch (error) {
      console.error("Error fetching stock data:", error);
      setAnalysisError("Failed to fetch stock analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const compareStocks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comparisonStock1.trim() || !comparisonStock2.trim()) {
      setComparisonError('Please enter both stock symbols');
      return;
    }

    setIsComparing(true);
    setComparisonError('');

    try {
      const response = await axios.post('http://127.0.0.1:4000/compare-stocks', {
        stock1: comparisonStock1.endsWith('.ns') ? comparisonStock1 : `${comparisonStock1}.ns`,
        stock2: comparisonStock2.endsWith('.ns') ? comparisonStock2 : `${comparisonStock2}.ns`
      });

      setComparisonData(response.data);
    } catch (err) {
      setComparisonError('Error comparing stocks. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsComparing(false);
    }
  };

  const getChartData = (metric: keyof StockMetrics) => {
    if (!comparisonData) return { labels: [], datasets: [] };

    return {
      labels: [comparisonData.stock1, comparisonData.stock2],
      datasets: [
        {
          label: metric,
          data: [
            comparisonData.metrics[comparisonData.stock1][metric],
            comparisonData.metrics[comparisonData.stock2][metric]
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = (title: string) => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  });

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `₹${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `₹${(value / 1e6).toFixed(2)}M`;
    return `₹${value}`;
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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
          <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-6">
              <Link href="#" className="flex items-center gap-2 font-semibold">
                <BarChart3 className="h-6 w-6" />
                <span>Market Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                Sign In
              </button>
              <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-600/90 h-9 px-4 py-2"
              >
                Sign Up
              </button>
              <button
                  className="inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-50 lg:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="container mx-auto py-6 px-4 sm:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📈 Market Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">Real-time market insights at a glance</p>

              {/* Stock Data Display with Analysis */}
              {stockData && (
                  <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stockData.symbol} Stock Analysis
                      </h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                          stockData.change >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                    {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}%
                  </span>
                    </div>

                    {analysisError ? (
                        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                          {analysisError}
                        </div>
                    ) : (
                        <>
                          {/* Technical Indicators */}
                          {stockData.analysis && (
                              <div className="mb-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">${stockData.analysis.latest_close.toFixed(2)}</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Daily Return</p>
                                    <p className={`text-xl font-bold ${stockData.analysis.daily_return >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                      {(stockData.analysis.daily_return * 100).toFixed(2)}%
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">RSI (14)</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stockData.analysis.rsi.toFixed(2)}</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Risk Level</p>
                                    <p className={`inline-block px-2 py-1 rounded text-sm font-medium ${getRiskColor(stockData.analysis.risk_classification)}`}>
                                      {stockData.analysis.risk_classification}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">MACD</p>
                                    <p className={`text-lg font-bold ${stockData.analysis.macd >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                      {stockData.analysis.macd.toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">50-Day MA</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">${stockData.analysis.ma_50.toFixed(2)}</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">200-Day MA</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">${stockData.analysis.ma_200.toFixed(2)}</p>
                                  </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded dark:bg-gray-700 mb-4">
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Analysis Summary</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{stockData.analysis.summary}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Bollinger Bands</p>
                                    <div className="mt-1">
                                      <div className="flex justify-between text-xs">
                                        <span>Upper</span>
                                        <span className="font-medium">${stockData.analysis.bb_upper.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-xs mt-1">
                                        <span>Middle</span>
                                        <span className="font-medium">${stockData.analysis.bb_middle.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-xs mt-1">
                                        <span>Lower</span>
                                        <span className="font-medium">${stockData.analysis.bb_lower.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Volatility</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{(stockData.analysis.volatility * 100).toFixed(2)}%</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Sharpe Ratio</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stockData.analysis.sharpe_ratio.toFixed(4)}</p>
                                  </div>
                                </div>
                              </div>
                          )}

                          {/* Price Chart */}
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart data={stockData.chart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="datetime" />
                                <YAxis domain={['auto', 'auto']} />
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
                        </>
                    )}
                  </div>
              )}

              {/* Stock Comparator Section */}
              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  🔍 Stock Comparator
                </h3>

                <form onSubmit={compareStocks} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="stock1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Stock Symbol
                      </label>
                      <input
                          id="stock1"
                          type="text"
                          value={comparisonStock1}
                          onChange={(e) => setComparisonStock1(e.target.value.toUpperCase())}
                          className="w-full p-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          placeholder="e.g. AAPL"
                      />
                    </div>
                    <div>
                      <label htmlFor="stock2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Second Stock Symbol
                      </label>
                      <input
                          id="stock2"
                          type="text"
                          value={comparisonStock2}
                          onChange={(e) => setComparisonStock2(e.target.value.toUpperCase())}
                          className="w-full p-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          placeholder="e.g. MSFT"
                      />
                    </div>
                  </div>
                  <button
                      type="submit"
                      disabled={isComparing}
                      className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isComparing ? 'Comparing...' : 'Compare Stocks'}
                  </button>
                </form>

                {comparisonError && (
                    <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      <p>{comparisonError}</p>
                    </div>
                )}

                {comparisonData && (
                    <div className="mt-6 space-y-6">
                      {/* Comparison Result */}
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <p className="font-semibold dark:text-white">
                          Better Stock: <span className="font-bold">{comparisonData.better_stock}</span>
                        </p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">{comparisonData.reasoning}</p>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                          <h3 className="font-semibold mb-2 dark:text-white">Forward P/E Ratio</h3>
                          <div className="h-64">
                            <ChartBar
                                data={getChartData('forwardPE')}
                                options={chartOptions('Forward P/E Ratio Comparison')}
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                          <h3 className="font-semibold mb-2 dark:text-white">Trailing P/E Ratio</h3>
                          <div className="h-64">
                            <ChartBar
                                data={getChartData('trailingPE')}
                                options={chartOptions('Trailing P/E Ratio Comparison')}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Detailed Metrics */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Metric</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{comparisonData.stock1}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{comparisonData.stock2}</th>
                          </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Forward P/E</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock1].forwardPE.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock2].forwardPE.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Trailing P/E</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock1].trailingPE.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock2].trailingPE.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Dividend Yield</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {(comparisonData.metrics[comparisonData.stock1].dividendYield * 100).toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {(comparisonData.metrics[comparisonData.stock2].dividendYield * 100).toFixed(2)}%
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Beta</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock1].beta.toFixed(3)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock2].beta.toFixed(3)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Market Cap</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {formatMarketCap(comparisonData.metrics[comparisonData.stock1].marketCap)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {formatMarketCap(comparisonData.metrics[comparisonData.stock2].marketCap)}
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                )}
              </div>

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
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              activeTab === "gainers" ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                          }`}>
                      <span className={`text-sm font-medium ${
                          activeTab === "gainers" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}>
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
            </div>
          </div>
        </main>

        <footer className="border-t border-gray-200 py-6 dark:border-gray-700">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <Link href="#" className="flex items-center gap-2 font-semibold">
                  <BarChart3 className="h-6 w-6" />
                  <span>Market Dashboard</span>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} Market Dashboard. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}
  rsi: number;
  macd: number;
  bb_upper: number;
  bb_middle: number;
  bb_lower: number;
  sharpe_ratio: number;
  risk_classification: string;
  summary: string;
}

interface StockData {
  symbol: string;
  price: number;
  change: number;
  chart: any[];
  analysis?: StockAnalysis;
}

interface StockMetrics {
  forwardPE: number;
  trailingPE: number;
  dividendYield: number;
  beta: number;
  marketCap: number;
}

interface ComparisonResult {
  stock1: string;
  stock2: string;
  metrics: {
    [key: string]: StockMetrics;
  };
  better_stock: string;
  reasoning: string;
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
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const stockListRef = useRef(null);
  const [comparisonStock1, setComparisonStock1] = useState('');
  const [comparisonStock2, setComparisonStock2] = useState('');
  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(null);
  const [comparisonError, setComparisonError] = useState('');
  const [isComparing, setIsComparing] = useState(false);

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
    setAnalysisError(null);

    try {
      const mockChartData = Array.from({ length: 30 }, (_, i) => ({
        datetime: new Date(Date.now() - i * 5 * 60000).toLocaleTimeString(),
        close: 180 + (Math.random() * 20 - 10)
      })).reverse();

      const response = await axios.post('http://127.0.0.1:8000/chatbot/chat/', {
        ticker: symbol
      });

      setStockData({
        symbol: symbol,
        price: response.data.latest_close,
        change: response.data.daily_return * 100,
        chart: mockChartData,
        analysis: response.data
      });

    } catch (error) {
      console.error("Error fetching stock data:", error);
      setAnalysisError("Failed to fetch stock analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const compareStocks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comparisonStock1.trim() || !comparisonStock2.trim()) {
      setComparisonError('Please enter both stock symbols');
      return;
    }

    setIsComparing(true);
    setComparisonError('');

    try {
      const response = await axios.post('http://127.0.0.1:4000/compare-stocks', {
        stock1: comparisonStock1.endsWith('.ns') ? comparisonStock1 : `${comparisonStock1}.ns`,
        stock2: comparisonStock2.endsWith('.ns') ? comparisonStock2 : `${comparisonStock2}.ns`
      });

      setComparisonData(response.data);
    } catch (err) {
      setComparisonError('Error comparing stocks. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsComparing(false);
    }
  };

  const getChartData = (metric: keyof StockMetrics) => {
    if (!comparisonData) return { labels: [], datasets: [] };

    return {
      labels: [comparisonData.stock1, comparisonData.stock2],
      datasets: [
        {
          label: metric,
          data: [
            comparisonData.metrics[comparisonData.stock1][metric],
            comparisonData.metrics[comparisonData.stock2][metric]
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  const chartOptions = (title: string) => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  });

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `₹${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `₹${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `₹${(value / 1e6).toFixed(2)}M`;
    return `₹${value}`;
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
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
          <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-6">
              <Link href="#" className="flex items-center gap-2 font-semibold">
                <BarChart3 className="h-6 w-6" />
                <span>Market Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
                Sign In
              </button>
              <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-600/90 h-9 px-4 py-2"
              >
                Sign Up
              </button>
              <button
                  className="inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-50 lg:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          <div className="container mx-auto py-6 px-4 sm:px-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📈 Market Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400">Real-time market insights at a glance</p>

              {/* Stock Data Display with Analysis */}
              {stockData && (
                  <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {stockData.symbol} Stock Analysis
                      </h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                          stockData.change >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                    {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}%
                  </span>
                    </div>

                    {analysisError ? (
                        <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                          {analysisError}
                        </div>
                    ) : (
                        <>
                          {/* Technical Indicators */}
                          {stockData.analysis && (
                              <div className="mb-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Price</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">${stockData.analysis.latest_close.toFixed(2)}</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Daily Return</p>
                                    <p className={`text-xl font-bold ${stockData.analysis.daily_return >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                      {(stockData.analysis.daily_return * 100).toFixed(2)}%
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">RSI (14)</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stockData.analysis.rsi.toFixed(2)}</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Risk Level</p>
                                    <p className={`inline-block px-2 py-1 rounded text-sm font-medium ${getRiskColor(stockData.analysis.risk_classification)}`}>
                                      {stockData.analysis.risk_classification}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">MACD</p>
                                    <p className={`text-lg font-bold ${stockData.analysis.macd >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                      {stockData.analysis.macd.toFixed(2)}
                                    </p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">50-Day MA</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">${stockData.analysis.ma_50.toFixed(2)}</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">200-Day MA</p>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">${stockData.analysis.ma_200.toFixed(2)}</p>
                                  </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded dark:bg-gray-700 mb-4">
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Analysis Summary</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{stockData.analysis.summary}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Bollinger Bands</p>
                                    <div className="mt-1">
                                      <div className="flex justify-between text-xs">
                                        <span>Upper</span>
                                        <span className="font-medium">${stockData.analysis.bb_upper.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-xs mt-1">
                                        <span>Middle</span>
                                        <span className="font-medium">${stockData.analysis.bb_middle.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-xs mt-1">
                                        <span>Lower</span>
                                        <span className="font-medium">${stockData.analysis.bb_lower.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Volatility</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{(stockData.analysis.volatility * 100).toFixed(2)}%</p>
                                  </div>
                                  <div className="bg-gray-50 p-3 rounded dark:bg-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Sharpe Ratio</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stockData.analysis.sharpe_ratio.toFixed(4)}</p>
                                  </div>
                                </div>
                              </div>
                          )}

                          {/* Price Chart */}
                          <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsLineChart data={stockData.chart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="datetime" />
                                <YAxis domain={['auto', 'auto']} />
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
                        </>
                    )}
                  </div>
              )}

              {/* Stock Comparator Section */}
              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                  🔍 Stock Comparator
                </h3>

                <form onSubmit={compareStocks} className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="stock1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Stock Symbol
                      </label>
                      <input
                          id="stock1"
                          type="text"
                          value={comparisonStock1}
                          onChange={(e) => setComparisonStock1(e.target.value.toUpperCase())}
                          className="w-full p-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          placeholder="e.g. AAPL"
                      />
                    </div>
                    <div>
                      <label htmlFor="stock2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Second Stock Symbol
                      </label>
                      <input
                          id="stock2"
                          type="text"
                          value={comparisonStock2}
                          onChange={(e) => setComparisonStock2(e.target.value.toUpperCase())}
                          className="w-full p-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                          placeholder="e.g. MSFT"
                      />
                    </div>
                  </div>
                  <button
                      type="submit"
                      disabled={isComparing}
                      className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isComparing ? 'Comparing...' : 'Compare Stocks'}
                  </button>
                </form>

                {comparisonError && (
                    <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-5 w-5" />
                      <p>{comparisonError}</p>
                    </div>
                )}

                {comparisonData && (
                    <div className="mt-6 space-y-6">
                      {/* Comparison Result */}
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <p className="font-semibold dark:text-white">
                          Better Stock: <span className="font-bold">{comparisonData.better_stock}</span>
                        </p>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">{comparisonData.reasoning}</p>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                          <h3 className="font-semibold mb-2 dark:text-white">Forward P/E Ratio</h3>
                          <div className="h-64">
                            <ChartBar
                                data={getChartData('forwardPE')}
                                options={chartOptions('Forward P/E Ratio Comparison')}
                            />
                          </div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                          <h3 className="font-semibold mb-2 dark:text-white">Trailing P/E Ratio</h3>
                          <div className="h-64">
                            <ChartBar
                                data={getChartData('trailingPE')}
                                options={chartOptions('Trailing P/E Ratio Comparison')}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Detailed Metrics */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Metric</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{comparisonData.stock1}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{comparisonData.stock2}</th>
                          </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Forward P/E</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock1].forwardPE.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock2].forwardPE.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Trailing P/E</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock1].trailingPE.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock2].trailingPE.toFixed(2)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Dividend Yield</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {(comparisonData.metrics[comparisonData.stock1].dividendYield * 100).toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {(comparisonData.metrics[comparisonData.stock2].dividendYield * 100).toFixed(2)}%
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Beta</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock1].beta.toFixed(3)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {comparisonData.metrics[comparisonData.stock2].beta.toFixed(3)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Market Cap</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {formatMarketCap(comparisonData.metrics[comparisonData.stock1].marketCap)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {formatMarketCap(comparisonData.metrics[comparisonData.stock2].marketCap)}
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                )}
              </div>

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
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                              activeTab === "gainers" ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                          }`}>
                      <span className={`text-sm font-medium ${
                          activeTab === "gainers" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      }`}>
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
            </div>
          </div>
        </main>

        <footer className="border-t border-gray-200 py-6 dark:border-gray-700">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-4">
                <Link href="#" className="flex items-center gap-2 font-semibold">
                  <BarChart3 className="h-6 w-6" />
                  <span>Market Dashboard</span>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} Market Dashboard. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}