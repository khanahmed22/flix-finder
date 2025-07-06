import { useState } from "react"
export default function Crud(){

  const [todo,setTodo] = useState([])

  const [input,setInput] = useState("")
  const [editMode,setEditMode] = useState(false)
  const [editIndex,setEditIndex] = useState(null)
  

  function AddToDo(){
    setTodo([...todo,input])
    setInput("")
  }

  function DeleteToDo(index){
    setTodo(todo.filter((_ , i) => i !== index))
    
  }

  function StartEdit(index){
    setEditMode(true)
    setEditIndex(index)
    setInput(todo[index])
   
   
    
  }

  function UpdateToDo(){
    const updateTodos = [...todo]
    updateTodos[editIndex] = input
    setTodo(updateTodos)
    setInput("")
    setEditMode(false)
    setEditIndex(null)

  }


  return(
    <>
      <div className="min-h-screen p-4">
        <input className="font-bold p-3" placeholder="Enter To Do" value={input} onChange={(e)=> setInput(e.target.value)}/>
        {
          editMode ?<button className="font-bold bg-indigo-600 p-3 mb-5" onClick={UpdateToDo}>Update</button>:
          <button className="font-bold bg-indigo-600 p-3 mb-5" onClick={AddToDo}>Add</button>
        }
        

        <div>
          {todo.map((t,index)=>(
            <div className="bg-purple-700 mb-2 p-3 w-[400px] font-bold flex justify-between">
              <p key={index}>{t}</p>
              <button onClick={()=>DeleteToDo(index)} className="bg-red-700 p-2 text-white">Delete</button>
              <button onClick={()=>StartEdit(index)} className="bg-yellow-500 p-2 text-white">Edit</button>
            </div>
          ))}
        </div>

      </div>

      
    </>
  )
}