"use client"

import { Bookmark, Clock, Share2, TrendingUp } from 'lucide-react'

export default function PersonalizedNewsSection() {
  // Hardcoded personalized news data
  const news = [
    {
      id: 1,
      title: "Tech stocks rally as AI investments surge",
      source: "Tech Financials",
      time: "2h ago",
      category: "Technology",
      sentiment: "positive",
      trending: true
    },
    {
      id: 2,
      title: "Fed signals potential rate cuts in Q3 2024",
      source: "Market Watch",
      time: "4h ago",
      category: "Economy",
      sentiment: "neutral",
      trending: false
    },
    {
      id: 3,
      title: "Renewable energy sector shows 15% growth YoY",
      source: "Green Investments",
      time: "6h ago",
      category: "Energy",
      sentiment: "positive",
      trending: true
    },
    {
      id: 4,
      title: "Global markets react to new trade policies",
      source: "World Finance",
      time: "8h ago",
      category: "Markets",
      sentiment: "neutral",
      trending: false
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Your Market Digest
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Curated financial news based on your portfolio
            </p>
          </div>
          <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            Edit Preferences
          </button>
        </div>
      </div>

      {/* News List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {news.map(item => (
          <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
            <div className="flex gap-4">
              {/* News Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.sentiment === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {item.time}
                  </span>
                  {item.trending && (
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded-full">
                      Trending
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.source}</p>
              </div>
              
              {/* News Image Placeholder */}
              <div className="hidden sm:block w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-500 dark:to-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300">
                  <span className="text-xs">News Image</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center">
        <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          View All Market News →
        </button>
      </div>
    </div>
  )
}