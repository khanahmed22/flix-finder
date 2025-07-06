import { useContext } from "react"
import { BioContext } from "../BioContext"
export default function About(){

  const {myName,myAge} = useContext(BioContext)
  return(
    <>
      <div className="min-h-screen">
        About
        <h2>My Name is {myName} and my age is {myAge}</h2>
      </div>
    </>
  )
}