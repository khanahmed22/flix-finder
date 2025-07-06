import { createContext } from "react";

export const BioContext = createContext()

export const BioProvider = ({children}) =>{

  const myName = 'Ahmed'
  const myAge = 32
  return(
    <BioContext.Provider value={{myName , myAge}}>
      {children}
    </BioContext.Provider>
  )
}