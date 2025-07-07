import { useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { supabase } from "../db/supabase";
import { toast } from "sonner";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import { Star, Award, DollarSign,Plus } from "lucide-react"

export default function MovieView() {
  const { imdbID } = useParams();
  const { session } = useAuth();
  const user_id = session?.user?.id;
  const navigate = useNavigate()

  const fetchSingleMovie = async () => {
    const API = `http://www.omdbapi.com/?i=${imdbID}&apikey=${import.meta.env.VITE_OMPBAPI_API_KEY}`;
    const res = await axios.get(API);
    return res.data || {};
  };

  const { data: singleMovie, isPending } = useQuery({
    queryKey: ["singleMovie", imdbID],
    queryFn: fetchSingleMovie,
  });

  const addMovie = async ({ Title, Poster, imdbID }) => {
    try {
      const { data, error } = await supabase.from("movie").insert([
        {
          title: Title,
          poster: Poster,
          imdbID,
          user_id,
        },
      ]);

      if (error) {
        if (error.code === "23505") {
          // duplicate key
          return { success: false, duplicate: true };
        }
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (err) {
      console.error("Insert failed:", err.message);
      throw err; // goes to onError
    }
  };

  const { mutate } = useMutation({
    mutationFn: addMovie,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("✅ Movie added to WatchList");
      } else if (res.duplicate) {
        toast.info("ℹ️ Movie already exists in WatchList");
        setWatchStatus(false)
      }
    },
    onError: () => {
      toast.error("❌ Failed to add movie");
    },
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto p-6">
        {isPending ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            <span className="ml-4 text-lg text-gray-300">Loading...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <div className="relative group">
                  <img
                    src={singleMovie?.Poster !== "N/A" ? singleMovie?.Poster : "https://placehold.co/300x450"}
                    alt={singleMovie?.Title}
                    className="w-80 h-auto rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg"></div>
                </div>
              </div>

              {/* Movie Info */}
              <div className="flex-1 space-y-6">
                {/* Title and Year */}
                <div>
                  <h1 className="text-3xl lg:text-4xl max-md:text-2xl font-bold text-white mb-5">{singleMovie?.Title}</h1>
                  <div className="flex items-center gap-4 text-gray-300">
                    <span className="text-lg">{singleMovie?.Year}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span className="border border-gray-500 px-2 py-1 text-sm">{singleMovie?.Rated}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                    <span>{singleMovie?.Runtime}</span>
                  </div>
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {singleMovie?.Genre?.split(", ").map((genre, index) => (
                    <span key={index} className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors">
                      {genre}
                      {index < singleMovie.Genre.split(", ").length - 1 && ","}
                    </span>
                  ))}
                </div>

                {/* Rating Section */}
                <div className="flex items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 text-black px-2 py-1 rounded font-bold text-sm">IMDb RATING</div>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                      <span className="text-2xl font-bold">{singleMovie?.imdbRating}</span>
                      <span className="text-gray-400">/10</span>
                    </div>
                  </div>

                  {singleMovie?.Metascore && singleMovie?.Metascore !== "N/A" && (
                    <div className="flex items-center gap-3">
                      <div className="bg-green-600 text-white px-2 py-1 rounded font-bold text-sm">METASCORE</div>
                      <span className="text-2xl font-bold text-green-400">{singleMovie?.Metascore}</span>
                    </div>
                  )}
                </div>

                {/* Plot */}
                <div>
                  <p className="text-gray-300 text-lg leading-relaxed max-w-4xl">{singleMovie?.Plot}</p>
                </div>

                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Director:</span>
                    <span className="ml-2 text-blue-400 hover:text-blue-300 cursor-pointer">
                      {singleMovie?.Director}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Writers:</span>
                    <span className="ml-2 text-blue-400 hover:text-blue-300 cursor-pointer">{singleMovie?.Writer}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-400">Stars:</span>
                    <span className="ml-2 text-blue-400 hover:text-blue-300 cursor-pointer">{singleMovie?.Actors}</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <button
                    onClick={() =>
                      session
                        ? mutate({
                            Title: singleMovie?.Title,
                            Poster: singleMovie?.Poster,
                            imdbID: singleMovie?.imdbID,
                          })
                        : navigate("/sign-in")
                    }
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    {session ? "Add to Watchlist" : "Sign in to add"}
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Information Sections */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cast & Crew Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Technical Specs */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Technical Specs</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Runtime</span>
                      <span className="text-white">{singleMovie?.Runtime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Language</span>
                      <span className="text-white">{singleMovie?.Language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Country</span>
                      <span className="text-white">{singleMovie?.Country || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type</span>
                      <span className="text-white capitalize">{singleMovie?.Type}</span>
                    </div>
                  </div>
                </div>

                {/* Awards */}
                {singleMovie?.Awards && singleMovie?.Awards !== "N/A" && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Awards & Recognition
                    </h3>
                    <p className="text-gray-300">{singleMovie?.Awards}</p>
                  </div>
                )}

                {/* Box Office */}
                {singleMovie?.BoxOffice && singleMovie?.BoxOffice !== "N/A" && (
                  <div className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Box Office
                    </h3>
                    <div className="text-2xl font-bold text-green-400">{singleMovie?.BoxOffice}</div>
                  </div>
                )}
              </div>

              {/* Ratings Sidebar */}
              <div className="space-y-6">
                {/* All Ratings */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Ratings</h3>
                  <div className="space-y-4">
                    {/* IMDb Rating */}
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow-400 text-black rounded flex items-center justify-center font-bold text-xs">
                          IMDb
                        </div>
                        <span className="text-white">IMDb Rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-bold text-white">{singleMovie?.imdbRating}</span>
                      </div>
                    </div>

                    {/* Metacritic */}
                    {singleMovie?.Metascore && singleMovie?.Metascore !== "N/A" && (
                      <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-600 text-white rounded flex items-center justify-center font-bold text-xs">
                            M
                          </div>
                          <span className="text-white">Metacritic</span>
                        </div>
                        <span className="font-bold text-green-400">{singleMovie?.Metascore}</span>
                      </div>
                    )}

                    {/* Rotten Tomatoes */}
                    {singleMovie?.Ratings?.find((rating) => rating.Source === "Rotten Tomatoes") && (
                      <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-600 text-white rounded flex items-center justify-center font-bold text-xs">
                            RT
                          </div>
                          <span className="text-white">Rotten Tomatoes</span>
                        </div>
                        <span className="font-bold text-red-400">
                          {singleMovie?.Ratings?.find((rating) => rating.Source === "Rotten Tomatoes")?.Value}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Facts */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-yellow-400 mb-4">Quick Facts</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400 block">Release Year</span>
                      <span className="text-white font-medium">{singleMovie?.Year}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Age Rating</span>
                      <span className="text-white font-medium">{singleMovie?.Rated}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Duration</span>
                      <span className="text-white font-medium">{singleMovie?.Runtime}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Language</span>
                      <span className="text-white font-medium">{singleMovie?.Language}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
