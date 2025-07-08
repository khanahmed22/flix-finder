"use client"

import { Film, Mail, Github, Twitter, Instagram } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Film className="w-6 h-6 text-yellow-400" />
              <h4 className="font-bold text-yellow-400 text-xl">MovieWatch</h4>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your ultimate destination for discovering movies and TV shows. Find trending content, build your
              watchlist, and never miss what's popular.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4">Movies</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Popular Movies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Top Rated
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Upcoming
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Now Playing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4">TV Shows</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Popular Shows
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Top Rated
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  On Air
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Airing Today
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-4">Newsletter</h5>
            <p className="text-gray-400 text-sm mb-4">Stay updated with the latest movies and TV shows</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              <p>&copy; 2024 MovieWatch. All rights reserved.</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
