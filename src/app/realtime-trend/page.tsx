'use client';

import React, { useEffect, useRef, useState } from 'react';
import CryptoSignalsDashboard from '../../components/signalsdashboard';

const CryptoTradingDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [category, setCategory] = useState("BINANCE");
  const [selectedSymbol, setSelectedSymbol] = useState("BTCUSDT");
  const [availableSymbols, setAvailableSymbols] = useState<Array<{
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
  }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch available symbols from the API
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const response = await fetch(`${API_URL}/symbols`);
        if (!response.ok) throw new Error('Failed to fetch symbols');
        const data = await response.json();
        setAvailableSymbols(data.symbols || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching symbols:', err);
        setError('Failed to load available cryptocurrencies');
        setLoading(false);
      }
    };
    
    fetchSymbols();
  }, [API_URL]);

  // Initialize TradingView widget
  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "height": "500",
        "autosize": true,
        "symbol": "BINANCE:${selectedSymbol}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "0",
        "locale": "en",
        "allow_symbol_change": true,
        "support_host": "https://www.tradingview.com"
      }`;

    containerRef.current.appendChild(script);
  }, [category, selectedSymbol]);

  // Handle symbol selection change
  const handleSymbolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSymbol(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Crypto Trading Analysis Platform</h1>
        <p className="text-gray-400">Real-time charts and ML-powered trading signals</p>
      </header>

      <main className="container mx-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
            </div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          <>
            {/* Symbol Selection Dropdown */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select Cryptocurrency
              </label>
              <select 
                value={selectedSymbol}
                onChange={handleSymbolChange}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableSymbols.map((symbol) => (
                  <option key={symbol.symbol} value={symbol.symbol}>
                    {symbol.baseAsset}/{symbol.quoteAsset} ({symbol.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* TradingView Widget */}
            <div className="bg-gray-800 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-bold mb-4">Live Chart</h2>
              <div
                className="tradingview-widget-container w-full"
                ref={containerRef}
                style={{ height: "500px" }}
              >
                <div
                  className="tradingview-widget-container__widget"
                  style={{ height: "100%", width: "100%" }}
                ></div>
              </div>
            </div>

            {/* Signals Dashboard Component */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Trading Signals</h2>
              <CryptoSignalsDashboard selectedSymbol={selectedSymbol} availableSymbols={availableSymbols} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CryptoTradingDashboard;