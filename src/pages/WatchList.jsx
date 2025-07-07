"use client"

import { supabase } from "../db/supabase"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "../context/AuthProvider"
import { useNavigate } from "react-router"
import { Eye, Trash2, Search, Film } from "lucide-react"

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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Film className="w-8 h-8 text-yellow-400" />
            <h2 className="text-4xl font-bold">My WatchList</h2>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 max-md:grid-cols-1 max-md:gap-y-3 place-items-center p-3 gap-x-2 gap-y-4">
          {!isPending && filteredList?.length > 0 ? (
            filteredList.map((m, index) => (
              <div key={index} className="bg-gray-800 rounded-xl w-96 shadow-xl flex flex-col items-center gap-y-3 p-6">
                <img
                  src={m?.poster === "N/A" ? "https://placehold.co/400x400" : m?.poster}
                  alt="movie image"
                  className="w-[200px] object-cover rounded-lg"
                />
                <p className="font-semibold text-white">{m.title}</p>
                <div className="flex gap-x-3">
                  <span>
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      onClick={() => navigate(`/movie/${m.imdbID}`)}
                    >
                      <Eye size={18} /> View
                    </button>
                  </span>
                  <button
                    onClick={() => mutate({ ImDBID: m.imdbID })}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-xl">No Results</div>
          )}
        </div>
      </div>
    </div>
  )
}
