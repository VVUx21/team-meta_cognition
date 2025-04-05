"use client";

import { useState } from 'react';
import axios from 'axios';
import { BarChart3, Search, AlertCircle } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Link from "next/link";

// Properly register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
}

function getOverallSentimentEmoji(sentimentData: SentimentData): string {
  if (!sentimentData) return "❓";
  const { positive, negative, neutral } = sentimentData;
  const max = Math.max(positive, negative, neutral);
  if (max === positive) return "😊";
  if (max === negative) return "😢";
  if (max === neutral) return "😐";
  return "❓";
}

export default function SentimentAnalysisPage() {
  const [inputText, setInputText] = useState('');
  const [sentimentData, setSentimentData] = useState<SentimentData>({
    positive: 45,
    negative: 25,
    neutral: 30
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeSentiment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Mock analysis - replace with your actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate different results each time
      setSentimentData({
        positive: Math.floor(Math.random() * 50) + 30,
        negative: Math.floor(Math.random() * 30) + 10,
        neutral: Math.floor(Math.random() * 40) + 10
      });

      // Uncomment for real API call:
      // const response = await axios.post('http://127.0.0.1:8000/sentiment_analysis', {
      //   text: inputText
      // });
      // setSentimentData(response.data);

    } catch (err) {
      setError('Error analyzing text. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Chart data configurations
  const pieData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [sentimentData.positive, sentimentData.negative, sentimentData.neutral],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const barData = {
    labels: ['Sentiment Analysis'],
    datasets: [
      {
        label: 'Positive',
        data: [sentimentData.positive],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
      },
      {
        label: 'Negative',
        data: [sentimentData.negative],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
      {
        label: 'Neutral',
        data: [sentimentData.neutral],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  // Chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#6B7280',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Sentiment Distribution',
        color: '#6B7280',
        font: {
          size: 16
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        max: 100,
        min: 0,
        ticks: {
          callback: (tickValue: string | number) => `${tickValue}%`
        }
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#6B7280',
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Sentiment Percentage',
        color: '#6B7280',
        font: {
          size: 16
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-900">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="#" className="flex items-center gap-2 font-semibold">
              <BarChart3 className="h-6 w-6" />
              <span>MarketDash</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto py-6 px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🧠 Sentiment Analysis</h1>
            <p className="text-gray-500 dark:text-gray-400">Analyze text sentiment using AI model</p>
            
            <form onSubmit={analyzeSentiment} className="mt-6 max-w-2xl">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-32 p-4 rounded-lg border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  placeholder="Enter text to analyze..."
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-4 inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? 'Analyzing...' : 'Analyze Text'}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {/* Pie Chart */}
              <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Sentiment Distribution</h3>
                <div className="h-64">
                  <Pie 
                    data={pieData} 
                    options={pieOptions}
                  />
                </div>
              </div>

              {/* Bar Chart */}
              <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Sentiment Percentage</h3>
                <div className="h-64">
                  <Bar 
                    data={barData} 
                    options={barOptions}
                  />
                </div>
              </div>

              {/* Numerical Breakdown */}
              <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Detailed Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded dark:bg-green-900/20">
                    <span className="dark:text-green-400">Positive</span>
                    <span className="font-bold dark:text-green-400">
                      {sentimentData.positive.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-100 rounded dark:bg-red-900/20">
                    <span className="dark:text-red-400">Negative</span>
                    <span className="font-bold dark:text-red-400">
                      {sentimentData.negative.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-100 rounded dark:bg-blue-900/20">
                    <span className="dark:text-blue-400">Neutral</span>
                    <span className="font-bold dark:text-blue-400">
                      {sentimentData.neutral.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Polar Area Chart */}
             <div className="p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800 text-center">
  <h3 className="text-xl font-semibold mb-4 dark:text-white">Overall Sentiment</h3>
  <div className="text-7xl">
    {getOverallSentimentEmoji(sentimentData)}
  </div>
  <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">
    {(() => {
      if (!sentimentData) return "Loading...";
      const { positive, negative, neutral } = sentimentData;
      const max = Math.max(positive, negative, neutral);
      if (max === positive) return "Mostly Positive";
      if (max === negative) return "Mostly Negative";
      if (max === neutral) return "Mostly Neutral";
      return "No Data";
    })()}
  </p>
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
                <span>MarketDash</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}