import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import WatchList from "./pages/WatchList";
import { Toaster } from "sonner";
import { Suspense } from "react";
import MovieView from "./pages/MovieView";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import TVShows from "./pages/TVShows";
import Movies from "./pages/Movies";
import Trending from "./pages/Trending";



function App() {

  return (
    <>
      <div>
        
          <Header />
          <ScrollToTop/>
          <Suspense fallback={
                  <div className='flex justify-center items-center h-screen'>
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                }> 

          <Routes>
            <Route path="/" element={<Home />}></Route>

       

            <Route path="/watchlist" element={<WatchList />}></Route>
            <Route path="/sign-in" element={<SignIn />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/movie/:imdbID" element={<MovieView/>}></Route>
            <Route path="/tv-shows" element={<TVShows/>}></Route>  
             <Route path="/movies" element={<Movies/>}></Route>
            <Route path="/trending" element={<Trending/>}></Route>

            <Route path="*" element={<NotFound/>}></Route>



          
          </Routes>
           </Suspense>


          <Footer />
          <Toaster richColors position="top-center" />
       
      </div>
    </>
  );
}

export default App;
