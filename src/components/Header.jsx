import { useAuth } from "../context/AuthProvider";
import { useNavigate,NavLink } from "react-router";
import { supabase } from "../db/supabase";

export const Header = () => {
  const { session } = useAuth();
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut(); 
    navigate("/")
  };

  return (
    <>
      <nav className="navbar bg-base-100 sticky top-0 right-0 left-0 z-10">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-lg dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                 <NavLink to="/movie-search">Movie Search</NavLink>
              </li>
              {session ? <li>
              <NavLink to='/watchlist'>WatchList</NavLink>
            </li>: <p></p>}
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
                <NavLink to="/">Home</NavLink>
              </li>
              <li>
                 <NavLink to="/movie-search">Movie Search</NavLink>
              </li>
              {session ? <li>
              <NavLink to='/watchlist'>WatchList</NavLink>
            </li>: <span></span>}
          </ul>
        </div>

        {session?<div className=" btn btn-warning" onClick={handleSignOut}>Sign Out</div>: <div  onClick={()=> navigate('/sign-in')} className="btn btn-primary ">Sign In</div>}
      </nav>
    </>
  );
};
