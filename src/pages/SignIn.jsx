// App.jsx
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../db/supabase";
import { useAuth } from "../context/AuthProvider";

export default function SignIn() {
  const { session, isLoading } = useAuth();

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

  return (
    <div className="min-h-screen p-2">
      <h1>Welcome, {username}!</h1>
      <button className="btn btn-secondary" onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
