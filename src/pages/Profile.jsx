"use client"

import { supabase } from "../db/supabase"
import { useNavigate } from "react-router"
import { useAuth } from "../context/AuthProvider"
import { User, LogOut, List, Settings, Mail, Calendar } from "lucide-react"

export default function Profile() {
  const navigate = useNavigate()
  const { session } = useAuth()
  const user = session?.user

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold">Profile</h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 text-center">
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                {user?.user_metadata?.full_name || "Movie Enthusiast"}
              </h2>
              <p className="text-gray-400 mb-4">{user?.email}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Member since {new Date(user?.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">User ID</p>
                    <p className="text-white font-mono text-sm">{user?.id}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/watchlist")}
                  className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <List className="w-6 h-6 text-yellow-400" />
                  <div className="text-left">
                    <p className="font-medium text-white">My Watchlist</p>
                    <p className="text-sm text-gray-400">View saved movies</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className="flex items-center gap-3 p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Settings className="w-6 h-6 text-yellow-400" />
                  <div className="text-left">
                    <p className="font-medium text-white">Settings</p>
                    <p className="text-sm text-gray-400">Account preferences</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Account Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full p-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
