import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import WatchList from "./pages/WatchList";
import { Toaster } from "sonner";
import MovieSearch from "./pages/MovieSearch";
import MovieView from "./pages/MovieView";
import SignIn from "./pages/SignIn";
import { useAuth } from "./context/AuthProvider";
import ScrollToTop from "./components/ScrollToTop";



function App() {

  const {session} = useAuth()
  return (
    <>
      <div>
        
          <Header />
          <ScrollToTop/>

          <Routes>
            <Route path="/" element={<Home />}></Route>

            <Route path="/movie-search" element={<MovieSearch />}></Route>

            <Route path="/watchlist" element={<WatchList />}></Route>
            <Route path="/sign-in" element={<SignIn />}></Route>

            <Route path="/movie/:imdbID" element={<MovieView/>}></Route>
          
          </Routes>

          <Footer />
          <Toaster richColors position="top-center" />
       
      </div>
    </>
  );
}

export default App;
