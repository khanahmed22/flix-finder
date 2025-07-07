"use client"

import { useAuth } from "../context/AuthProvider"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { Search, Play, Plus, Star, TrendingUp, Film, Tv } from "lucide-react"
import { useNavigate } from "react-router"

export default function Home() {
  const { session } = useAuth()
  const navigate = useNavigate()

  

  

  const fetchTrending = async () => {
    try {
      const TMDAPI = `https://api.themoviedb.org/3/trending/movie/day?api_key=${import.meta.env.VITE_TMD_API}`
      const res = await axios.get(TMDAPI)
      return res.data.results
    } catch (error) {
      console.log(error)
    }
  }

  const fetchPopular = async () => {
    try {
      const TMDAPI = `https://api.themoviedb.org/3/movie/popular?api_key=${import.meta.env.VITE_TMD_API}`
      const res = await axios.get(TMDAPI)
      return res.data.results
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTopRated = async () => {
    try {
      const TMDAPI = `https://api.themoviedb.org/3/movie/top_rated?api_key=${import.meta.env.VITE_TMD_API}`
      const res = await axios.get(TMDAPI)
      return res.data.results
    } catch (error) {
      console.log(error)
    }
  }

  const { data: trendingData } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
  })

  const { data: popularData } = useQuery({
    queryKey: ["popular"],
    queryFn: fetchPopular,
  })

  const { data: topRatedData } = useQuery({
    queryKey: ["topRated"],
    queryFn: fetchTopRated,
  })

  const featuredMovie = trendingData?.[0]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-yellow-400">MovieWatch</h1>
            <div className="hidden md:flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Film className="w-4 h-4" />
                Movies
              </button>
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <Tv className="w-4 h-4" />
                TV Shows
              </button>
              <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search movies, TV shows..."
                className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="text-sm text-gray-300">
              {session?.user?.email ? `Welcome, ${session.user.email}` : "Sign in"}
            </div>
          </div>
        </div>
      </nav>

      {featuredMovie && (
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>

          <div className="relative z-10 h-full flex items-center px-6">
            <div className="max-w-7xl mx-auto w-full">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">{featuredMovie.title}</h2>
                <p className="text-lg text-gray-300 mb-6 line-clamp-3">{featuredMovie.overview}</p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{featuredMovie.vote_average.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{new Date(featuredMovie.release_date).getFullYear()}</span>
                </div>

                <div className="flex gap-4">
                  <button onClick={()=> navigate(`/movie/${featuredMovie?.id}`) } className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                    <Play className="w-5 h-5" />
                    Watch Now
                  </button>
                  <button className="flex items-center gap-2 bg-gray-800/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                    <Plus className="w-5 h-5" />
                    Watchlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold">Trending Now</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingData?.slice(0, 12).map((movie, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded text-sm font-semibold">
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
                  {movie.title}
                </h4>
                <p className="text-gray-400 text-xs mt-1">{new Date(movie.release_date).getFullYear()}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold">Popular Movies</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularData?.slice(0, 12).map((movie, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded text-sm font-semibold">
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
                  {movie.title}
                </h4>
                <p className="text-gray-400 text-xs mt-1">{new Date(movie.release_date).getFullYear()}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold">Top Rated</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topRatedData?.slice(0, 12).map((movie, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded text-sm font-semibold">
                    {movie.vote_average.toFixed(1)}
                  </div>
                </div>
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
                  {movie.title}
                </h4>
                <p className="text-gray-400 text-xs mt-1">{new Date(movie.release_date).getFullYear()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-yellow-400 mb-4">MovieWatch</h4>
              <p className="text-gray-400 text-sm">Your ultimate destination for discovering movies and TV shows.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Movies</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Popular
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Top Rated
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Upcoming
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Now Playing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">TV Shows</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Popular
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Top Rated
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    On Air
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Airing Today
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Account</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Watchlist
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Favorites
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Settings
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 MovieWatch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
