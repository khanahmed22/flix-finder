import { useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { supabase } from "../db/supabase";
import { toast } from "sonner";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import { Star,Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import NotFound from "./NotFound";

export default function MovieView() {
  const { imdbID } = useParams();
  const isValid = /^tt\d{7,8}$/.test(imdbID);
  
  const [watchStatus, setWatchStatus] = useState(false);
  const { session } = useAuth();
  const user_id = session?.user?.id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchSingleMovie = async () => {
    const API = `http://www.omdbapi.com/?i=${imdbID}&apikey=${
      import.meta.env.VITE_OMPBAPI_API_KEY
    }`;
    const res = await axios.get(API);
    return res.data || {};
  };

  const { data: singleMovie, isPending } = useQuery({
    queryKey: ["singleMovie", imdbID],
    queryFn: fetchSingleMovie,
  });

  const checkIfExists = async () => {
    const { data, error } = await supabase
      .from("movie")
      .select("id")
      .eq("imdbID", imdbID)
      .eq("user_id", user_id);

    if (error) {
      console.error("Error checking movie:", error);
      return false;
    }

    return data?.length > 0;
  };

  useEffect(() => {
    if (imdbID && user_id) {
      checkIfExists().then((exists) => setWatchStatus(exists));
    }
  }, [imdbID, user_id]);

  const addMovie = async ({ Title, Poster, imdbID }) => {
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
        return { success: false, duplicate: true };
      }
      throw new Error(error.message);
    }

    return { success: true, data };
  };

  const { mutate: addToWatchlist } = useMutation({
    mutationFn: addMovie,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("✅ Movie added to WatchList");
        setWatchStatus(true);
      } else if (res.duplicate) {
        toast.info("ℹ️ Movie already exists in WatchList");
        setWatchStatus(true);
      }
    },
    onError: () => {
      toast.error("❌ Failed to add movie");
    },
  });

  const DeleteMovie = async ({ imdbID }) => {
    const { error, data } = await supabase
      .from("movie")
      .delete()
      .eq("imdbID", imdbID)
      .eq("user_id", user_id);

    if (error) {
      console.log(error);
    }

    return data;
  };

  const { mutate: deleteFromWatchlist } = useMutation({
    mutationKey: ["deleteMovieKey"],
    mutationFn: DeleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchListKey"] });
      toast.success("Movie Removed");
      setWatchStatus(false);
    },
  });

  const fetchStreamOptions = async () => {
    try {
      const countryRes = await axios.get("https://ipapi.co/json/");
      const userCountry = countryRes.data?.country;

      const streamRes = await axios.get(
        `https://api.watchmode.com/v1/title/${imdbID}/sources/?apiKey=${
          import.meta.env.VITE_WATCH_MOVIE_API
        }`
      );

      const filteredSources = streamRes.data.filter(
        (source) => source.region === userCountry
      );

      return filteredSources;
    } catch (error) {
      console.error("Error fetching streaming options:", error);
      return [];
    }
  };

  const { data: streamAval } = useQuery({
    queryKey: ["platform-aval"],
    queryFn: fetchStreamOptions,
  });

  if (!isValid) {
    return <NotFound />;
  }

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
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-shrink-0">
                <div className="relative group">
                  <img
                    src={
                      singleMovie?.Poster !== "N/A"
                        ? singleMovie?.Poster
                        : "https://placehold.co/300x450"
                    }
                    alt={singleMovie?.Title}
                    className="w-80 h-auto rounded-lg shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg"></div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <h1 className="text-3xl lg:text-4xl max-md:text-2xl font-bold text-white mb-5">
                  {singleMovie?.Title}
                </h1>
                <div className="flex items-center gap-4 text-gray-300">
                  <span className="text-lg">{singleMovie?.Year}</span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span className="border border-gray-500 px-2 py-1 text-sm">
                    {singleMovie?.Rated}
                  </span>
                  <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                  <span>{singleMovie?.Runtime}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {singleMovie?.Genre?.split(", ").map((genre, index) => (
                    <span
                      key={index}
                      className="text-blue-400 hover:text-blue-300 cursor-pointer transition-colors"
                    >
                      {genre}
                      {index < singleMovie.Genre.split(", ").length - 1 && ","}
                    </span>
                  ))}
                </div>

                <div className="flex max-md:flex-col max-md:items-start items-center gap-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-400 text-black px-2 py-1 rounded font-bold text-sm">
                      IMDb RATING
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                      <span className="text-2xl max-sm:text-lg font-bold">
                        {singleMovie?.imdbRating}
                      </span>
                      <span className="text-gray-400">/10</span>
                    </div>
                  </div>

                  {singleMovie?.Metascore &&
                    singleMovie?.Metascore !== "N/A" && (
                      <div className="flex items-center gap-3">
                        <div className="bg-green-600 text-white px-2 py-1 rounded font-bold text-sm">
                          METASCORE
                        </div>
                        <span className="text-2xl max-sm:text-lg font-bold text-green-400">
                          {singleMovie?.Metascore}
                        </span>
                      </div>
                    )}
                </div>

                <p className="text-gray-300 text-lg max-md:text-sm leading-relaxed max-w-4xl">
                  {singleMovie?.Plot}
                </p>
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

                {watchStatus ? (
                  <button
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                    onClick={() =>
                      session
                        ? deleteFromWatchlist({ imdbID: singleMovie?.imdbID })
                        : navigate("/sign-in")
                    }
                  >
                    <Trash2 className="w-5 h-5" />
                    Remove from Watchlist
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      session
                        ? addToWatchlist({
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
                )}
                

                <div className="pt-4">
                  <div className="mt-4">
                    <h3 className="text-yellow-400 font-semibold text-lg">
                      Available On:
                    </h3>
                    {streamAval?.length > 0 ? (
                      streamAval.map((s, index) => (
                        <a
                          key={index}
                          href={s.web_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-400 hover:underline"
                        >
                          {s.name}
                        </a>
                      ))
                    ) : (
                      <p className="text-gray-400">
                        No streaming options available in your region
                      </p>
                    )}
                  </div>
                </div>

                {/* Ratings Sidebar */}
            
              <div className="space-y-6 flex max-md:flex-col  items-center justify-between">
                {/* All Ratings */}
                <div className="bg-gray-800 rounded-lg p-6 w-[400px] max-md:w-[280px]">
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
                <div className="bg-gray-800 rounded-lg p-6 w-[400px] max-md:w-[280px]">
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
      </div> 
        )}
      </div>
    </div>
  );
}
