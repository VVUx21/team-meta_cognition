"use client";

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { BarChart, Search, AlertCircle, ChevronDown } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

export default function StockComparator() {
  const [stock1, setStock1] = useState('');
  const [stock2, setStock2] = useState('');
  const [comparisonData, setComparisonData] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const compareStocks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stock1.trim() || !stock2.trim()) {
      setError('Please enter both stock symbols');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/compare-stocks', {
        stock1: stock1.endsWith('.ns') ? stock1 : `${stock1}.ns`,
        stock2: stock2.endsWith('.ns') ? stock2 : `${stock2}.ns`
      });

      setComparisonData(response.data);
    } catch (err) {
      setError('Error comparing stocks. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for charts
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-900">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="#" className="flex items-center gap-2 font-semibold">
              <BarChart className="h-6 w-6" />
              <span>Stock Comparator</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Stock Comparator</h1>
          <p className="text-gray-500 dark:text-gray-400">Compare two stocks based on key financial metrics</p>
          
          <form onSubmit={compareStocks} className="mt-6 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="stock1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Stock Symbol
                </label>
                <div className="relative">
                  <input
                    id="stock1"
                    type="text"
                    value={stock1}
                    onChange={(e) => setStock1(e.target.value.toUpperCase())}
                    className="w-full p-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g. RELIANCE or RELIANCE.ns"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="stock2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Second Stock Symbol
                </label>
                <div className="relative">
                  <input
                    id="stock2"
                    type="text"
                    value={stock2}
                    onChange={(e) => setStock2(e.target.value.toUpperCase())}
                    className="w-full p-3 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    placeholder="e.g. TCS or TCS.ns"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Comparing...' : 'Compare Stocks'}
            </button>
          </form>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {comparisonData && (
          <div className="mt-8 space-y-8">
            {/* Comparison Result */}
            <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Comparison Result</h2>
              <div className={`p-4 rounded-lg mb-6 ${
                comparisonData.better_stock === comparisonData.stock1 
                  ? 'bg-green-100 dark:bg-green-900/20' 
                  : 'bg-blue-100 dark:bg-blue-900/20'
              }`}>
                <p className="font-semibold dark:text-white">
                  Better Stock: <span className="font-bold">{comparisonData.better_stock}</span>
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{comparisonData.reasoning}</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <h3 className="font-semibold mb-2 dark:text-white">Forward P/E Ratio</h3>
                  <div className="h-64">
                    <Bar 
                      data={getChartData('forwardPE')} 
                      options={chartOptions('Forward P/E Ratio Comparison')}
                    />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <h3 className="font-semibold mb-2 dark:text-white">Trailing P/E Ratio</h3>
                  <div className="h-64">
                    <Bar 
                      data={getChartData('trailingPE')} 
                      options={chartOptions('Trailing P/E Ratio Comparison')}
                    />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
                  <h3 className="font-semibold mb-2 dark:text-white">Dividend Yield</h3>
                  <div className="h-64">
                    <Bar 
                      data={getChartData('dividendYield')} 
                      options={chartOptions('Dividend Yield Comparison (%)')}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Metrics */}
            <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
              <h2 className="text-2xl font-bold mb-4 dark:text-white">Detailed Metrics</h2>
              
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
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 py-6 dark:border-gray-700">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-4">
              <Link href="#" className="flex items-center gap-2 font-semibold">
                <BarChart className="h-6 w-6" />
                <span>Stock Comparator</span>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} Stock Comparator. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}