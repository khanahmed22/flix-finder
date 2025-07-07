import { supabase } from "../db/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState} from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";
import { Eye, Trash2 } from "lucide-react";

export default function WatchList() {
  const queryClient = useQueryClient(); // ✅ Enables cache control
  const [search, setSearch] = useState("");
  const {session} = useAuth()
  const user = session?.user
  const user_id = user?.id
  const navigate = useNavigate()
  
  const fetchWatchList = async () => {
    const { data, error } = await supabase.from("movie").select();
    if (error) {
      console.log(error);
    }
    return data;
  };

  const { data: watchList, isPending } = useQuery({
    queryKey: ["watchListKey", user_id],
    queryFn: fetchWatchList,
    enabled: !!user_id,
    staleTime: 1000 * 60 * 5, // cache stays fresh for 5 minutes
    refetchOnWindowFocus: false, // ❌ don't refetch on tab focus
    refetchOnMount: false, // ❌ don't refetch every time component mounts
    keepPreviousData: true,
  });

  const DeleteMovie = async ({ ImDBID }) => {
    const { error, data } = await supabase
      .from("movie")
      .delete()
      .eq("imdbID", ImDBID)
      .eq("user_id", user_id)

    if (error) {
      console.log(error);
    }

    return data;
  };

  const { mutate } = useMutation({
    mutationKey: ["deleteMovieKey"],
    mutationFn: DeleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchListKey"] }); // ✅ Use caching system properly
      toast.success("Movie Removed");
    },
  });

  const filteredList = watchList?.filter((watch) =>
    watch.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <h2 className="font-bold text-xl text-center mb-3">My WatchList</h2>

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

      <div className="grid grid-cols-3 max-md:grid-cols-1 max-md:gap-y-3 place-items-center p-3 gap-x-2 gap-y-4">
        {!isPending && filteredList?.length > 0 ? (
          filteredList.map((m, index) => (
            <div
              key={index}
              className="card bg-base-100 w-96 shadow-xl flex flex-col items-center gap-y-3 "
            >
              <img
                src={
                  m?.poster === "N/A"
                    ? "https://placehold.co/400x400"
                    : m?.poster
                }
                alt="movie image"
                className="w-[200px] object-cover rounded-lg "
              />
              <p className="font-semibold">{m.title}</p>

              <div className="flex gap-x-3 ">
                <span>
                <button
                  className="btn btn-primary "
                  onClick={() => navigate(`/movie/${m.imdbID}`)}
                >
                  <Eye size={18}/> View
                </button>
                </span>

                <button
                  onClick={() => mutate({ ImDBID: m.imdbID })}
                  className="btn btn-warning"
                > 
                <Trash2 size={18}/>
                  Delete
                  
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No Results</div>
        )}
      </div>
    </div>
  );
}
