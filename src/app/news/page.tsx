"use client"

import { Bookmark, Clock, Share2, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

interface NewsItem {
  id: number
  title: string
  source: string
  time: string
  category: string
  sentiment: 'positive' | 'neutral' | 'negative'
  trending: boolean
}

export default function PersonalizedNewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Using your actual endpoint
        const response = await fetch('https://metafin.onrender.com/chatbot/news/')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        // Transform API data to match our NewsItem interface
        const transformedNews = data.slice(0, 4).map((article: any, index: number) => ({
          id: index + 1,
          title: article.title || "No title available",
          source: article.source || "Unknown source",
          time: `${Math.floor(Math.random() * 8) + 1}h ago`, // Mock time since API might not provide this
          category: article.category || 'Business', // Default category
          sentiment: Math.random() > 0.7 ? 'positive' : 'neutral', // Mock sentiment
          trending: Math.random() > 0.5 // Random trending flag
        }))

        setNews(transformedNews)
      } catch (err) {
        setError('Failed to fetch news. Please try again later.')
        console.error('Error fetching news:', err)
        
        // Fallback to properly typed sample data
        const sampleNews: NewsItem[] = [
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
          }
        ]
        setNews(sampleNews)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden p-6">
        <p>Loading news...</p>
      </div>
    )
  }

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
            <div className="flex flex-col">
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

      {/* Error message if exists */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}