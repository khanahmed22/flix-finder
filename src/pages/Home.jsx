import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { Play, Star, TrendingUp, Film } from "lucide-react"
import { useNavigate } from "react-router"

export default function Home() {

  const navigate = useNavigate()

  const TMD_API_KEY = import.meta.env.VITE_TMD_API


  const addImdbIds = async (movies) => {
    return await Promise.all(
      movies.map(async (movie) => {
        try {
          const detailRes = await axios.get(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMD_API_KEY}`
          )
          return {
            ...movie,
            imdb_id: detailRes.data.imdb_id,
          }
        } catch (err) {
          console.error(`Failed to fetch details for movie ID ${movie.id}`)
          console.log(err)
          return {
            ...movie,
            imdb_id: null,
          }
        }
      })
    )
  }

  const fetchTrending = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMD_API_KEY}`
    )
    return await addImdbIds(res.data.results)
  }

  const fetchPopular = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMD_API_KEY}`
    )
    return await addImdbIds(res.data.results)
  }

  const fetchTopRated = async () => {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMD_API_KEY}`
    )
    return await addImdbIds(res.data.results)
  }

  const { data: trendingData,isLoading   } = useQuery({
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
                  <button
                    onClick={() => navigate(`/movie/${featuredMovie.imdb_id}`)}
                    className="flex items-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
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
        {/* Trending */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold">Trending Now</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {trendingData?.slice(0, 12).map((movie) => (
              <div key={movie.id} className="group cursor-pointer" onClick={() => navigate(`/movie/${movie.imdb_id}`)}>
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

        {/* Popular */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Film className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold">Popular Movies</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularData?.slice(0, 12).map((movie) => (
              <div key={movie.id} className="group cursor-pointer" onClick={() => navigate(`/movie/${movie.imdb_id}`)}>
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

        {/* Top Rated */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-yellow-400" />
            <h3 className="text-2xl font-bold">Top Rated</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {topRatedData?.slice(0, 12).map((movie) => (
              <div key={movie.id} className="group cursor-pointer" onClick={() => navigate(`/movie/${movie.imdb_id}`)}>
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
      </div>
    </div>
  )
}
