import { useContext } from "react"
import { BioContext } from "../BioContext"
export default function Home(){

  const {myName} = useContext(BioContext)
  return(
    <>
      <div className="min-h-screen">
        WELCOME {myName}
      </div>
    </>
  )
}