"use client"

import { supabase } from "../db/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "../context/AuthProvider"
import { useNavigate } from "react-router"
import { Eye, Trash2, Search, Film, Calendar } from "lucide-react"

export default function WatchList() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const { session } = useAuth()
  const user = session?.user
  const user_id = user?.id
  const navigate = useNavigate()

  const fetchWatchList = async () => {
    const { data, error } = await supabase.from("movie").select()
    if (error) {
      console.log(error)
    }
    return data
  }

  const { data: watchList, isPending } = useQuery({
    queryKey: ["watchListKey", user_id],
    queryFn: fetchWatchList,
    enabled: !!user_id,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    keepPreviousData: true,
  })

  const DeleteMovie = async ({ ImDBID }) => {
    const { error, data } = await supabase.from("movie").delete().eq("imdbID", ImDBID).eq("user_id", user_id)
    if (error) {
      console.log(error)
    }
    return data
  }

  const { mutate } = useMutation({
    mutationKey: ["deleteMovieKey"],
    mutationFn: DeleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchListKey"] })
      toast.success("Movie Removed")
    },
  })

  const filteredList = watchList?.filter((watch) => watch.title.toLowerCase().includes(search.toLowerCase()))

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Film className="w-8 h-8 text-yellow-400" />
              <h2 className="text-4xl font-bold">My WatchList</h2>
            </div>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            <span className="ml-4 text-lg text-gray-300">Loading your watchlist...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-8 h-8 text-yellow-400" />
            <h2 className="text-4xl font-bold">My WatchList</h2>
          </div>
          <p className="text-gray-400">
            {watchList?.length > 0 ? `${watchList.length} movies in your watchlist` : "Start building your watchlist"}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your watchlist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        {filteredList?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredList.map((m, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative">
                  <img
                    src={m?.poster === "N/A" ? "https://placehold.co/300x450" : m?.poster}
                    alt="movie image"
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">{m.title}</h3>

                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Added recently</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      onClick={() => navigate(`/movie/${m.imdbID}`)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => mutate({ ImDBID: m.imdbID })}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Film className="w-12 h-12 text-gray-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-400 mb-4">
              {search ? "No movies found" : "Your watchlist is empty"}
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {search
                ? `No movies match "${search}". Try a different search term.`
                : "Start adding movies to your watchlist to keep track of what you want to watch."}
            </p>
            {!search && (
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate("/trending")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse Trending
                </button>
                <button
                  onClick={() => navigate("/movies")}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Browse Movies
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
