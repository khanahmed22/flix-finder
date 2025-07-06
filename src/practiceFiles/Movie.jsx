import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { supabase } from "../db/supabase"

export default function Movie(){

  const [search,setSearch] = useState("")

  const API = `http://www.omdbapi.com/?t=${search}&apikey=${import.meta.env.VITE_OMPBAPI_API_KEY}`

  const [movieResults,setMovieResults] = useState([])

  const [loading,setLoading] = useState(false)

  const [notFound,setNotFound] = useState(null)

  const getMovieData = async  (e)=>{
    
    e.preventDefault()
      if(!search) {toast.error("Type Something") 
        return}

      setLoading(true)
    try{
      const res = await axios.get(API)
      console.log(res.data.Search)
      setMovieResults(res.data.Search)
      setLoading(false)
      
      

      
    }
    catch(error){
      console.log(error)
      setNotFound("Not Found")

    }
  }

  const AddMovie = async (imdbID,Title,Poster) =>{
    console.log(imdbID,Title,Poster)
    const {data,error} = await supabase
      .from("movie")
      .insert([{title:Title,imdbID:imdbID, poster:Poster}])

      if(error){
        console.log(error)
      }

      else{
        console.log(data)
        toast.success("Added to WatchList")
      }
      
  }


  return(
    <div className="min-h-screen bg-slate-400">
      <h2 className="font-bold text-center text-xl mb-4">Movie Search</h2>
      <form onSubmit={getMovieData} className="flex items-center justify-center mb-5">
        <input value={search} className="p-3 font-semibold b-2" onChange={(e)=> setSearch(e.target.value)}/>
        <button className="bg-blue-400 p-3 font-bold rounded-r-lg" type="submit">{loading?<>Searching...</>:<>Search</>}</button>
      </form>

       <div className="grid grid-cols-3 gap-y-6 gap-x-3 place-items-center">
        {!notFound ? movieResults.map((m,index)=>(
        
            <div className="flex flex-col items-center bg-blue-600 w-[270px] rounded-xl justify-center" key={index}>
              <img src={m.Poster} className="w-[200px] object-cover h-[300px]"/>
             
              <p className="font-semibold text-white">{m.Title}</p>
              <button disabled={loading} onClick={()=> AddMovie(m.imdbID,m.Title,m.Poster)} className="mb-3 mt-3 font-bold bg-indigo-400 text-white p-2 rounded-xl text-sm">Add to Watchlist</button>
            </div>
          
        
        )): <p>{notFound}</p>}
      </div>

      
      
      
    </div>
  )
}