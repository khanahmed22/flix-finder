import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { Play, Star, Tv } from 'lucide-react'
import { useNavigate } from "react-router"

const API_KEY = import.meta.env.VITE_TMD_API

const attachImdbIds = async (shows) => {
  const enriched = await Promise.all(
    shows.map(async (show) => {
      try {
        const url = `https://api.themoviedb.org/3/tv/${show.id}/external_ids?api_key=${API_KEY}`
        const res = await axios.get(url)
        return { ...show, imdb_id: res.data.imdb_id }
      } catch {
        return { ...show, imdb_id: null }
      }
    })
  )
  return enriched
}

export default function TVShows() {

  const navigate = useNavigate()

  const fetchPopularTvShows = async () => {
    const res = await axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`)
    return attachImdbIds(res.data.results)
  }

  const fetchTopRatedTvShows = async () => {
    const res = await axios.get(`https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`)
    return attachImdbIds(res.data.results)
  }

  const fetchOnAirTvShows = async () => {
    const res = await axios.get(`https://api.themoviedb.org/3/tv/on_the_air?api_key=${API_KEY}`)
    return attachImdbIds(res.data.results)
  }

  const fetchAiringTodayTvShows = async () => {
    const res = await axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${API_KEY}`)
    return attachImdbIds(res.data.results)
  }

  const { data: popularTvShows,isLoading } = useQuery({
    queryKey: ["popularTvShows"],
    queryFn: fetchPopularTvShows,
  })

  const { data: topRatedTvShows } = useQuery({
    queryKey: ["topRatedTvShows"],
    queryFn: fetchTopRatedTvShows,
  })

  const { data: onAirTvShows } = useQuery({
    queryKey: ["onAirTvShows"],
    queryFn: fetchOnAirTvShows,
  })

  const { data: airingTodayTvShows } = useQuery({
    queryKey: ["airingTodayTvShows"],
    queryFn: fetchAiringTodayTvShows,
  })

  const featuredShow = popularTvShows?.[0]

  const handleNavigate = (imdb_id) => {
    if (imdb_id) navigate(`/movie/${imdb_id}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        <span className="ml-4 text-lg text-gray-300">
          Loading please wait...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {featuredShow && (
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredShow.backdrop_path})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          </div>

          <div className="relative z-10 h-full flex items-center px-6">
            <div className="max-w-7xl mx-auto w-full">
              <div className="max-w-2xl">
                <h2 className="text-4xl md:text-6xl max-md:text-2xl font-bold mb-4">{featuredShow.name}</h2>
                <p className="text-lg max-md:text-sm text-gray-300 mb-6 line-clamp-3">{featuredShow.overview}</p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{featuredShow.vote_average.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-300">{new Date(featuredShow.first_air_date).getFullYear()}</span>
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                    onClick={() => handleNavigate(featuredShow.imdb_id)}
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
            <Tv className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl max-md:text-2xl font-bold">TV Shows</h1>
          </div>
        </div>

        {[
          { title: "Popular TV Shows", shows: popularTvShows },
          { title: "Top Rated TV Shows", shows: topRatedTvShows },
          { title: "On Air", shows: onAirTvShows },
          { title: "Airing Today", shows: airingTodayTvShows },
        ].map((section, idx) => (
          <section key={idx}>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl max-md:text-xl font-bold">{section.title}</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {section.shows?.slice(0, 12).map((show, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                  onClick={() => handleNavigate(show.imdb_id)}
                >
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                      alt={show.name}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="absolute top-2 right-2 bg-black/70 text-yellow-400 px-2 py-1 rounded text-sm font-semibold">
                      {show.vote_average.toFixed(1)}
                    </div>
                  </div>
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
                    {show.name}
                  </h4>
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(show.first_air_date).getFullYear()}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
