import { useQuery } from "@tanstack/react-query"
import { supabase } from "../db/supabase"

export default function QueryTest(){

  const getMovies = async () =>{
    const {data,error} = await supabase
      .from('movie')
      .select()

    if(error){
      console.log(error)
    }

    return data
  }

  const {data: movie,isPending, refetch} = useQuery({
    queryKey: ['movie'],
    queryFn: getMovies
  })
  return(
    <div className="min-h-screen">
      <h2>Query Test</h2>

      {isPending ?<h2>Loading</h2>: movie.map((m,index)=>(
        <p key={index}>{m.title}</p>
      ))}


    </div>
  )
}