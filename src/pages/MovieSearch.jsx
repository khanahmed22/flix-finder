import { useState } from "react";
import { supabase } from "../db/supabase";
import axios from "axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast} from "sonner";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthProvider";
import { Eye, PlusCircle, Trash2 } from "lucide-react";
export default function MovieSearch() {
  const [search, setSearch] = useState("");

  const {session} = useAuth()
  const user = session?.user
  const user_id = user?.id
  const navigate = useNavigate()

  
 


  const fetchMovie = async () => {
    const API = `http://www.omdbapi.com/?s=${search}&apikey=${
      import.meta.env.VITE_OMPBAPI_API_KEY
    }`;
    try {
      const res = await axios.get(API);
      return res.data.Search || [];
    } catch (error) {
      console.log(error);
    }
  };

  const { data: movieResults, isPending } = useQuery({
    queryKey: ["movieSearch", search],
    queryFn: fetchMovie,
    enabled: !!search,
  });

  const addMovie = async ({ Title, Poster, imdbID}) => {
    const { data: supabaseData, error } = await supabase
      .from("movie")
      .insert(
        { title: Title, poster: Poster, imdbID: imdbID, user_id: user_id },
        { onConflict: "imdbID" }
      )
      .select();
    if (error) {
      console.log(error);
    }

    return supabaseData;
  };

  const { mutate } = useMutation({
    mutationKey: ["addMovie"],
    mutationFn: addMovie,

    onSuccess: (data) => {
      if (data?.length > 0) {
        toast.success("Added to WatchList");
      } else {
        toast.info("Movie already in WatchList");
      }
    },
    onError: () => toast.error("Movie Already Exists"),
  });

 

  return (
    <div className="min-h-screen">
      <h2 className="text-center text-lg font-bold mb-4">Movie Search</h2>
      <div className="flex items-center justify-center">
        <label className="input input-bordered flex items-center gap-2 mb-5">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>

     
      <div className="grid grid-cols-3 place-items-center gap-y-4">
        {!isPending && movieResults?.length > 0 ? (
          movieResults?.map((m, index) => (
            <div
              key={index}
              className="card bg-base-100 w-[400px] h-[420px] shadow-xl flex flex-col items-center gap-y-3 p-3 "
            >
              <img
                src={m.Poster === 'N/A' ? "https://placehold.co/200x200": m.Poster}
                className="w-[200px] h-[300px] object-cover rounded-lg "
              />
              <p className="font-bold text-lg">{m.Title}</p>
              <div className="flex gap-x-3">
                <button 
                  className="btn btn-primary flex items-center"
                  onClick={()=>navigate(`/movie/${m.imdbID}`)}
                > 
                 <Eye size={18}/>
                  View
                 
                </button>
                <button
                  className="btn btn-neutral flex items-center"
                  onClick={() =>
                    mutate({
                      Title: m.Title,
                      Poster: m.Poster,
                      imdbID: m.imdbID,
                    })
                  }
                > 
                  <PlusCircle size={18}/>
                  Add to WatchList
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center">
            <h2>{search === ""? <p>Start Searching</p>:<p>No Results</p>}</h2>
          </div>
        )}
      </div>
    </div>
  );
}
