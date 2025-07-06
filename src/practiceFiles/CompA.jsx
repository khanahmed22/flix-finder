import CompB from "./CompB"
import { useState } from "react"

export default function CompA(){

  const [user,setUser] = useState("Ahmed")
  return(
    <>
      <div className="min-h-screen flex items-center flex-col bg-purple-400 ">
        <h2>Component A</h2>
        <h3>{`Hello ${user}`}</h3>
        
      </div>
    </>
  )
}