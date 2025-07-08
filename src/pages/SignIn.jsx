// App.jsx
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../db/supabase";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router";

export default function SignIn() {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate()

  const user = session?.user;
  const email = user?.email;
  const username =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    email;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) return <p>Loading session...</p>;

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center">
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