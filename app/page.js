"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function Home() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      console.log("bfddovdfvdomosp:",data)
      setUser(data.user)
    }

    getUser()
  }, [])

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <main className="flex min-h-screen items-center justify-center flex-col gap-4">

      {!user ? (
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-black text-white rounded-lg"
        >
          Sign in with Google
        </button>
      ) : (
        <>
          <p>Welcome, {user.email}</p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </>
      )}

    </main>
  )
}
