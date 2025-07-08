"use client"

import { useAuth } from "../context/AuthProvider"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { Play, Plus, Star, TrendingUp, Film, Tv } from "lucide-react"
import { useNavigate } from "react-router"

export default function Trending() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const TMD_API_KEY = import.meta.env.VITE_TMD_API

  const addImdbIds = async (items) => {
    return await Promise.all(
      items.map(async (item) => {
        try {
          if (item.media_type !== "movie" && item.media_type !== "tv") return { ...item, imdb_id: null }

          const url = `https://api.themoviedb.org/3/${item.media_type}/${item.id}?api_key=${TMD_API_KEY}`
          const res = await axios.get(url)
          return { ...item, imdb_id: res.data.imdb_id || null }
        } catch (err) {
          console.error(`Error fetching IMDb ID for ${item.id}`, err)
          return { ...item, imdb_id: null }
        }
      })
    )
  }

  const fetchTrendingMovies = async () => {
    const res = await axios.get(`https://api.themoviedb.org/3/trending/movie/day?api_key=${TMD_API_KEY}`)
    return await addImdbIds(res.data.results)
  }

  const fetchTrendingTvShows = async () => {
    const res = await axios.get(`https://api.themoviedb.org/3/trending/tv/day?api_key=${TMD_API_KEY}`)
    return await addImdbIds(res.data.results)
  }

  const fetchTrendingAll = async () => {
    const res = await axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${TMD_API_KEY}`)
    return await addImdbIds(res.data.results)
  }

  const { data: trendingMovies } = useQuery({
    queryKey: ["trendingMovies"],
    queryFn: fetchTrendingMovies,
  })

  const { data: trendingTvShows } = useQuery({
    queryKey: ["trendingTvShows"],
    queryFn: fetchTrendingTvShows,
  })

  const { data: trendingAll } = useQuery({
    queryKey: ["trendingAll"],
    queryFn: fetchTrendingAll,
  })

  const featuredItem = trendingAll?.[0]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {featuredItem && (
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredItem.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>

          <div className="relative z-10 h-full flex items-center px-6">
            <div className="max-w-7xl mx-auto w-full">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl font-bold mb-4">{featuredItem.title || featuredItem.name}</h2>
                <p className="text-lg text-gray-300 mb-6 line-clamp-3">{featuredItem.overview}</p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{featuredItem.vote_average.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">
                    {new Date(featuredItem.release_date || featuredItem.first_air_date).getFullYear()}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-yellow-400 capitalize">{featuredItem.media_type}</span>
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                    onClick={() => navigate(`/movie/${featuredItem.imdb_id}`)}
                  >
                    <Play className="w-5 h-5" />
                    Watch Now
                  </button>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold">Trending</h1>
          </div>
        </div>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold">Trending Today</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingAll?.slice(0, 12).map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => navigate(`/movie/${item.imdb_id}`)}
              >
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-semibold uppercase">
                    {item.media_type}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded text-sm font-semibold">
                    {item.vote_average.toFixed(1)}
                  </div>
                </div>
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
                  {item.title || item.name}
                </h4>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(item.release_date || item.first_air_date).getFullYear()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold">Trending Movies</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingMovies?.slice(0, 12).map((movie, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => navigate(`/movie/${movie.imdb_id}`)}
              >
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
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
            <Tv className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold">Trending TV Shows</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingTvShows?.slice(0, 12).map((show, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => navigate(`/movie/${show.imdb_id}`)}
              >
                <div className="relative overflow-hidden rounded-lg mb-3">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded text-sm font-semibold">
                    {show.vote_average.toFixed(1)}
                  </div>
                </div>
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
                  {show.name}
                </h4>
                <p className="text-gray-400 text-xs mt-1">{new Date(show.first_air_date).getFullYear()}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
