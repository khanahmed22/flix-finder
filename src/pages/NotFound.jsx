"use client"

import { useNavigate } from "react-router"
import { Home, Film } from "lucide-react"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Film className="w-12 h-12 text-yellow-400" />
          </div>
          <h1 className="text-6xl font-bold text-yellow-400 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            Sorry, the page you're looking for doesn't exist. It might have been moved, deleted, or you entered the
            wrong URL.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition-colors justify-center"
          >
            <Home className="w-5 h-5" />
            Go Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 w-full bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors justify-center"
          >
            Go Back
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm mb-4">Looking for something specific?</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/movies")}
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
            >
              Browse Movies
            </button>
            <button
              onClick={() => navigate("/tv-shows")}
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
            >
              Browse TV Shows
            </button>
            <button
              onClick={() => navigate("/trending")}
              className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
            >
              See Trending
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
