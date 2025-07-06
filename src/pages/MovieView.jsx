
import { useParams } from "react-router"
import { useQuery,useMutation } from "@tanstack/react-query";
import axios from "axios";
import { supabase } from "../db/supabase";
import { toast } from "sonner";
import { useState,useEffect } from "react";
export default function MovieView(){

  const {imdbID} = useParams()
   const [session, setSession] = useState(null)
  const user = session?.user
  const user_id = user?.id
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])


  

  const fetchSingleMovie = async ()=>{
    const API = `http://www.omdbapi.com/?i=${imdbID}&apikey=${
      import.meta.env.VITE_OMPBAPI_API_KEY
    }`;

    try{
      const res = await axios.get(API)
    
      return res.data || {}
      
    }

    catch(error){
      console.log(error)
    }

  }

  const {data: singleMovie,isPending} = useQuery({
    queryKey: ['singleMovie',imdbID],
    queryFn: fetchSingleMovie
  })

  const addMovie = async ({ Title, Poster, imdbID }) => {
  try {
    const { data, error } = await supabase
      .from("movie")
      .insert([
        {
          title: Title,
          poster: Poster,
          imdbID: imdbID,
          user_id: user_id,
        },
      ]);

    if (error) {
    
      if (error.code === "23505") {
        console.log("You already added this movie.");
      } else {
        console.log("Insert error:", error.message);
      }
      return;
    }

    console.log("Movie added successfully:", data);
  } catch (err) {
    console.error("Unexpected error:", err);
  }
};

  const {mutate} = useMutation({
    mutationKey:['addMovie'],
    mutationFn: addMovie,
    onSuccess: (data) => {
      if (data?.length > 0) {
        toast.success("Added to WatchList");
      } else {
        toast.info("Movie already in WatchList");
      }
    },
    onError: ()=> toast.error('Movie already exists')
  })


  return(
    <>
      <h2>Movie View</h2>
    {isPending ?<h2>Loading...</h2>:<div>
      <img src={singleMovie?.Poster !== 'N/A' ? singleMovie?.Poster : "https://placehold.co/400x400" } className="w-[400px]"/>
      <h2>{singleMovie?.Title}</h2>
      <button onClick={()=> mutate({
        Title: singleMovie?.Title,
        Poster: singleMovie?.Poster,
        imdbID: singleMovie?.imdbID
      })}>Add to WatchList</button>
    </div> }

    
    

    </>
  )
}