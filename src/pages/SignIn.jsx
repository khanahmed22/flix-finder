import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../db/supabase'

export default function App() {
  const [session, setSession] = useState(null)
  const user = session?.user
  const uid = user?.id
  const email = user?.email
  const username = user?.user_metadata?.full_name || user?.user_metadata?.name || email

  console.log("User UID:", uid) // ✅ test log

  useEffect(()=>{
    const addTodo = async () =>{
    const {data,error} = await supabase
      .from('tasks')
      .insert({name: username, user_id: uid})

      if(error){
        console.log(error)
      }

      return data
  }

  addTodo()

  },[uid,username])

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />
  }

  

  
  
  return (
    <div className="logged-in">
      <h1>Welcome, {username}!</h1>
      <button onClick={handleSignOut}>Sign Out</button>
      
    </div>
  )
}
