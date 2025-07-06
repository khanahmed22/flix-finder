import { useParams } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { supabase } from "../db/supabase";
import { toast } from "sonner";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";

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
      }
    },
    onError: () => {
      toast.error("❌ Failed to add movie");
    },
  });

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Movie View</h2>
      {isPending ? (
        <h2 className="text-lg">Loading...</h2>
      ) : (
        <div className="flex flex-col items-start gap-4">
          <img
            src={
              singleMovie?.Poster !== "N/A"
                ? singleMovie?.Poster
                : "https://placehold.co/400x400"
            }
            alt={singleMovie?.Title}
            className="w-[300px] rounded shadow-md"
          />
          <h2 className="text-xl font-bold">{singleMovie?.Title}</h2>
          <button
            
            onClick={() =>
              session?
              mutate({
                Title: singleMovie?.Title,
                Poster: singleMovie?.Poster,
                imdbID: singleMovie?.imdbID,
              })
              : navigate("/sign-in")
              
            }
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {session? <span>Add to WatchList</span>:<span >Sign in to Sync WatchList</span>}
          </button>
        </div>
      )}
    </>
  );
}
