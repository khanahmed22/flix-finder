// App.jsx
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../db/supabase";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";

export default function SignIn() {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate()

  if (isLoading) return <p>Loading session...</p>;

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          
        />
      </div>
    );
  }

  else if(session){
    return  navigate('/profile')
    
  }

}