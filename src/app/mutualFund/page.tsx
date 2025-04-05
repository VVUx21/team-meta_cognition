"use client"
import { useState } from "react"
import { ArrowUpDown, BadgeDollarSign, BarChart, Calculator, GitCompareArrows, Star } from 'lucide-react'

// Mutual Fund Data
const mutualFunds = [
  { id: 1, name: 'BlueChip Growth Fund', category: 'Large Cap', rating: 4.8, returns: '18.2%', risk: 'Medium', minSip: 500 },
  { id: 2, name: 'Emerging Stars Fund', category: 'Mid Cap', rating: 4.5, returns: '22.1%', risk: 'High', minSip: 1000 },
  { id: 3, name: 'Small Wonders Fund', category: 'Small Cap', rating: 4.2, returns: '25.6%', risk: 'Very High', minSip: 2000 },
  { id: 4, name: 'Stable Income Fund', category: 'Debt', rating: 4.6, returns: '9.5%', risk: 'Low', minSip: 500 },
  { id: 5, name: 'Balanced Advantage Fund', category: 'Hybrid', rating: 4.7, returns: '12.8%', risk: 'Medium', minSip: 1000 },
]

export default function MutualFunds() {
  const [sipAmount, setSipAmount] = useState(5000)
  const [duration, setDuration] = useState(5)
  const [sortedBy, setSortedBy] = useState('rating')
  const [selectedFunds, setSelectedFunds] = useState([])

  const calculateSip = () => {
    const monthlyRate = 0.1 / 12 // Assuming 10% annual return
    const months = duration * 12
    return sipAmount * parseFloat(((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate).toFixed(2))
  }

  return (
    <div className="space-y-8 p-6">
      {/* Popular Funds & Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Popular Funds */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <Star className="mr-2 h-5 w-5 text-yellow-500" /> 
            Top Rated Funds
          </h2>
          <div className="space-y-4">
            {mutualFunds.slice(0,3).map(fund => (
              <div key={fund.id} className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div>
                  <div className="font-medium">{fund.name}</div>
                  <div className="text-sm text-gray-500">{fund.category}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {fund.returns}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fund Categories */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <BarChart className="mr-2 h-5 w-5 text-blue-500" />
            Market Caps
          </h2>
          <div className="space-y-4">
            {['Large Cap', 'Mid Cap', 'Small Cap'].map(category => (
              <div key={category} className="rounded-lg border p-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category}</span>
                  <button className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400">
                    View Funds
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {category === 'Large Cap' && 'Stable returns, lower risk'}
                  {category === 'Mid Cap' && 'Growth potential, moderate risk'}
                  {category === 'Small Cap' && 'High growth, high risk'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SIP Calculator */}
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 flex items-center text-xl font-semibold">
            <Calculator className="mr-2 h-5 w-5 text-purple-500" />
            SIP Calculator
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm">Monthly Investment (₹)</label>
              <input
                type="number"
                value={sipAmount}
                onChange={(e) => setSipAmount(Number(e.target.value))}
                className="w-full rounded-lg border p-2 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Duration (years)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full rounded-lg border p-2 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="text-sm text-blue-800 dark:text-blue-400">
                Estimated Value: ₹{calculateSip().toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-blue-600 dark:text-blue-300">
                Assuming 10% annual returns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compare Funds */}
      <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold">
            <GitCompareArrows className="mr-2 h-5 w-5 text-green-500" />
            Compare Funds
          </h2>
          <button className="flex items-center rounded-full bg-green-100 px-4 py-2 text-sm text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400">
            Add Funds to Compare
          </button>
        </div>
      </div>

      {/* All Funds Table */}
      <div className="rounded-lg border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-xl font-semibold">All Mutual Funds</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSortedBy('rating')}
              className={`flex items-center rounded-full px-3 py-1 text-sm ${
                sortedBy === 'rating' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
              }`}
            >
              <ArrowUpDown className="mr-1 h-4 w-4" /> Rating
            </button>
            <button
              onClick={() => setSortedBy('category')}
              className={`flex items-center rounded-full px-3 py-1 text-sm ${
                sortedBy === 'category' ? 'bg-blue-100 text-blue-800' : 'text-gray-600'
              }`}
            >
              <ArrowUpDown className="mr-1 h-4 w-4" /> Category
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-t bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-sm">Fund Name</th>
                <th className="px-6 py-3 text-left text-sm">Category</th>
                <th className="px-6 py-3 text-left text-sm">Rating</th>
                <th className="px-6 py-3 text-left text-sm">Returns</th>
                <th className="px-6 py-3 text-left text-sm">Risk</th>
                <th className="px-6 py-3 text-left text-sm">Min SIP</th>
              </tr>
            </thead>
            <tbody>
              {[...mutualFunds]
                .sort((a, b) => sortedBy === 'rating' ? b.rating - a.rating : a.category.localeCompare(b.category))
                .map(fund => (
                  <tr key={fund.id} className="border-t hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">{fund.name}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-sm text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                        {fund.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                        {fund.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-green-600 dark:text-green-400">{fund.returns}</td>
                    <td className="px-6 py-4">
                      <RiskIndicator risk={fund.risk as 'Low' | 'Medium' | 'High' | 'Very High'} />
                    </td>
                    <td className="px-6 py-4">₹{fund.minSip}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const RiskIndicator = ({ risk }: { risk: 'Low' | 'Medium' | 'High' | 'Very High' }) => {
  const levels = {
    'Low': { color: 'bg-green-500', width: 'w-1/4' },
    'Medium': { color: 'bg-yellow-500', width: 'w-2/4' },
    'High': { color: 'bg-orange-500', width: 'w-3/4' },
    'Very High': { color: 'bg-red-500', width: 'w-full' }
  }

  return (
    <div className="flex items-center">
      <div className="mr-2 h-2 w-16 rounded-full bg-gray-200">
        <div className={`h-full rounded-full ${levels[risk].color} ${levels[risk].width}`}></div>
      </div>
      <span className="text-sm">{risk}</span>
    </div>
  )
}