"use client"

import { useAuth } from "../context/AuthProvider"
import { useNavigate, NavLink } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Search, Menu, Film, Tv, TrendingUp, User, LogIn } from "lucide-react"

export const Header = () => {
  const { session } = useAuth()
  const [search, setSearch] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const fetchMovie = async () => {
    const API = `http://www.omdbapi.com/?s=${search}&apikey=${import.meta.env.VITE_OMPBAPI_API_KEY}`
    try {
      const res = await axios.get(API)
      return res.data.Search || []
    } catch (error) {
      console.log(error)
    }
  }

  const { data: movieResults, isPending } = useQuery({
    queryKey: ["movieSearch", search],
    queryFn: fetchMovie,
    enabled: !!search,
  })


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Film className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl max-md:text-lg font-bold text-yellow-400">MovieWatch</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                    isActive ? "text-yellow-400 bg-gray-700" : ""
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/trending"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                    isActive ? "text-yellow-400 bg-gray-700" : ""
                  }`
                }
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </NavLink>
              <NavLink
                to="/movies"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                    isActive ? "text-yellow-400 bg-gray-700" : ""
                  }`
                }
              >
                <Film className="w-4 h-4" />
                Movies
              </NavLink>
              <NavLink
                to="/tv-shows"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                    isActive ? "text-yellow-400 bg-gray-700" : ""
                  }`
                }
              >
                <Tv className="w-4 h-4" />
               Shows
              </NavLink>
              {session && (
                <NavLink
                  to="/watchlist"
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                      isActive ? "text-yellow-400 bg-gray-700" : ""
                    }`
                  }
                >
                  WatchList
                </NavLink>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setIsDropdownOpen(true)
                  }}
                  type="text"
                  className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-gray-600"
                  placeholder="Search movies, TV shows..."
                />
              </div>
              {isDropdownOpen && search && (
                <div className="absolute top-12 right-0 w-96 max-h-80 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  {isPending ? (
                    <div className="p-4 text-center text-gray-400">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto mb-2"></div>
                      Searching...
                    </div>
                  ) : movieResults?.length > 0 ? (
                    <div className="p-2">
                      {movieResults.map((m, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                          onClick={() => {
                            setIsDropdownOpen(false)
                            setSearch("")
                            navigate(`/movie/${m.imdbID}`)
                          }}
                        >
                          <img
                            src={m.Poster !== "N/A" ? m.Poster : "https://placehold.co/50x75"}
                            alt={m.Title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-white">{m.Title}</p>
                            <p className="text-sm text-gray-400">{m.Year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-400">No results found</div>
                  )}
                </div>
              )}
            </div>

            {session ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="max-md:hidden">Account</span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/sign-in")}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <LogIn className="w-4 h-4" />
               <span className="max-md:hidden">Sign In</span>
              </button>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="flex flex-col space-y-2">
              <div className="relative mb-4" ref={dropdownRef}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setIsDropdownOpen(true)
                    }}
                    type="text"
                    className="bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-gray-600"
                    placeholder="Search movies, TV shows..."
                  />
                </div>
                {isDropdownOpen && search && (
                  <div className="absolute top-12 left-0 right-0 max-h-60 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                    {isPending ? (
                      <div className="p-4 text-center text-gray-400">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto mb-2"></div>
                        Searching...
                      </div>
                    ) : movieResults?.length > 0 ? (
                      <div className="p-2">
                        {movieResults.map((m, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                            onClick={() => {
                              setIsDropdownOpen(false)
                              setSearch("")
                              setIsMobileMenuOpen(false)
                              navigate(`/movie/${m.imdbID}`)
                            }}
                          >
                            <img
                              src={m.Poster !== "N/A" ? m.Poster : "https://placehold.co/50x75"}
                              alt={m.Title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium text-white">{m.Title}</p>
                              <p className="text-sm text-gray-400">{m.Year}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-400">No results found</div>
                    )}
                  </div>
                )}
              </div>

              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                    isActive ? "text-yellow-400 bg-gray-700" : ""
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/trending"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                    isActive ? "text-yellow-400 bg-gray-700" : ""
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </NavLink>
              <NavLink
                to="/movies"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                    isActive ? "text-yellow-400 bg-gray-700" : ""
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Film className="w-4 h-4" />
                Movies
              </NavLink>
              <NavLink
                to="/tv-shows"
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                    isActive ? "text-yellow-400 bg-gray-700" : ""
                  }`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Tv className="w-4 h-4" />
                TV Shows
              </NavLink>
              {session && (
                <NavLink
                  to="/watchlist"
                  className={({ isActive }) =>
                    `flex items-center gap-2 text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                      isActive ? "text-yellow-400 bg-gray-700" : ""
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  WatchList
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
