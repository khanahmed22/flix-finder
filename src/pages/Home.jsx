//Home
import { useAuth } from "../context/AuthProvider"
export default function Home(){

  const {session} = useAuth()
  return(
    <>
      <div className="min-h-screen">
        <p>Welcome {session?.user?.email}</p>;
      </div>
    </>
  )
}