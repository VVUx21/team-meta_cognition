"use client"
import { BarChart, PieChart, TrendingUp, Wallet } from 'lucide-react'
import { ArrowUp, ArrowDown } from 'lucide-react'

const watchlistItems = [
  {
    type: 'stock',
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    price: 2456.75,
    change: +1.25,
    volume: '2.5M',
    sector: 'Energy'
  },
  {
    type: 'mf',
    symbol: 'BCGF',
    name: 'BlueChip Growth Fund',
    nav: 150.45,
    change: +0.85,
    category: 'Large Cap',
    risk: 'Medium'
  },
  {
    type: 'stock',
    symbol: 'TCS',
    name: 'Tata Consultancy',
    price: 3456.90,
    change: -0.65,
    volume: '1.8M',
    sector: 'IT'
  },
  {
    type: 'mf',
    symbol: 'IAF',
    name: 'Index Advantage Fund',
    nav: 245.60,
    change: +0.45,
    category: 'Index Fund',
    risk: 'Low'
  }
]

export default function PortfolioWatchlist() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BarChart className="w-6 h-6 text-green-600" />
            My Watchlist
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your favorite stocks and mutual funds
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Symbol/Name</th>
                <th className="px-6 py-4 text-left">Price/NAV</th>
                <th className="px-6 py-4 text-left">Change</th>
                <th className="px-6 py-4 text-left">Details</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {watchlistItems.map((item, index) => (
                <tr key={index} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className={`w-fit px-2 py-1 rounded-full text-sm ${
                      item.type === 'stock' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                    }`}>
                      {item.type === 'stock' ? 'Stock' : 'Mutual Fund'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{item.symbol}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    ₹{item.type === 'stock' ? (item.price?.toLocaleString() || 'N/A') : (item.nav?.toFixed(2) ?? 'N/A')}
                  </td>
                  <td className={`px-6 py-4 ${
                    item.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <div className="flex items-center">
                      {item.change >= 0 ? '+' : ''}{item.change}%
                      {item.change >= 0 ? (
                        <ArrowUp className="ml-2 h-4 w-4" />
                      ) : (
                        <ArrowUp className="ml-2 h-4 w-4 transform rotate-180" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.type === 'stock' ? (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Sector: {item.sector}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {item.category} · {item.risk} Risk
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                      {item.type === 'stock' ? 'Trade' : 'Invest'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}