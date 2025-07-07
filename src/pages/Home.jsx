
import { useAuth } from "../context/AuthProvider"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
export default function Home(){

  const {session} = useAuth()
  

  const fetchTrending = async ()=>{
    try{
      const TMDAPI = `https://api.themoviedb.org/3/trending/movie/day?api_key=${import.meta.env.VITE_TMD_API}`
      const res = await axios.get(TMDAPI)
      return res.data.results
    }
    catch(error){
      console.log(error)
    }
  }

  const {data: trendingData}= useQuery({
    queryKey:['trending'],
    queryFn: fetchTrending
  })
  return(
    <>
      <div className="min-h-screen">
        <p>Welcome {session?.user?.email}</p>;
        {trendingData?.map((t,index)=>(
          <div key={index}>
            <img src={ `https://image.tmdb.org/t/p/w500/${t.poster_path}`}/>
            <p >{t.title}</p>
          </div>
        ))}
      </div>
    </>
  )
}