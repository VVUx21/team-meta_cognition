'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { Loader, RefreshCw, ArrowUp, ArrowDown, Clock, AlertTriangle } from 'lucide-react';

interface CryptoSignalsDashboardProps {
  selectedSymbol: string;
  availableSymbols: Array<{
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
  }>;
}

interface Signal {
  symbol: string;
  timestamp: string;
  signal: string;
  confidence: number;
  price: number;
  indicators: {
    rsi: number;
    macd: number;
    macd_signal: number;
    bb_position: number;
    sma_20: number;
    sma_50: number;
    price: number;
  };
}

interface SignalHistory {
  signals: Signal[];
}

const getSignalColor = (signal: string) => {
  switch (signal) {
    case 'Buy': return 'bg-green-500';
    case 'Sell': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return 'text-green-500';
  if (confidence >= 0.6) return 'text-blue-500';
  if (confidence >= 0.4) return 'text-yellow-500';
  return 'text-red-500';
};

const CryptoSignalsDashboard: React.FC<CryptoSignalsDashboardProps> = ({ selectedSymbol, availableSymbols }) => {
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [signalHistory, setSignalHistory] = useState<Signal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(60); // seconds
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<{message: string, type: string}[]>([]);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
  };

  const fetchCurrentSignal = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch(`${API_URL}/signal/${selectedSymbol}`);
      if (!response.ok) throw new Error('Failed to fetch signal');
      const data = await response.json();
      if (currentSignal && currentSignal.signal !== data.signal) {
        addNotification(`New ${data.signal} signal for ${selectedSymbol} with ${(data.confidence * 100).toFixed(0)}% confidence`, data.signal.toLowerCase());
      }
      
      setCurrentSignal(data);
      setLastUpdated(new Date());
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching signal:', err);
      setError(`Failed to get signal for ${selectedSymbol}`);
      setLoading(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchSignalHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/history/${selectedSymbol}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      const data: SignalHistory = await response.json();
      setSignalHistory(data.signals || []);
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  const addNotification = (message: string, type: string) => {
    const newNotification = { message, type };
    setNotifications(prev => [...prev, newNotification]);

    setShowNotifications(true);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n !== newNotification));
      if (notifications.length <= 1) {
        setShowNotifications(false);
      }
    }, 5000);
  };

  useEffect(() => {
    if (selectedSymbol) {
      setLoading(true);
      fetchCurrentSignal();
      fetchSignalHistory();
    }
  }, [selectedSymbol]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedSymbol) fetchCurrentSignal();
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [selectedSymbol, refreshInterval]);

  const prepareChartData = () => {
    if (!signalHistory.length) return [];
    
    return [...signalHistory].reverse().map(signal => ({
      timestamp: new Date(signal.timestamp).toLocaleTimeString(),
      price: signal.price,
      rsi: signal.indicators.rsi,
      macd: signal.indicators.macd,
      signal: signal.signal,
      confidence: signal.confidence * 100
    }));
  };

  const chartData = prepareChartData();

  const handleRefresh = () => {
    fetchCurrentSignal();
    fetchSignalHistory();
  };

  const prepareMacdData = () => {
    if (!signalHistory.length) return [];
    
    return [...signalHistory].reverse().map(signal => ({
      timestamp: new Date(signal.timestamp).toLocaleTimeString(),
      macd: signal.indicators.macd,
      signal_line: signal.indicators.macd_signal,
      histogram: signal.indicators.macd - signal.indicators.macd_signal
    }));
  };
  
  const macdData = prepareMacdData();

  const prepareConfidenceData = () => {
    if (!signalHistory.length) return [];
    
    return [...signalHistory].reverse().map(signal => ({
      timestamp: new Date(signal.timestamp).toLocaleTimeString(),
      confidence: signal.confidence * 100,
      signal: signal.signal
    }));
  };
  
  const confidenceData = prepareConfidenceData();

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin h-8 w-8 text-blue-500" />
          <span className="ml-2">Loading signals...</span>
        </div>
      ) : (
        <>
          {/* Auto-refresh controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 p-4 rounded-lg">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Auto-refresh Interval
              </label>
              <select 
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(Number(e.target.value))}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={30}>30 seconds</option>
                <option value={60}>1 minute</option>
                <option value={300}>5 minutes</option>
                <option value={900}>15 minutes</option>
              </select>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Last Updated</p>
                <p className="text-white">
                  {lastUpdated ? formatDate(lastUpdated.toISOString()) : 'Never'}
                </p>
              </div>
              <button 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isRefreshing ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <RefreshCw size={20} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-100 px-4 py-3 rounded mb-6 flex items-center">
              <AlertTriangle size={20} className="mr-2" />
              {error}
            </div>
          )}

          {/* Notifications */}
          {showNotifications && notifications.length > 0 && (
            <div className="fixed top-4 right-4 w-72 z-50">
              {notifications.map((notification, index) => (
                <div 
                  key={index}
                  className={`mb-2 p-3 rounded shadow-lg animate-fade-in 
                  ${notification.type === 'buy' ? 'bg-green-800 border-l-4 border-green-500' :
                    notification.type === 'sell' ? 'bg-red-800 border-l-4 border-red-500' :
                    'bg-gray-800 border-l-4 border-gray-500'}`}
                >
                  <div className="flex justify-between items-center">
                    <p>{notification.message}</p>
                    <button 
                      onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}
                      className="text-gray-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Current Signal */}
          {currentSignal && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-lg col-span-1">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  Current Signal
                  <Clock size={16} className="ml-2 text-gray-400" />
                </h2>
                
                <div className="flex flex-col items-center">
                  <div className={`text-2xl font-bold mb-4 px-6 py-3 rounded-full ${getSignalColor(currentSignal.signal)}`}>
                    {currentSignal.signal === 'Buy' && <ArrowUp className="inline mr-2" />}
                    {currentSignal.signal === 'Sell' && <ArrowDown className="inline mr-2" />}
                    {currentSignal.signal}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-400 mb-1">Confidence</p>
                    <p className={`text-2xl font-bold ${getConfidenceColor(currentSignal.confidence)}`}>
                      {(currentSignal.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  
                  <div className="mt-4 w-full">
                    <p className="text-gray-400 mb-1">Current Price</p>
                    <p className="text-xl font-bold">${currentSignal.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg col-span-3">
                <h2 className="text-xl font-bold mb-4">Technical Indicators</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400">RSI (14)</p>
                    <p className={`text-xl font-bold ${
                      currentSignal.indicators.rsi > 70 ? 'text-red-500' : 
                      currentSignal.indicators.rsi < 30 ? 'text-green-500' : 'text-white'
                    }`}>
                      {currentSignal.indicators.rsi.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">MACD</p>
                    <p className={`text-xl font-bold ${
                      currentSignal.indicators.macd > currentSignal.indicators.macd_signal ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {currentSignal.indicators.macd.toFixed(4)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">MACD Signal</p>
                    <p className="text-xl font-bold">
                      {currentSignal.indicators.macd_signal.toFixed(4)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">BB Position</p>
                    <p className={`text-xl font-bold ${
                      currentSignal.indicators.bb_position > 1 ? 'text-red-500' : 
                      currentSignal.indicators.bb_position < 0 ? 'text-green-500' : 'text-white'
                    }`}>
                      {currentSignal.indicators.bb_position.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">SMA 20</p>
                    <p className="text-xl font-bold">
                      {currentSignal.indicators.sma_20.toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-400">SMA 50</p>
                    <p className="text-xl font-bold">
                      {currentSignal.indicators.sma_50.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Charts */}
          {chartData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Price History</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="timestamp" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                        labelStyle={{ color: '#ddd' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#3b82f6" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">RSI History</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="timestamp" stroke="#888" />
                      <YAxis stroke="#888" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                        labelStyle={{ color: '#ddd' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rsi" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                      />
                      {/* Reference lines for overbought/oversold */}
                      <CartesianGrid y={30} stroke="#22c55e" strokeDasharray="3 3" horizontal={false} />
                      <CartesianGrid y={70} stroke="#ef4444" strokeDasharray="3 3" horizontal={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Additional Charts */}
          {macdData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">MACD History</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={macdData}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="timestamp" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                        labelStyle={{ color: '#ddd' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="macd" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="MACD"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="signal_line" 
                        stroke="#ef4444" 
                        strokeWidth={2}
                        name="Signal Line"
                      />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Signal Confidence</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={confidenceData}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="timestamp" stroke="#888" />
                      <YAxis stroke="#888" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#333', borderColor: '#555' }}
                        labelStyle={{ color: '#ddd' }}
                      />
                      <Bar 
                        dataKey="confidence" 
                        name="Confidence %"
                        fill={
                          currentSignal && currentSignal.signal === 'Buy' ? '#3b82f6' : 
                          currentSignal && currentSignal.signal === 'Sell' ? '#ef4444' : '#888'
                        }
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* Signal History */}
          {signalHistory.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-bold mb-4">Signal History</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Timestamp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Signal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        RSI
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        MACD
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {signalHistory.slice(0, 10).map((signal, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(signal.timestamp)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            signal.signal === 'Buy' ? 'bg-green-900 text-green-200' :
                            signal.signal === 'Sell' ? 'bg-red-900 text-red-200' :
                            'bg-gray-700 text-gray-300'
                          }`}>
                            {signal.signal}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-700 rounded-full h-2.5 mr-2">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  signal.confidence >= 0.8 ? 'bg-green-500' :
                                  signal.confidence >= 0.6 ? 'bg-blue-500' :
                                  signal.confidence >= 0.4 ? 'bg-yellow-500' :
                                  'bg-red-500'
                                }`}
                                style={{ width: `${signal.confidence * 100}%` }}
                              ></div>
                            </div>
                            <span>{(signal.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${signal.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={
                            signal.indicators.rsi > 70 ? 'text-red-500' :
                            signal.indicators.rsi < 30 ? 'text-green-500' :
                            'text-white'
                          }>
                            {signal.indicators.rsi.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={
                            signal.indicators.macd > signal.indicators.macd_signal ? 'text-green-500' : 'text-red-500'
                          }>
                            {signal.indicators.macd.toFixed(4)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CryptoSignalsDashboard;